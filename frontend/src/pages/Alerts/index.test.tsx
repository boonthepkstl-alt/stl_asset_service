import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { AlertsPage } from './index';

// RAISE-FR-ALERT-001 / AC-ALERT-001-01/-02, formally executed as TC-ALERT-001-01/-02
// (CHECKPOINT-2026-08-29-006). Originally failed here (F-32, OPEN-FINDINGS.md) -- the
// /notifications route 404'd, not even a placeholder. Scoped fix per explicit user decision:
// derives alerts from the one condition already confirmed elsewhere (expired warranty).
describe('AlertsPage', () => {
  it('TC-ALERT-001-01: lists an alert with severity, description, and the associated asset', async () => {
    renderWithProviders(<AlertsPage />, { route: '/notifications', path: '/notifications' });

    // a13 (Dell OptiPlex 7090): warrantyExpiry 2024-03-15 (Expired).
    await waitFor(() => screen.getByText(/Dell OptiPlex 7090/));
    expect(screen.getByText('AST-0013')).toBeInTheDocument();
    expect(screen.getByText(/Warranty expired 2024-03-15/)).toBeInTheDocument();
    expect(screen.getAllByText('Not yet defined').length).toBeGreaterThan(0);
  });

  it('TC-ALERT-001-02: only in-app presentation is shown -- no delivery-channel UI', async () => {
    renderWithProviders(<AlertsPage />, { route: '/notifications', path: '/notifications' });
    await waitFor(() => screen.getByText(/Dell OptiPlex 7090/));

    expect(screen.queryByText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/teams/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/line notify/i)).not.toBeInTheDocument();
  });
});
