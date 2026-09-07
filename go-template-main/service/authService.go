package service

import (
	"errors"
	"fmt"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
	"singer/go-template-new-2026-06/util"

	"github.com/spf13/viper"
)

// Sentinel errors so authController can tell an authentication failure (the caller's
// fault, 401) from a token-signing failure (ours, 5xx). Before Open Finding F-43 every
// one of these came back as a bare errors.New and the controller answered 401 for all
// three, which reported a server-side signing failure as if the user had typed the wrong
// password -- and put the signing error's own text in the response body.
//
// The two authentication messages keep their exact original wording: they are the only
// part of this that a caller legitimately reads.
var (
	ErrMissingCredentials = errors.New("username and password are required")
	ErrInvalidCredentials = errors.New("invalid credentials")
	// ErrTokenGeneration wraps the signing failure. The controller maps it to a 5xx and
	// discards the detail, which stays in the server log (Open Finding F-19's rule,
	// extended here to the one 4xx site that was reporting a server error).
	ErrTokenGeneration = errors.New("failed to issue authentication token")
)

type AuthService interface {
	Login(username, password string) (*model.TokenResponse, error)
}

type authService struct{}

func NewAuthService() AuthService {
	return &authService{}
}

func (s *authService) Login(username, password string) (*model.TokenResponse, error) {
	log := logger.GetLogger()

	if username == "" || password == "" {
		return nil, ErrMissingCredentials
	}

	demoUsername := viper.GetString("AUTH_DEMO_USERNAME")
	demoPassword := viper.GetString("AUTH_DEMO_PASSWORD")
	demoRole := viper.GetString("AUTH_DEMO_ROLE")
	demoFullName := viper.GetString("AUTH_DEMO_FULL_NAME")
	if demoUsername == "" {
		demoUsername = "admin"
	}
	if demoPassword == "" {
		demoPassword = "password"
	}
	if demoRole == "" {
		demoRole = "admin"
	}
	if demoFullName == "" {
		demoFullName = "Template Admin"
	}

	if username != demoUsername || password != demoPassword {
		log.Warnf("Login failed for user: %s", username)
		return nil, ErrInvalidCredentials
	}

	token, expiresAt, err := util.GenerateToken(username, username, demoRole, demoFullName)
	if err != nil {
		log.Errorf("Failed to generate token: %v", err)
		return nil, fmt.Errorf("%w: %v", ErrTokenGeneration, err)
	}

	return &model.TokenResponse{
		Token:     token,
		ExpiresAt: expiresAt,
		User: model.UserInfo{
			ID:       username,
			Username: username,
			FullName: demoFullName,
			Role:     demoRole,
		},
	}, nil
}
