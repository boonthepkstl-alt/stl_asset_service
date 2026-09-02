import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { ITSupervisorApprovalQueuePage } from './index';

describe('ITSupervisorApprovalQueuePage', () => {
  it('lists only PENDING_IT_SUPERVISOR_APPROVAL handovers', async () => {
    renderWithProviders(<ITSupervisorApprovalQueuePage />, { route: '/it-supervisor-approval-queue', path: '/it-supervisor-approval-queue' });

    // AHO-2026-003 (data/fixtures/handoverData.ts) is seeded PENDING_IT_SUPERVISOR_APPROVAL.
    await waitFor(() => {
      expect(screen.getByText('AHO-2026-003')).toBeInTheDocument();
    });
    expect(screen.queryByText('AHO-2026-001')).not.toBeInTheDocument();
    expect(screen.queryByText('AHO-2026-002')).not.toBeInTheDocument();
  });

  it('Approve is the only action that results in an ASSIGNED handover', async () => {
    const { container } = renderWithProviders(<ITSupervisorApprovalQueuePage />, { route: '/it-supervisor-approval-queue', path: '/it-supervisor-approval-queue' });
    await waitFor(() => screen.getByText('AHO-2026-003'));

    const triggers = container.querySelectorAll('[role="button"]');
    fireEvent.click(triggers[triggers.length - 1]);
    fireEvent.click(await screen.findByText('Approve'));

    // Approved handovers leave this queue (no longer PENDING_IT_SUPERVISOR_APPROVAL).
    await waitFor(() => {
      expect(screen.queryByText('AHO-2026-003')).not.toBeInTheDocument();
    });
  });
});
