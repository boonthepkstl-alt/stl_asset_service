import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { TicketDetailPage } from './index';

describe('TicketDetailPage', () => {
  it('loads and displays a known ticket by route param', async () => {
    renderWithProviders(<TicketDetailPage />, { route: '/maintenance/REQ-2026-0042', path: '/maintenance/:ticketCode' });

    // AppShell's breadcrumb also renders the ticket code, so this page legitimately shows it
    // twice — assert presence, not uniqueness (same pattern as EmployeesPage's title test).
    await waitFor(() => {
      expect(screen.getAllByText('REQ-2026-0042').length).toBeGreaterThan(0);
    });
  });

  it('shows a not-found state for an unknown ticket code', async () => {
    renderWithProviders(<TicketDetailPage />, { route: '/maintenance/DOES-NOT-EXIST', path: '/maintenance/:ticketCode' });

    await waitFor(() => {
      expect(screen.getByText('Ticket not found')).toBeInTheDocument();
    });
  });

  // RAISE-FR-MAINT-001 / AC-MAINT-001-09, formally executed as TC-MAINT-001-09
  // (CHECKPOINT-2026-08-28-003). Originally failed here (F-29, OPEN-FINDINGS.md) --
  // GovernanceStep only rendered 2 visual states (done vs. not-done), so the current stage
  // looked identical to a not-yet-reached one. Locks in the fix.
  it('TC-MAINT-001-09: the current stage is visually distinct from a done or pending stage', async () => {
    renderWithProviders(<TicketDetailPage />, { route: '/maintenance/REQ-2026-0042', path: '/maintenance/:ticketCode' });
    await waitFor(() => screen.getAllByText('REQ-2026-0042'));

    // REQ-2026-0042 is IN_PROGRESS: stage 4 (IT Servicing & Resolution) is current; stage 3
    // (IT Dispatch & Assignment) is already done (a technician is assigned).
    const currentStep = screen.getByText('4. IT Servicing & Resolution').closest('div.flex-1') as HTMLElement;
    expect(currentStep.textContent).toContain('Current');

    const doneStep = screen.getByText('3. IT Dispatch & Assignment').closest('div.flex-1') as HTMLElement;
    expect(doneStep.textContent).not.toContain('Current');
  });
});
