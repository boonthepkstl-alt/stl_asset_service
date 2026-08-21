package middleware

import (
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
)

// Regression coverage for the sampleRouter.go wiring pattern: JWTAuth() + RequireRole("admin")
// chained in front of a route, the way /samples' mutating endpoints are now gated (see
// docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md, Blocking Item B-1's backend residual).
// Uses BYPASS_JWT the same way jwtAuth.go's own bypass path does, so no real JWT/DB is needed.
func newRoleGatedTestApp(role string) *fiber.App {
	viper.Set("BYPASS_JWT", true)
	viper.Set("BYPASS_JWT_USER_ID", "test-user")
	viper.Set("BYPASS_JWT_USERNAME", "test-user")
	viper.Set("BYPASS_JWT_ROLE", role)

	app := fiber.New()
	app.Post("/samples", JWTAuth(), RequireRole("admin"), func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})
	return app
}

func TestRequireRole_AdminGatedMutation(t *testing.T) {
	t.Run("admin role reaches the handler", func(t *testing.T) {
		app := newRoleGatedTestApp("admin")
		resp, err := app.Test(httptest.NewRequest("POST", "/samples", nil))
		assert.NoError(t, err)
		assert.Equal(t, fiber.StatusOK, resp.StatusCode)
	})

	t.Run("non-admin role is rejected with 403", func(t *testing.T) {
		app := newRoleGatedTestApp("viewer")
		resp, err := app.Test(httptest.NewRequest("POST", "/samples", nil))
		assert.NoError(t, err)
		assert.Equal(t, fiber.StatusForbidden, resp.StatusCode)
	})

	t.Run("no token and no bypass is rejected with 401 before role is even checked", func(t *testing.T) {
		viper.Set("BYPASS_JWT", false)
		app := fiber.New()
		app.Post("/samples", JWTAuth(), RequireRole("admin"), func(c *fiber.Ctx) error {
			return c.SendStatus(fiber.StatusOK)
		})

		resp, err := app.Test(httptest.NewRequest("POST", "/samples", nil))
		assert.NoError(t, err)
		assert.Equal(t, fiber.StatusUnauthorized, resp.StatusCode)
	})
}
