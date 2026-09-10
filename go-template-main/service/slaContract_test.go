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

// slaHoursOpen matches up to and including the opening brace of the SLA_HOURS declaration,
// e.g. the underlined part of:
//
//	const SLA_HOURS: Record<CreateTicketInput['priority'], number> = { Critical: 2, ... };
//	                                                                  ^ match ends here
//
// It deliberately anchors on `SLA_HOURS` so a rename or a move to another file fails loudly
// rather than matching something else. It intentionally does NOT also match the closing
// brace: a regex has no way to find the brace that actually balances an opening one -- a
// naive `\{(.*?)\}` (non-greedy) stops at the FIRST `}` regardless of nesting, so it would
// silently truncate if the literal ever gained a nested value (`Critical: { hours: 2 }`) or
// an inline `//` comment containing `}` before the real close. Finding 5 (2026-09-09 code
// review) named exactly these two cases; extractBalancedObjectBody below, not a regex, finds
// the true matching close by counting brace depth and skipping `//` comments as it goes.
var (
	slaHoursOpen  = regexp.MustCompile(`(?s)\bSLA_HOURS\b[^=]*=\s*\{`)
	slaHoursEntry = regexp.MustCompile(`([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(-?\d+)`)
)

// extractBalancedObjectBody returns the source between the object literal's opening brace
// (whose index, pointing AT the `{`, is openBraceIdx) and the `}` that actually closes it,
// exclusive of both braces. It tracks nesting depth rather than stopping at the first `}`,
// and skips over `//`-style line comments while scanning so a comment containing a stray `}`
// can't be mistaken for the real close either. It does not need to understand string literals:
// the only thing ever extracted from the body afterward is `identifier: number` pairs (see
// slaHoursEntry), so a `}` inside a string that happens to survive this scan changes nothing
// about what gets parsed out of the result.
func extractBalancedObjectBody(source []byte, openBraceIdx int) (string, error) {
	depth := 1
	i := openBraceIdx + 1
	for i < len(source) {
		switch {
		case source[i] == '/' && i+1 < len(source) && source[i+1] == '/':
			for i < len(source) && source[i] != '\n' {
				i++
			}
			continue
		case source[i] == '{':
			depth++
		case source[i] == '}':
			depth--
			if depth == 0 {
				return string(source[openBraceIdx+1 : i]), nil
			}
		}
		i++
	}
	return "", fmt.Errorf("unterminated object literal starting at byte offset %d: never found the closing `}`", openBraceIdx)
}

