package model

// Maximum page size accepted by the RAISE list endpoints (2026-09-18).
//
// The value is not a new decision: controller/sampleController.go:224 already caps the company
// template's own list endpoint at 100, so this reuses a ceiling the repository had already
// established rather than inventing one -- the same move PR #129 made when it reused
// assets/audit_logs' existing pagination contract instead of designing a fresh one. This project
// forbids inventing business numbers (see Open Finding F-03, held open across four requests, and
// F-54, raised precisely because four SLA values shipped without authority), and a page-size
// ceiling chosen by preference would be exactly that.
//
// Behaviour is also taken from the template rather than chosen: an over-large limit is silently
// CLAMPED, not rejected with 400. Rejecting would be defensible and arguably clearer to an API
// consumer, but it is a different contract from the one already in this codebase, and diverging
// would forfeit the precedent this value rests on.
const MaxPageLimit = 100

// ClampPageLimit caps an explicitly requested page size at MaxPageLimit.
//
// Deliberately single-purpose: it does NOT resolve the limit<=0 default. That default is settled
// in each PG repository (limit<=0 -> the full result set) and is load-bearing -- PR #129 chose it
// so that every caller predating pagination kept its exact behaviour. Passing 0 through unchanged
// here is what preserves that.
//
// Consequence worth stating where it cannot be missed: because the default is resolved after this
// clamp and independently of it, a request that sends NO limit still receives the entire result
// set. This function bounds what a caller may ASK FOR, not what the endpoint may RETURN. Closing
// that second half would change the response of every existing caller -- a separate decision,
// deliberately not taken here.
func ClampPageLimit(limit int) int {
	if limit > MaxPageLimit {
		return MaxPageLimit
	}
	return limit
}
