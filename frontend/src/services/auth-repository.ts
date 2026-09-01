import apiClient from '@/services/api-client';
import { API_ENDPOINTS } from '@/config/constants';
import type { LoginRequest, LoginResponse, User } from '@/types/auth';

/**
 * Contract the AuthService depends on. HttpAuthRepository (below) is the real
 * implementation, backed by go-template-main's authController (POST /auth/login,
 * /auth/logout) -- gated off by default behind AUTH_API_ENABLED (config/featureFlags.ts)
 * since most dev/test environments have no backend/Postgres running. MockAuthRepository is
 * the fallback used whenever that flag is off. Swapping between them here is the only
 * place AuthContext or any page needs to change (Open Finding F-30, OPEN-FINDINGS.md, R-15).
 */
export interface AuthRepository {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
}

function simulateNetwork<T>(value: T, delayMs = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), delayMs));
}

interface DemoAccount {
  username: string;
  password: string;
  user: User;
}

// One demo account per Role (types/auth.ts) so RBAC can be exercised in mock mode without a
// real backend. Confirmed by explicit user decision 2026-09-01 (F-30) -- not invented.
const DEMO_ACCOUNTS: DemoAccount[] = [
  { username: 'admin@raise.dev', password: 'demo1234', user: { id: 'u-admin', username: 'admin@raise.dev', fullName: 'Demo Admin', role: 'ADMIN' } },
  { username: 'manager@raise.dev', password: 'demo1234', user: { id: 'u-manager', username: 'manager@raise.dev', fullName: 'Demo IT Manager', role: 'IT_MANAGER' } },
  { username: 'itstaff@raise.dev', password: 'demo1234', user: { id: 'u-itstaff', username: 'itstaff@raise.dev', fullName: 'Demo IT Staff', role: 'IT_STAFF' } },
  { username: 'employee@raise.dev', password: 'demo1234', user: { id: 'u-employee', username: 'employee@raise.dev', fullName: 'Demo Employee', role: 'EMPLOYEE' } },
];

/**
 * In-memory demo login -- no persistence beyond the current session, same limitation every
 * other Mock*Repository in this app has. TC-LOGIN-01 (valid credentials) matches any of the
 * 4 DEMO_ACCOUNTS above; TC-LOGIN-02 (invalid credentials) rejects everything else.
 */
export class MockAuthRepository implements AuthRepository {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await simulateNetwork(undefined);
    const account = DEMO_ACCOUNTS.find((a) => a.username === credentials.username && a.password === credentials.password);
    if (!account) {
      throw new Error('Invalid username or password');
    }
    return {
      token: `mock-token-${account.user.id}`,
      expiresAt: Date.now() + 1000 * 60 * 60 * 8,
      user: account.user,
    };
  }

  async logout(): Promise<void> {
    return simulateNetwork(undefined);
  }
}

// Maps directly onto go-template-main's authController (POST /auth/login, /auth/logout).
// go-template's demo AuthService is a hardcoded single-user stub (see AUTH-RBAC.md) -- this
// repository already targets the real contract so swapping the backend implementation later
// requires no frontend change beyond AUTH_API_ENABLED.
export class HttpAuthRepository implements AuthRepository {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  }
}
