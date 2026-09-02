import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui';
import { STORAGE_KEYS } from '@/config/constants';
import type { User } from '@/types/auth';
import { MyPendingAssignmentsPage } from './index';

// Seeded handover AHO-2026-001 (data/fixtures/handoverData.ts) has recipient "Priya Patel" and
// is PENDING_RECIPIENT_CONFIRMATION -- matching this page's best-effort User.fullName ===
// recipient.name filter (see this page's KNOWN LIMITATION doc comment).
function seedAuth(fullName: string) {
  const user: User = { id: 'e3', username: 'priya.patel', fullName, role: 'EMPLOYEE' };
  localStorage.setItem(STORAGE_KEYS.TOKEN, 'test-token');
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/my-pending-assignments']}>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/my-pending-assignments" element={<MyPendingAssignmentsPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('MyPendingAssignmentsPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows only the pending-confirmation handovers whose recipient matches the logged-in user', async () => {
    seedAuth('Priya Patel');
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('AHO-2026-001')).toBeInTheDocument();
    });
    expect(screen.queryByText('AHO-2026-002')).not.toBeInTheDocument();
    expect(screen.queryByText('AHO-2026-003')).not.toBeInTheDocument();
  });

  it('shows nothing when the logged-in user has no matching recipient records', async () => {
    seedAuth('Nobody Here');
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('No pending assignments')).toBeInTheDocument();
    });
  });

  it('Confirm Receipt is the only row action offered (no decline)', async () => {
    seedAuth('Priya Patel');
    const { container } = renderPage();
    await waitFor(() => screen.getByText('AHO-2026-001'));

    // DataTable's per-row actions menu is an icon-only trigger (components/DataTable.tsx ->
    // components/ui/Dropdown.tsx) with no accessible name to query by -- open it directly.
    // AppShell's own chrome (sidebar/notifications) may render other role="button" elements
    // earlier in the DOM, but the row-actions trigger is the last one on a single-row table.
    const triggers = container.querySelectorAll('[role="button"]');
    fireEvent.click(triggers[triggers.length - 1]);

    await waitFor(() => {
      expect(screen.getByText('Confirm Receipt')).toBeInTheDocument();
    });
    expect(screen.queryByText(/decline/i)).not.toBeInTheDocument();
  });
});
