package service

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

// Closes Gap 26(a): before this file, the frontend and backend SLA maps were each asserted
// by their own separately-written expectations that happened to agree, and
// ticketService.go's comment claiming it "mirrors the frontend map exactly" was verified by
// nothing executable. This test is the thing that verifies it.
//
// It reads the TypeScript source rather than sharing a fixture between the two runtimes, per
// the 2026-09-09 decision recorded in CHECKPOINT-2026-09-09-003: the gap is a coverage gap,
// not a correctness bug -- the values do agree, and what was missing is something that fails
// when they stop agreeing. A shared fixture or a backend-owned endpoint would each change
// production code to close a hole that has never produced a wrong value.
//
// The known cost of this choice is fragility: it reads a path and a literal that a frontend
// refactor could move. That cost is paid deliberately and is contained by the rule below.
//
// EVERY failure mode here fails the test. It must never fall through to a pass because it
// could not find what it was looking for -- a check that silently skips when its input goes
// missing reports "green" for the exact refactor that would break the contract. This is the
// direct lesson of the SlaTargetHours/SLATargetHours grep error corrected in PR #123: an
// empty search result was read as evidence of absence when it was evidence of a wrong
// pattern. So: file missing, regex unmatched, an unparseable number, a priority present in
// one map but not the other, or any value mismatch -- all FAIL, each naming what to do.
//
// RUN THIS WITH `-count=1`. The file it reads is outside this Go module, and the test cache
// does not track it: verified 2026-09-09 by setting the frontend map to a wrong value and
// running twice -- plain `go test` reported `ok (cached)` while `-count=1` reported FAIL. So
// a frontend-only drift can be served a stale green by a cached run. CI passes `-count=1`
// for exactly this reason (.github/workflows/ci.yml, Test step). This is a real limitation
// of reading a foreign-runtime source, stated here rather than left to be rediscovered.
const frontendTicketServicePath = "../../frontend/src/services/ticket-service.ts"

// slaHoursLiteral matches the object literal on the SLA_HOURS declaration line, e.g.
//
//	const SLA_HOURS: Record<CreateTicketInput['priority'], number> = { Critical: 2, ... };
//
// It deliberately anchors on `SLA_HOURS` and takes everything to the closing brace, so a
// rename or a move to another file fails loudly rather than matching something else.
var (
	slaHoursLiteral = regexp.MustCompile(`(?s)\bSLA_HOURS\b[^=]*=\s*\{(.*?)\}`)
	slaHoursEntry   = regexp.MustCompile(`([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(-?\d+)`)
)

// parseFrontendSLAHours returns the frontend's SLA_HOURS map, or an error explaining which
// step failed. It never returns an empty map with a nil error.
func parseFrontendSLAHours(path string) (map[string]int, error) {
	source, err := os.ReadFile(path)
	if err != nil {
		abs, _ := filepath.Abs(path)
		return nil, fmt.Errorf("could not read the frontend ticket service at %s (resolved to %s): %w", path, abs, err)
	}

	match := slaHoursLiteral.FindSubmatch(source)
	if match == nil {
		return nil, fmt.Errorf("found %s but no `SLA_HOURS = { ... }` declaration in it", path)
	}

	entries := slaHoursEntry.FindAllStringSubmatch(string(match[1]), -1)
	if len(entries) == 0 {
		return nil, fmt.Errorf("matched SLA_HOURS in %s but its literal contained no `Priority: number` entries: %q", path, strings.TrimSpace(string(match[1])))
	}

	parsed := make(map[string]int, len(entries))
	for _, entry := range entries {
		priority, raw := entry[1], entry[2]
		hours, convErr := strconv.Atoi(raw)
		if convErr != nil {
			return nil, fmt.Errorf("SLA_HOURS entry %q in %s has a non-integer value %q: %w", priority, path, raw, convErr)
		}
		if _, duplicate := parsed[priority]; duplicate {
			return nil, fmt.Errorf("SLA_HOURS in %s declares %q more than once", path, priority)
		}
		parsed[priority] = hours
	}
	return parsed, nil
}

// TestSLAHoursMatchesFrontendContract is the cross-tier check itself: the two maps must
// contain the same priorities with the same hours, in both directions.
func TestSLAHoursMatchesFrontendContract(t *testing.T) {
	frontend, err := parseFrontendSLAHours(frontendTicketServicePath)
	if err != nil {
		t.Fatalf("cannot verify the SLA contract, so it is NOT verified: %v\n"+
			"Fix the path or the pattern in this test, or -- if the frontend genuinely no longer "+
			"defines SLA_HOURS here -- delete this test deliberately and record why. Do not leave "+
			"it passing on an unread file.", err)
	}

	// Backend -> frontend: nothing the Go map stamps may be missing or different upstream.
	for priority, backendHours := range slaHours {
		frontendHours, present := frontend[priority]
		if !assert.Truef(t, present, "backend slaHours defines %q but the frontend SLA_HOURS does not", priority) {
			continue
		}
		assert.Equalf(t, backendHours, frontendHours,
			"SLA hours for %q disagree across tiers: %s says %d, %s says %d",
			priority, "ticketService.go", backendHours, frontendTicketServicePath, frontendHours)
	}

	// Frontend -> backend: and nothing may exist only on the frontend, which would ship a
	// priority the API silently stamps 0 for (see
	// TestCreateTicket_UnknownPriorityGetsZeroSLATarget).
	for priority := range frontend {
		_, present := slaHours[priority]
		assert.Truef(t, present, "frontend SLA_HOURS defines %q but the backend slaHours does not", priority)
	}

	// Both maps must still be the four confirmed priorities. Without this, deleting the same
	// entry from both files would leave the two "in agreement" and the test green, while the
	// shipped behaviour quietly stopped matching PRD §16 Resolved Question 53.
	assert.Len(t, frontend, 4, "expected the four priorities confirmed in PRD §16 RQ53; a change here needs a business decision, not a test edit")
	assert.Len(t, slaHours, 4, "expected the four priorities confirmed in PRD §16 RQ53; a change here needs a business decision, not a test edit")
}
