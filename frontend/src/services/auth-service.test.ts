import { describe, expect, it, vi } from 'vitest';

async function freshAuthService() {
  vi.resetModules();
  const mod = await import('@/services/auth-service');
  return mod.authService;
}

// RAISE-NFR-SEC-RBAC-001 / TC-LOGIN-01/-02, previously BLOCKED (Open Finding F-30,
// OPEN-FINDINGS.md, R-15): auth-service.ts had no Mock fallback, unlike every other domain.
// MockAuthRepository (services/auth-repository.ts) resolves that, exercised here.
describe('authService (Mock, AUTH_API_ENABLED off by default)', () => {
  it('TC-LOGIN-01: valid demo credentials return a token and user for each role', async () => {
    const authService = await freshAuthService();

    const admin = await authService.login({ username: 'admin@raise.dev', password: 'demo1234' });
    expect(admin.user.role).toBe('ADMIN');
    expect(admin.token).toBeTruthy();

    const employee = await authService.login({ username: 'employee@raise.dev', password: 'demo1234' });
    expect(employee.user.role).toBe('EMPLOYEE');
  });

  it('TC-LOGIN-02: invalid credentials are rejected', async () => {
    const authService = await freshAuthService();

    await expect(authService.login({ username: 'admin@raise.dev', password: 'wrong-password' })).rejects.toThrow(
      'Invalid username or password',
    );
    await expect(authService.login({ username: 'nobody@raise.dev', password: 'demo1234' })).rejects.toThrow(
      'Invalid username or password',
    );
  });
});
