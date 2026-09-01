import { AUTH_API_ENABLED } from '@/config/featureFlags';
import { HttpAuthRepository, MockAuthRepository, type AuthRepository } from '@/services/auth-repository';
import type { LoginRequest, LoginResponse } from '@/types/auth';

// AUTH_API_ENABLED (config/featureFlags.ts) is off by default -- most dev/test environments
// have no go-template-main/Postgres instance running. Resolves Open Finding F-30
// (OPEN-FINDINGS.md, R-15): unlike every other domain, this previously had no Mock fallback.
const repository: AuthRepository = AUTH_API_ENABLED ? new HttpAuthRepository() : new MockAuthRepository();

export const authService = {
  login: (credentials: LoginRequest): Promise<LoginResponse> => repository.login(credentials),
  logout: (): Promise<void> => repository.logout(),
};
