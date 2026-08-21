import { screen, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, expect, it, beforeEach } from 'vitest';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/App';
import { STORAGE_KEYS } from '@/config/constants';
import type { User } from '@/types/auth';

// Regression coverage for the RBAC route-guard fix: ProtectedRoute must reject an authenticated
// user whose role isn't in allowedRoles, not just check isAuthenticated (the original blocker
// documented in docs/template-analysis/FRONTEND-FOUNDATION-BASELINE.md).
function seedAuth(role: User['role']) {
  const user: User = { id: 'u1', username: 'test.user', fullName: 'Test User', role };
  localStorage.setItem(STORAGE_KEYS.TOKEN, 'test-token');
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function RbacHarness({ initialRoute }: { initialRoute: string }) {
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <Routes>
          <Route path="/forbidden" element={<div>Forbidden Page</div>} />
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/administration" element={<div>Admin Page</div>} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('ProtectedRoute role enforcement', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects a non-ADMIN authenticated user away from an ADMIN-only route', async () => {
    seedAuth('EMPLOYEE');
    render(<RbacHarness initialRoute="/administration" />);

    await waitFor(() => {
      expect(screen.getByText('Forbidden Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('Admin Page')).not.toBeInTheDocument();
  });

  it('allows an ADMIN user through to an ADMIN-only route', async () => {
    seedAuth('ADMIN');
    render(<RbacHarness initialRoute="/administration" />);

    await waitFor(() => {
      expect(screen.getByText('Admin Page')).toBeInTheDocument();
    });
  });

  it('still allows any authenticated role through a route with no allowedRoles restriction', async () => {
    seedAuth('EMPLOYEE');
    render(<RbacHarness initialRoute="/dashboard" />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });
});
