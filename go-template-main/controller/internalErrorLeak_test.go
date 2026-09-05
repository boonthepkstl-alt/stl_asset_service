package controller

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

// Guards Open Finding F-19: a 5xx response body must never carry the raw underlying Go error
// string. Those errors come from the database layer, so err.Error() can surface driver text,
// SQL fragments, column and constraint names, or connection details to an unauthenticated
// caller -- the response is the one place that text must not go. Every one of these sites
// already logs the error server-side, so dropping it from the body costs no diagnosability.
//
// This scan covers 5xx only. 4xx is covered separately by TestNoRawErrorTextIn404Responses
// below -- see its comment for why the original "4xx only carries sentinels" assumption
// turned out to be wrong (Open Finding F-41).
//
// This is a source-level check rather than an HTTP-level one on purpose. The existing
// controller test harness needs live MSSQL/Postgres/Tarantool handles and a signed token
// before it can serve a request, so driving all 18 call sites through real 500s would cost
// far more than the invariant is worth -- while the invariant itself ("this literal must not
// appear inside a 5xx JSON body") is exactly expressible over the source. The trade is that
// it checks the code as written, not the bytes on the wire.
func TestNoRawErrorTextIn5xxResponses(t *testing.T) {
	files, err := filepath.Glob("*.go")
	assert.NoError(t, err)
	assert.NotEmpty(t, files, "expected to find controller sources to scan")

	// Statuses whose bodies must not echo the underlying error.
	serverErrors := []string{
		"http.StatusInternalServerError",
		"http.StatusBadGateway",
		"http.StatusServiceUnavailable",
		"http.StatusGatewayTimeout",
	}

	scanned := 0
	for _, file := range files {
		if strings.HasSuffix(file, "_test.go") {
			continue
		}
		raw, readErr := os.ReadFile(file)
		assert.NoError(t, readErr)
		lines := strings.Split(strings.ReplaceAll(string(raw), "\r\n", "\n"), "\n")

		for i, line := range lines {
			matched := ""
			for _, status := range serverErrors {
				if strings.Contains(line, status) {
					matched = status
					break
				}
			}
			if matched == "" {
				continue
			}
			scanned++

			// Read the JSON body for this response: the same line for the single-line
			// fiber.Map form, or up to the closing "})" for the multi-line form.
			body := line
			if !strings.Contains(line, "})") {
				for j := i + 1; j < len(lines) && j <= i+12; j++ {
					body += "\n" + lines[j]
					if strings.Contains(lines[j], "})") {
						break
					}
				}
			}

			assert.NotContains(t, body, "err.Error()",
				"%s:%d returns a %s body containing the raw error text. Keep the human-readable "+
					"\"message\" and log the error server-side instead (Open Finding F-19).",
				file, i+1, matched)
		}
	}

	// Fails loudly if the scan silently stops matching -- e.g. if the controllers move to a
	// helper and this test starts passing because it inspects nothing at all.
	assert.GreaterOrEqual(t, scanned, 15,
		"expected to scan at least 15 server-error responses; found %d. If the controllers "+
			"were refactored (e.g. behind a shared error helper), update this test to match "+
			"rather than letting it pass vacuously", scanned)
}
// Guards Open Finding F-41: a 404 response body must never carry the raw underlying Go error
// string either.
//
// F-19's fix (the 5xx scan above) was scoped on the stated basis that 4xx bodies carry
// *sentinel* errors from the service layer whose text is meaningful validation feedback. A
// per-site audit of all 28 4xx sites proved that assumption wrong for one whole shape: every
// "get one record by id/code" handler passed the repository's error straight through, so
// `GET /api/assets/does-not-exist` answered 404 with `"error":"sql: no rows in result set"`.
//
// Worse than the confirmed case, and the reason this is not merely cosmetic: those handlers
// reach the repository through GetPGReadDB, which returns a *connection* error when the pool
// cannot be built (repository/dbManager.go -- masterAsRead -> GetPGWriteDb -> openPGPool ->
// db.Ping()). A database outage therefore surfaced as a 404 whose "error" field carried the
// driver's dial text, host and port included -- exactly the class of detail F-19 removed from
// 5xx, reached through a status code F-19's guard did not watch.
//
// 404 is a blanket rule rather than a per-site judgement on purpose. Where a sentinel's text
// did carry real information (mapHandoverError could not say *which* record was missing once
// the error field went), that information moved into the documented "message" field by
// splitting the branch -- which is where an API caller should have been reading it anyway.
//
// 400/401/409 are deliberately NOT scanned. Their remaining err.Error() sites are request
// parse errors (Go's json/schema decoder text) and errors.Is-guarded sentinels; removing those
// is a separate scope decision, not this finding's, and F-41 explicitly warns that a blanket
// sweep is the wrong shape of fix. Two sites there are recorded as open rather than swept --
// see OPEN-FINDINGS.md.
func TestNoRawErrorTextIn404Responses(t *testing.T) {
	files, err := filepath.Glob("*.go")
	assert.NoError(t, err)
	assert.NotEmpty(t, files, "expected to find controller sources to scan")

	scanned := 0
	for _, file := range files {
		if strings.HasSuffix(file, "_test.go") {
			continue
		}
		raw, readErr := os.ReadFile(file)
		assert.NoError(t, readErr)
		lines := strings.Split(strings.ReplaceAll(string(raw), "\r\n", "\n"), "\n")

		for i, line := range lines {
			if !strings.Contains(line, "http.StatusNotFound") {
				continue
			}
			scanned++

			body := line
			if !strings.Contains(line, "})") {
				for j := i + 1; j < len(lines) && j <= i+12; j++ {
					body += "\n" + lines[j]
					if strings.Contains(lines[j], "})") {
						break
					}
				}
			}

			assert.NotContains(t, body, "err.Error()",
				"%s:%d returns a 404 body containing the raw error text. The repository error "+
					"behind a not-found lookup can be `sql: no rows in result set` or a driver "+
					"connection error; keep the human-readable \"message\" and log the error "+
					"server-side instead (Open Finding F-41).",
				file, i+1)
		}
	}

	// Same anti-vacuity guard as the 5xx scan: fail loudly if the scan stops matching because
	// the controllers moved behind a helper, rather than passing while inspecting nothing.
	assert.GreaterOrEqual(t, scanned, 8,
		"expected to scan at least 8 not-found responses; found %d. If the controllers were "+
			"refactored (e.g. behind a shared error helper), update this test to match rather "+
			"than letting it pass vacuously", scanned)
}
