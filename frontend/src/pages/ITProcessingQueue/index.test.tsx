import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { ITProcessingQueuePage } from './index';

describe('ITProcessingQueuePage', () => {
  it('lists only PENDING_IT_PROCESSING handovers', async () => {
    renderWithProviders(<ITProcessingQueuePage />, { route: '/it-processing-queue', path: '/it-processing-queue' });

    // AHO-2026-002 (data/fixtures/handoverData.ts) is seeded PENDING_IT_PROCESSING.
    await waitFor(() => {
      expect(screen.getByText('AHO-2026-002')).toBeInTheDocument();
    });
    expect(screen.queryByText('AHO-2026-001')).not.toBeInTheDocument();
    expect(screen.queryByText('AHO-2026-003')).not.toBeInTheDocument();
  });

  it('Process / Forward for Approval moves the handover out of this queue', async () => {
    const { container } = renderWithProviders(<ITProcessingQueuePage />, { route: '/it-processing-queue', path: '/it-processing-queue' });
    await waitFor(() => screen.getByText('AHO-2026-002'));

    const triggers = container.querySelectorAll('[role="button"]');
    fireEvent.click(triggers[triggers.length - 1]);
    fireEvent.click(await screen.findByText('Process / Forward for Approval'));

    await waitFor(() => {
      expect(screen.queryByText('AHO-2026-002')).not.toBeInTheDocument();
    });
  });
});
