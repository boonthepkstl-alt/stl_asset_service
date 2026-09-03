import { screen, fireEvent, waitFor, render, cleanup } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { STORAGE_KEYS } from '@/config/constants';
import type { User } from '@/types/auth';

// Consolidated coverage for the former MyPendingAssignments / ITProcessingQueue /
// ITSupervisorApprovalQueue pages, now tabs on a single Handovers page (RAISE-FR-OPS-002
// exception, PRs #72/#74 consolidation). Fixtures (data/fixtures/handoverData.ts):
// AHO-2026-001 PENDING_RECIPIENT_CONFIRMATION, recipient "Priya Patel"
// AHO-2026-002 PENDING_IT_PROCESSING
// AHO-2026-003 PENDING_IT_SUPERVISOR_APPROVAL
//
// handoverService/handover-repository.ts hold module-level mutable state (a single
// MockHandoverRepository instance, same convention noted in services/handover-service.test.ts) --
// several tests below mutate a handover's status via UI actions (Confirm/Process/Approve/Reject)
// and later tests assert on the seeded fixture's exact starting state, so each test needs a
// clean module registry (vi.resetModules() + a fresh dynamic import of the page), matching the
// pattern already used in App.roadmap-gating.test.tsx.

function seedAuth(role: User['role'], fullName = 'Priya Patel') {
  const user: User = { id: 'e3', username: 'priya.patel', fullName, role };
  localStorage.setItem(STORAGE_KEYS.TOKEN, 'test-token');
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

async function renderPage() {
  // Every module that touches AuthContext/ToastProvider state must come from the SAME fresh
  // module graph as the dynamically re-imported page after vi.resetModules() -- a statically
  // imported AuthProvider from a module instance created before resetModules() would carry a
  // different React Context object than the one HandoversPage's fresh useAuth() reads from.
  const { HandoversPage } = await import('./index');
  const { AuthProvider } = await import('@/contexts/AuthContext');
  const { ToastProvider } = await import('@/components/ui');
  return render(
    <MemoryRouter initialEntries={['/handovers']}>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/handovers" element={<HandoversPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

function clickLastRowActionTrigger(container: HTMLElement) {
  const triggers = container.querySelectorAll('[role="button"]');
  fireEvent.click(triggers[triggers.length - 1]);
}

describe('HandoversPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  afterEach(() => {
    cleanup();
  });

  describe('My Pending tab', () => {
    it('is visible to all roles and defaults to active for EMPLOYEE/ADMIN', async () => {
      seedAuth('EMPLOYEE');
      await renderPage();
      await waitFor(() => {
        expect(screen.getByText('AHO-2026-001')).toBeInTheDocument();
      });
    });

    it('shows only the pending-confirmation handovers whose recipient matches the logged-in user', async () => {
      seedAuth('EMPLOYEE', 'Priya Patel');
      await renderPage();

      await waitFor(() => {
        expect(screen.getByText('AHO-2026-001')).toBeInTheDocument();
      });
      expect(screen.queryByText('AHO-2026-002')).not.toBeInTheDocument();
      expect(screen.queryByText('AHO-2026-003')).not.toBeInTheDocument();
    });

    it('shows nothing when the logged-in user has no matching recipient records', async () => {
      seedAuth('EMPLOYEE', 'Nobody Here');
      await renderPage();

      await waitFor(() => {
        expect(screen.getByText('No pending assignments')).toBeInTheDocument();
      });
    });

    it('Confirm Receipt works and is the only row action offered besides View Details', async () => {
      seedAuth('EMPLOYEE', 'Priya Patel');
      const { container } = await renderPage();
      await waitFor(() => screen.getByText('AHO-2026-001'));

      clickLastRowActionTrigger(container);
      await waitFor(() => {
        expect(screen.getByText('Confirm Receipt')).toBeInTheDocument();
      });
      expect(screen.queryByText(/decline/i)).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Confirm Receipt'));
      await waitFor(() => {
        expect(screen.queryByText('AHO-2026-001')).not.toBeInTheDocument();
      });
    });
  });

  describe('IT Processing tab', () => {
    it('is not rendered at all for an EMPLOYEE-role user', async () => {
      seedAuth('EMPLOYEE');
      await renderPage();
      await waitFor(() => screen.getByText('AHO-2026-001'));
      expect(screen.queryByText('IT Processing')).not.toBeInTheDocument();
    });

    it('is visible for IT_STAFF and defaults to active', async () => {
      seedAuth('IT_STAFF');
      await renderPage();
      await waitFor(() => {
        expect(screen.getByText('AHO-2026-002')).toBeInTheDocument();
      });
    });

    it('is visible for ADMIN (but My Pending stays the default tab)', async () => {
      seedAuth('ADMIN');
      await renderPage();
      await waitFor(() => screen.getByText('AHO-2026-001'));
      expect(screen.getByText('IT Processing')).toBeInTheDocument();

      fireEvent.click(screen.getByText('IT Processing'));
      await waitFor(() => {
        expect(screen.getByText('AHO-2026-002')).toBeInTheDocument();
      });
    });

    it('lists only PENDING_IT_PROCESSING handovers', async () => {
      seedAuth('IT_STAFF');
      await renderPage();

      await waitFor(() => {
        expect(screen.getByText('AHO-2026-002')).toBeInTheDocument();
      });
      expect(screen.queryByText('AHO-2026-001')).not.toBeInTheDocument();
      expect(screen.queryByText('AHO-2026-003')).not.toBeInTheDocument();
    });

    it('Process / Forward for Approval moves the handover out of this queue', async () => {
      seedAuth('IT_STAFF');
      const { container } = await renderPage();
      await waitFor(() => screen.getByText('AHO-2026-002'));

      clickLastRowActionTrigger(container);
      fireEvent.click(await screen.findByText('Process / Forward for Approval'));

      await waitFor(() => {
        expect(screen.queryByText('AHO-2026-002')).not.toBeInTheDocument();
      });
    });

    it('Reject asks for a reason and removes the handover from the queue', async () => {
      seedAuth('IT_STAFF');
      const { container } = await renderPage();
      await waitFor(() => screen.getByText('AHO-2026-002'));

      clickLastRowActionTrigger(container);
      fireEvent.click(await screen.findByText('Reject'));

      // Textarea (components/ui/Textarea.tsx) only wires up htmlFor/id when an explicit id or
      // name prop is passed, neither of which this Reject modal's Textarea supplies -- so its
      // "Reason" label isn't programmatically associated with the control. Locate it by
      // placeholder instead rather than widening scope to touch a shared UI component.
      const reasonInput = await screen.findByPlaceholderText('Why is this handover being rejected?');
      fireEvent.change(reasonInput, { target: { value: 'Wrong recipient' } });
      fireEvent.click(screen.getByText('Confirm Reject'));

      await waitFor(() => {
        expect(screen.queryByText('AHO-2026-002')).not.toBeInTheDocument();
      });
    });
  });

  describe('Supervisor Approval tab', () => {
    it('is not rendered at all for an IT_STAFF-role user', async () => {
      seedAuth('IT_STAFF');
      await renderPage();
      await waitFor(() => screen.getByText('AHO-2026-002'));
      expect(screen.queryByText('Supervisor Approval')).not.toBeInTheDocument();
    });

    it('is not rendered at all for an EMPLOYEE-role user', async () => {
      seedAuth('EMPLOYEE');
      await renderPage();
      await waitFor(() => screen.getByText('AHO-2026-001'));
      expect(screen.queryByText('Supervisor Approval')).not.toBeInTheDocument();
    });

    it('is visible for IT_MANAGER and defaults to active', async () => {
      seedAuth('IT_MANAGER');
      await renderPage();
      await waitFor(() => {
        expect(screen.getByText('AHO-2026-003')).toBeInTheDocument();
      });
    });

    it('is visible for ADMIN (but My Pending stays the default tab)', async () => {
      seedAuth('ADMIN');
      await renderPage();
      await waitFor(() => screen.getByText('AHO-2026-001'));
      expect(screen.getByText('Supervisor Approval')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Supervisor Approval'));
      await waitFor(() => {
        expect(screen.getByText('AHO-2026-003')).toBeInTheDocument();
      });
    });

    it('lists only PENDING_IT_SUPERVISOR_APPROVAL handovers', async () => {
      seedAuth('IT_MANAGER');
      await renderPage();

      await waitFor(() => {
        expect(screen.getByText('AHO-2026-003')).toBeInTheDocument();
      });
      expect(screen.queryByText('AHO-2026-001')).not.toBeInTheDocument();
      expect(screen.queryByText('AHO-2026-002')).not.toBeInTheDocument();
    });

    it('Approve assigns the asset and removes the handover from the queue', async () => {
      seedAuth('IT_MANAGER');
      const { container } = await renderPage();
      await waitFor(() => screen.getByText('AHO-2026-003'));

      clickLastRowActionTrigger(container);
      fireEvent.click(await screen.findByText('Approve'));

      await waitFor(() => {
        expect(screen.queryByText('AHO-2026-003')).not.toBeInTheDocument();
      });
    });

    it('Reject asks for a reason and removes the handover from the queue', async () => {
      seedAuth('IT_MANAGER');
      const { container } = await renderPage();
      await waitFor(() => screen.getByText('AHO-2026-003'));

      clickLastRowActionTrigger(container);
      fireEvent.click(await screen.findByText('Reject'));

      // Textarea (components/ui/Textarea.tsx) only wires up htmlFor/id when an explicit id or
      // name prop is passed, neither of which this Reject modal's Textarea supplies -- so its
      // "Reason" label isn't programmatically associated with the control. Locate it by
      // placeholder instead rather than widening scope to touch a shared UI component.
      const reasonInput = await screen.findByPlaceholderText('Why is this handover being rejected?');
      fireEvent.change(reasonInput, { target: { value: 'Budget hold' } });
      fireEvent.click(screen.getByText('Confirm Reject'));

      await waitFor(() => {
        expect(screen.queryByText('AHO-2026-003')).not.toBeInTheDocument();
      });
    });
  });
});
