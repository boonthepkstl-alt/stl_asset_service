package controller

import (
	"net/http"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
	"singer/go-template-new-2026-06/service"
	"singer/go-template-new-2026-06/util"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/spf13/viper"
)

type AuthController interface {
	Login(c *fiber.Ctx) error
	Logout(c *fiber.Ctx) error
}

type authController struct {
	authService service.AuthService
}

func NewAuthController(authSvc service.AuthService) AuthController {
	return &authController{authService: authSvc}
}

func authCookieOptions() (bool, string) {
	env := strings.ToLower(strings.TrimSpace(viper.GetString("APP_ENV")))
	if env == "" {
		env = strings.ToLower(strings.TrimSpace(viper.GetString("ENV")))
	}
	switch env {
	case "local", "dev", "development", "test":
		return false, "Lax"
	default:
		return true, "None"
	}
}

func (a *authController) Login(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)
	log.Info("-= AuthController:Login =-")

	var req model.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		log.Errorf("BodyParser error: %v", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Invalid request body",
		})
	}

	tokenResp, err := a.authService.Login(req.Username, req.Password)
	if err != nil {
		log.Warnf("Login attempt failed for user %q: %v", req.Username, err)
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	log.Infof("Login success for user %q role=%q", req.Username, tokenResp.User.Role)

	secure, sameSite := authCookieOptions()
	maxAge := int(tokenResp.ExpiresAt - time.Now().Unix())
	c.Cookie(&fiber.Cookie{
		Name:     "stl_token",
		Value:    tokenResp.Token,
		HTTPOnly: true,
		Secure:   secure,
		SameSite: sameSite,
		Path:     "/",
		MaxAge:   maxAge,
	})

	// Bare object, token included in the body -- matches frontend/src/types/auth.ts's
	// LoginResponse exactly. The stl_token cookie set above is dual transport (kept for a
	// possible future cookie-based auth decision, per COMPANY-FOUNDATION-BASELINE.md Sec5.2),
	// not the frontend's actual transport today. Role is uppercased for the frontend's Role
	// union without touching the JWT claim/middleware.RequireRole's internal casing -- see
	// model/authModel.go.
	responseBody := *tokenResp
	responseBody.User.Role = strings.ToUpper(responseBody.User.Role)

	return c.Status(http.StatusOK).JSON(responseBody)
}

func (a *authController) Logout(c *fiber.Ctx) error {
	log := logger.GetLoggerWithFiber(c)
	username := c.Locals("username")
	log.Infof("-= AuthController:Logout user=%v =-", username)

	if tokenStr := c.Cookies("stl_token"); tokenStr != "" {
		if claims, err := util.ValidateToken(tokenStr); err == nil && claims.ID != "" {
			util.BlacklistToken(claims.ID, claims.ExpiresAt.Unix())
		}
	}

	secure, sameSite := authCookieOptions()
	c.Cookie(&fiber.Cookie{
		Name:     "stl_token",
		Value:    "",
		HTTPOnly: true,
		Secure:   secure,
		SameSite: sameSite,
		Path:     "/",
		MaxAge:   -1,
	})

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"status":  "ok",
		"message": "Logged out successfully",
	})
}