// parseFrontendSLAHours returns the frontend's SLA_HOURS map, or an error explaining which
// step failed. It never returns an empty map with a nil error.
func parseFrontendSLAHours(path string) (map[string]int, error) {
	source, err := os.ReadFile(path)
	if err != nil {
		abs, _ := filepath.Abs(path)
		return nil, fmt.Errorf("could not read the frontend ticket service at %s (resolved to %s): %w", path, abs, err)
	}

	openLoc := slaHoursOpen.FindIndex(source)
	if openLoc == nil {
		return nil, fmt.Errorf("found %s but no `SLA_HOURS = { ... }` declaration in it", path)
	}
	openBraceIdx := openLoc[1] - 1 // FindIndex's end is exclusive; the brace is the last byte matched

	body, err := extractBalancedObjectBody(source, openBraceIdx)
	if err != nil {
		return nil, fmt.Errorf("matched the start of SLA_HOURS in %s but could not find its end: %w", path, err)
	}

	entries := slaHoursEntry.FindAllStringSubmatch(body, -1)
	if len(entries) == 0 {
		return nil, fmt.Errorf("matched SLA_HOURS in %s but its literal contained no `Priority: number` entries: %q", path, strings.TrimSpace(body))
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

// Finding 5 (2026-09-09 code review, hardened here): the old `\{(.*?)\}` regex stopped at the
// FIRST `}` after the opening brace, which is correct only by luck for today's flat,
// single-line SLA_HOURS declaration. These two cases are the ones the finding named as able to
// break that luck. Both are regression tests for extractBalancedObjectBody directly, so they
// exercise the exact fixed logic rather than the full file-reading path (that path is covered
// separately below, and by TestSLAHoursMatchesFrontendContract above against the real file).
func TestExtractBalancedObjectBody_NestedValue(t *testing.T) {
	// Under the old regex, this would have truncated at the `}` that closes `{ hours: 2 }`,
	// losing High/Medium/Low entirely -- not a loud failure, a silently short result.
	source := []byte(`const SLA_HOURS = { Critical: { hours: 2 }, High: 8, Medium: 24, Low: 48 };`)
	openIdx := strings.Index(string(source), "{")

	body, err := extractBalancedObjectBody(source, openIdx)

	assert.NoError(t, err)
	assert.Contains(t, body, "High: 8", "the old truncating regex would have cut the body before this")
	assert.Contains(t, body, "Medium: 24", "the old truncating regex would have cut the body before this")
	assert.Contains(t, body, "Low: 48", "the old truncating regex would have cut the body before this")
}

func TestExtractBalancedObjectBody_CommentContainingBrace(t *testing.T) {
	// Under the old regex, this would have truncated at the `}` inside the comment, on the
	// very first line -- losing every entry.
	source := []byte("const SLA_HOURS = {\n  // due in 2h }\n  Critical: 2, High: 8, Medium: 24, Low: 48\n};")
	openIdx := strings.Index(string(source), "{")

	body, err := extractBalancedObjectBody(source, openIdx)

	assert.NoError(t, err)
	assert.Contains(t, body, "Critical: 2", "the old truncating regex would have cut the body before this -- it's after the comment's stray `}`")
	assert.Contains(t, body, "Low: 48")
}

func TestExtractBalancedObjectBody_UnterminatedFailsLoudly(t *testing.T) {
	// No closing brace at all: must error, not return a truncated/empty body silently.
	source := []byte(`const SLA_HOURS = { Critical: 2, High: 8`)
	openIdx := strings.Index(string(source), "{")

	_, err := extractBalancedObjectBody(source, openIdx)

	assert.Error(t, err)
}

// parseFrontendSLAHours end to end, against real temp files rather than the in-memory helper
// above -- proves the fix works through the actual file-reading path this test suite depends
// on, for both cases Finding 5 named.
func TestParseFrontendSLAHours_SurvivesNestedValueAndComment(t *testing.T) {
	cases := []struct {
		name   string
		source string
	}{
		{
			name: "nested value in one entry",
			source: `const SLA_HOURS: Record<CreateTicketInput['priority'], number> = ` +
				`{ Critical: 2, High: { hours: 8 }, Medium: 24, Low: 48 };`,
		},
		{
			name: "inline comment containing a brace before the real close",
			source: "const SLA_HOURS: Record<CreateTicketInput['priority'], number> = {\n" +
				"  // was { fast: 1 } before RQ53, now:\n" +
				"  Critical: 2, High: 8, Medium: 24, Low: 48,\n" +
				"};",
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			path := filepath.Join(t.TempDir(), "ticket-service.ts")
			assert.NoError(t, os.WriteFile(path, []byte(tc.source), 0o644))

			parsed, err := parseFrontendSLAHours(path)

			assert.NoError(t, err)
			assert.Equal(t, 2, parsed["Critical"])
			assert.Equal(t, 24, parsed["Medium"])
			assert.Equal(t, 48, parsed["Low"])
			// "High" is deliberately not asserted in the nested-value case: `High: { hours: 8 }`
			// has no direct `High: <number>` entry (the number is one level deeper), so
			// slaHoursEntry correctly does not extract it as one -- that is correct parsing of
			// what's actually there, not a regression. What this test proves is that the SCAN
			// reaches Medium/Low at all, which the old truncating regex never would have.
		})
	}
}
