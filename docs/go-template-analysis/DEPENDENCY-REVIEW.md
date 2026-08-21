# Dependency Review

Source: `go.mod` (25 direct `require` entries, ~85 indirect). No dependency was
upgraded, added, or removed during this audit.

## Production dependencies (direct)

See TECH-STACK.md for the full table with purpose/notes. Summary classification:

| Category | Packages |
|---|---|
| HTTP framework | `gofiber/fiber/v2` |
| Config | `spf13/viper` |
| Auth | `golang-jwt/jwt/v5` |
| Logging | `sirupsen/logrus`, `antonfisher/nested-logrus-formatter`, `lestrrat/go-file-rotatelogs` |
| DB drivers | `lib/pq`, `denisenkom/go-mssqldb`, `sijms/go-ora/v2`, `tarantool/go-tarantool/v2` |
| SQL row mapping | `blockloop/scan` |
| Tracing | `go.opentelemetry.io/otel*`, `otlptracehttp` |
| Secrets | `infisical/go-sdk` |
| Misc utility | `google/uuid`, `ggwhite/go-masker` |
| Test | `stretchr/testify` |

## Development-only dependencies

None declared separately — Go's module system doesn't distinguish dev/prod
dependencies the way npm does; `stretchr/testify` is the only package used exclusively
from `_test.go` files, confirmed by it being imported solely in
`controller/sampleController_test.go`.

## Unused dependencies

None found by import-graph inspection — every direct `require` entry is imported by at
least one non-test `.go` file, **except** `stretchr/testify` which is (correctly) only
imported by the test file. No direct dependency appears to be dead weight.

## Outdated / deprecated dependencies

| Package | Concern |
|---|---|
| `github.com/lestrrat/go-file-rotatelogs` | Upstream repository's last activity predates 2019 (pseudo-version dated 2018); functionally fine today (log rotation is a narrow, stable surface) but has no active maintainer — a future Go toolchain change could break it with no upstream fix forthcoming. Consider `natefinch/lumberjack` or a structured-logging library with built-in rotation as a lower-risk long-term replacement; **not urgent**. |
| `github.com/denisenkom/go-mssqldb` | Upstream project is in a "low activity" state relative to the newer `microsoft/go-mssqldb` fork, which has superseded it in parts of the Go ecosystem. Both are usable; worth a conscious choice if MSSQL support is expanded rather than an inherited default. |
| Everything else | No specific staleness concern identified at the version pins present; a full CVE/vulnerability scan (`govulncheck`) was not run in this environment (not installed, and installing tools is out of scope per audit rules) — **recommend running `govulncheck ./...` before production go-live**, not performed here. |

## Security concerns from the dependency graph itself

- No direct dependency is known-abandoned-and-broken; the two flagged above are
  "watch," not "replace immediately."
- The transitive AWS SDK v2 and Google Cloud auth surfaces (pulled in via
  `infisical/go-sdk`, most likely for its multi-backend secret-store support) are not
  imported by any of this repo's own code. They inflate `go.sum`'s size and the
  module's attack surface (more third-party code compiled in) without providing any
  functionality this template actually exercises. Not a defect — just worth knowing when
  reasoning about "what's actually running" versus "what's in the binary."

## Recommendations (not performed — analysis only)

1. Run `go list -m all` + `govulncheck ./...` before adopting this template for a real
   project, to catch any CVEs introduced since these pins were chosen.
2. Run `go mod tidy` after renaming the module (see PROJECT-STARTING-GUIDE.md) to confirm
   the dependency graph is still minimal for the new module path — not run here since it
   would modify `go.sum`, which is out of scope for a read-only audit.
3. Decide on `go-file-rotatelogs`'s replacement before it becomes a hard blocker (i.e.,
   do this proactively, not reactively).

## Document Status

Draft for Review — dependency graph read from `go.mod`; no tool installation or
`go mod tidy`/`go get` was run, per audit constraints, 2026-08-21.
