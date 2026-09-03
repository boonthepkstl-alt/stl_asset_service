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
            <Route path="/settings" element={<div>Settings Page</div>} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            <Route path="/handovers" element={<div>Handovers Page</div>} />
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

  // AC-WARRANTY-001-06 (TC-WARRANTY-001-06, resolved 2026-09-01): Settings -- which now
  // includes the per-Category Warranty Expiring-threshold editor (P-018) -- is admin-only,
  // at the same UI-only MVP RBAC enforcement level as Administration/User/Role Management.
  it('TC-WARRANTY-001-06: redirects a non-ADMIN authenticated user away from Settings', async () => {
    seedAuth('EMPLOYEE');
    render(<RbacHarness initialRoute="/settings" />);

    await waitFor(() => {
      expect(screen.getByText('Forbidden Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('Settings Page')).not.toBeInTheDocument();
  });

  it('TC-WARRANTY-001-06: allows an ADMIN user through to Settings', async () => {
    seedAuth('ADMIN');
    render(<RbacHarness initialRoute="/settings" />);

    await waitFor(() => {
      expect(screen.getByText('Settings Page')).toBeInTheDocument();
    });
  });

  // RAISE-FR-OPS-002 exception (IT Hardware Assignment Approval Workflow, PRs #72/#74). The 3
  // former stage-specific pages (My Pending Assignments / IT Processing Queue / IT Supervisor
  // Approval Queue) were consolidated into a single /handovers page with role-aware tabs,
  // mirroring Maintenance's pattern -- there is no longer a route-level role restriction for
  // any of the 3 stages; that gating is now a page-level (tab-visibility) concern, covered in
  // pages/Handovers/index.test.tsx instead.
  it.each(['EMPLOYEE', 'IT_STAFF', 'IT_MANAGER', 'ADMIN'] as const)('allows a %s user through to /handovers (no route-level role restriction)', async (role) => {
    seedAuth(role);
    render(<RbacHarness initialRoute="/handovers" />);

    await waitFor(() => {
      expect(screen.getByText('Handovers Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('Forbidden Page')).not.toBeInTheDocument();
  });
});
