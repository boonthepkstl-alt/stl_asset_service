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
// 4xx bodies deliberately keep err.Error() and are NOT checked here: those carry sentinel
// errors defined in the service layer (ErrAssetNotITHardware, ErrHandoverWrongStage, ...)
// whose text is meaningful, expected validation feedback rather than internal detail.
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
