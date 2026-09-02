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
          <Route element={<ProtectedRoute allowedRoles={['IT_STAFF', 'ADMIN']} />}>
            <Route path="/it-processing-queue" element={<div>IT Processing Queue Page</div>} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['IT_MANAGER', 'ADMIN']} />}>
            <Route path="/it-supervisor-approval-queue" element={<div>IT Supervisor Approval Queue Page</div>} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            <Route path="/my-pending-assignments" element={<div>My Pending Assignments Page</div>} />
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

  // RAISE-FR-OPS-002 exception (IT Hardware Assignment Approval Workflow, PRs #72-73). RBAC is
  // UI-only for MVP -- these lock in the route-guard gating documented in App.tsx: the IT
  // Processing Queue (Stage 3) to IT_STAFF/ADMIN, and the IT Supervisor Approval Queue
  // (Stage 4) to IT_MANAGER/ADMIN.
  it('redirects a non-IT_STAFF/ADMIN authenticated user away from the IT Processing Queue', async () => {
    seedAuth('EMPLOYEE');
    render(<RbacHarness initialRoute="/it-processing-queue" />);

    await waitFor(() => {
      expect(screen.getByText('Forbidden Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('IT Processing Queue Page')).not.toBeInTheDocument();
  });

  it('allows an IT_STAFF user through to the IT Processing Queue', async () => {
    seedAuth('IT_STAFF');
    render(<RbacHarness initialRoute="/it-processing-queue" />);

    await waitFor(() => {
      expect(screen.getByText('IT Processing Queue Page')).toBeInTheDocument();
    });
  });

  it('redirects an IT_STAFF user (not IT_MANAGER/ADMIN) away from the IT Supervisor Approval Queue', async () => {
    seedAuth('IT_STAFF');
    render(<RbacHarness initialRoute="/it-supervisor-approval-queue" />);

    await waitFor(() => {
      expect(screen.getByText('Forbidden Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('IT Supervisor Approval Queue Page')).not.toBeInTheDocument();
  });

  it('allows an IT_MANAGER user through to the IT Supervisor Approval Queue', async () => {
    seedAuth('IT_MANAGER');
    render(<RbacHarness initialRoute="/it-supervisor-approval-queue" />);

    await waitFor(() => {
      expect(screen.getByText('IT Supervisor Approval Queue Page')).toBeInTheDocument();
    });
  });

  it('allows any authenticated role through My Pending Assignments (no role restriction)', async () => {
    seedAuth('EMPLOYEE');
    render(<RbacHarness initialRoute="/my-pending-assignments" />);

    await waitFor(() => {
      expect(screen.getByText('My Pending Assignments Page')).toBeInTheDocument();
    });
  });
});
