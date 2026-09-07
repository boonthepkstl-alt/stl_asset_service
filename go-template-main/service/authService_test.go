package service

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

// Guards Open Finding F-43(b). authService.Login used to return three bare errors.New
// values, which authController could not tell apart -- so it answered 401 for all of
// them, including util.GenerateToken failing. That reported a server-side signing fault
// as a rejected password and put the signing error's own text in the response body.
//
// These tests pin the two halves of the fix that a future refactor could silently undo:
// the sentinels must stay distinguishable via errors.Is, and the two authentication
// messages must keep their exact original wording, since that text is the only part of
// this a caller legitimately reads. Login's happy path needs real JWT config and a
// viper-backed demo account, so it is not exercised here -- these are the error paths.

func TestLoginReturnsDistinguishableSentinels(t *testing.T) {
	svc := NewAuthService()

	// Both arguments empty, and each one empty on its own: all must be the same sentinel,
	// so the controller's single errors.Is check covers every missing-credential shape.
	for name, creds := range map[string][2]string{
		"both empty":     {"", ""},
		"username empty": {"", "somepassword"},
		"password empty": {"someuser", ""},
	} {
		t.Run(name, func(t *testing.T) {
			_, err := svc.Login(creds[0], creds[1])
			assert.ErrorIs(t, err, ErrMissingCredentials,
				"missing credentials must be reported as ErrMissingCredentials so the controller "+
					"answers 401 rather than falling through to the server-error branch")
			assert.NotErrorIs(t, err, ErrInvalidCredentials)
			assert.NotErrorIs(t, err, ErrTokenGeneration)
		})
	}
}

func TestLoginWrongCredentialsIsItsOwnSentinel(t *testing.T) {
	svc := NewAuthService()

	// No viper config is set in this test binary, so Login falls back to its documented
	// defaults (admin/password). Anything else is therefore a genuine credential mismatch.
	_, err := svc.Login("definitely-not-the-demo-user", "definitely-not-the-password")

	assert.ErrorIs(t, err, ErrInvalidCredentials,
		"a credential mismatch must be ErrInvalidCredentials -- the controller maps this to 401")
	assert.NotErrorIs(t, err, ErrTokenGeneration,
		"a wrong password must never be classified as a server-side token failure")
}

// The wording is asserted literally, not loosely. authController puts these two strings
// straight into the 401 response body, so changing them changes the API's observable
// behaviour -- which is exactly why the F-43(b) fix kept them byte-identical to the
// errors.New values they replaced, rather than tidying them up in passing.
func TestAuthenticationSentinelWordingIsUnchanged(t *testing.T) {
	assert.Equal(t, "username and password are required", ErrMissingCredentials.Error())
	assert.Equal(t, "invalid credentials", ErrInvalidCredentials.Error())
}

// ErrTokenGeneration is deliberately NOT in the pair above: its text never reaches a
// response body. The controller answers 5xx with a fixed message and logs the detail, so
// this only has to be a distinct, wrappable sentinel.
func TestTokenGenerationSentinelIsDistinctAndWrappable(t *testing.T) {
	assert.NotErrorIs(t, ErrTokenGeneration, ErrInvalidCredentials)
	assert.NotErrorIs(t, ErrTokenGeneration, ErrMissingCredentials)

	// Login wraps the underlying signing error with %w; prove that shape stays matchable
	// even with a cause attached, since that is how the controller receives it.
	wrapped := errors.Join(ErrTokenGeneration, errors.New("key is of invalid type"))
	assert.ErrorIs(t, wrapped, ErrTokenGeneration)
}
