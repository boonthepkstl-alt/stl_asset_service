package model

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// TokenResponse's JSON tags are the actual wire contract the frontend's LoginResponse type
// (frontend/src/types/auth.ts) is built against -- bare object, camelCase, token in the body.
// Previously the controller wrapped this in a {status,data} envelope with snake_case
// expires_at/full_name and omitted the token from the body entirely (cookie-only), which
// silently broke every login: the frontend got `undefined` for token/expiresAt/user and never
// threw, so the UI just sat on the login page with no error. Fixed here per explicit business
// decision (resolves COMPANY-FOUNDATION-BASELINE.md Sec6 unresolved decisions #1/#2 for this
// endpoint specifically -- token transport is header+body, not cookie-only; envelope is bare,
// not wrapped).
type TokenResponse struct {
	Token     string   `json:"token"`
	ExpiresAt int64    `json:"expiresAt"`
	User      UserInfo `json:"user"`
}

// UserInfo.Role is serialized uppercase (see authController.go) to match the frontend's Role
// union (frontend/src/types/auth.ts: 'EMPLOYEE' | 'IT_STAFF' | 'IT_MANAGER' | 'ADMIN'). The
// backend's own internal role value (JWT claim, middleware.RequireRole's "admin"
// superuser-bypass check) stays lowercase -- only the outward-facing JSON is cased for the
// frontend, so no backend-internal authorization logic needed to change.
type UserInfo struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	FullName string `json:"fullName"`
	Role     string `json:"role"`
}
