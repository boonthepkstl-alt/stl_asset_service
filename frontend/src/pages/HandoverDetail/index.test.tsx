import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { HandoverDetailPage } from './index';

describe('HandoverDetailPage', () => {
  it('shows the 4-stage governance indicator with Current on the in-flight stage', async () => {
    // AHO-2026-002 (data/fixtures/handoverData.ts) is seeded PENDING_IT_PROCESSING.
    renderWithProviders(<HandoverDetailPage />, { route: '/handovers/AHO-2026-002', path: '/handovers/:handoverCode' });

    await waitFor(() => {
      expect(screen.getAllByText('AHO-2026-002').length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText('Current')).toHaveLength(1);
    expect(screen.getByText('Process / Forward for Approval')).toBeInTheDocument();
  });

  it('attributes the Rejected label to the stage it actually happened at, not always Stage 4', async () => {
    // Regression test for a bug found during live verification (2026-09-02): rejection at
    // Stage 3 (IT Processing) was displayed as if it happened at Stage 4 (IT Supervisor
    // Approval) -- the GovernanceStep detail text for Stage 4 unconditionally said "Rejected"
    // whenever handover.status === 'REJECTED', regardless of handover.rejectionStage. AHO-2026-004
    // is seeded rejected at Stage 3.
    renderWithProviders(<HandoverDetailPage />, { route: '/handovers/AHO-2026-004', path: '/handovers/:handoverCode' });

    await waitFor(() => {
      expect(screen.getAllByText('AHO-2026-004').length).toBeGreaterThan(0);
    });

    const stage3 = screen.getByText('3. IT Processing').closest('div')?.parentElement;
    const stage4 = screen.getByText('4. IT Supervisor Approval').closest('div')?.parentElement;
    expect(stage3).toHaveTextContent('Rejected');
    expect(stage4).not.toHaveTextContent('Rejected');
    expect(stage4).toHaveTextContent('Awaiting IT supervisor approval');

    expect(screen.getByText('Handover Rejected at IT Processing')).toBeInTheDocument();
  });
});
