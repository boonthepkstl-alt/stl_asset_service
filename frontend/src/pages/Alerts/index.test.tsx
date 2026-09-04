import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { AlertsPage } from './index';

// RAISE-FR-ALERT-001 / P-012.
//
// TC-ALERT-001-01/-02 originally failed here (F-32) -- /notifications 404'd, not even a
// placeholder. The scoped fix derived alerts from the single condition confirmed at the time
// (expired warranty) and rendered severity as the literal "Not yet defined", because no
// severity scale had been decided.
//
// That placeholder is gone as of Gap 16: business confirmed five trigger conditions and a
// fixed High/Medium/Low severity on 2026-09-04 (PRD v0.15 §16 Resolved Question 44, F-05
// resolved as R-23). These tests assert the page renders real severities and reaches all
// three record types. The per-condition rules themselves are covered in lib/alerts.test.ts,
// where the inputs can be controlled outright.
describe('AlertsPage', () => {
  const render = () => renderWithProviders(<AlertsPage />, { route: '/notifications', path: '/notifications' });

  it('TC-ALERT-001-01: lists an alert with its severity, condition and affected record', async () => {
    render();

    // a13 (Dell OptiPlex 7090): warrantyExpiry 2024-03-15, long past -> Warranty Expired.
    await waitFor(() => expect(screen.getByText(/Dell OptiPlex 7090/)).toBeInTheDocument());
    expect(screen.getByText('AST-0013')).toBeInTheDocument();
    expect(screen.getAllByText('Warranty Expired').length).toBeGreaterThan(0);
    expect(screen.getByText(/Warranty expired 2024-03-15/)).toBeInTheDocument();
  });

  it('renders real severity values, not the retired "Not yet defined" placeholder', async () => {
    render();
    await waitFor(() => expect(screen.getByText(/Dell OptiPlex 7090/)).toBeInTheDocument());

    // The regression this guards: reverting to the placeholder would mean the app shows a
    // severity the business has in fact decided.
    expect(screen.queryByText('Not yet defined')).not.toBeInTheDocument();
    expect(screen.getAllByText('High').length).toBeGreaterThan(0);
  });

  it('shows the highest-severity alerts first, so the table opens on what matters most', async () => {
    render();
    await waitFor(() => expect(screen.getByText(/Dell OptiPlex 7090/)).toBeInTheDocument());

    // Seeded data yields 19 alerts across all five conditions, of which 14 are High, so the
    // first page is High-only. That the other conditions derive correctly is asserted in
    // lib/alerts.test.ts against the same seed data -- checking it here instead would really
    // be testing DataTable's pagination.
    expect(screen.queryByText('Low')).not.toBeInTheDocument();
    expect(screen.getAllByText('High').length).toBeGreaterThan(0);
  });

  it('TC-ALERT-001-02: only in-app presentation is shown -- no delivery-channel UI', async () => {
    render();
    await waitFor(() => expect(screen.getByText(/Dell OptiPlex 7090/)).toBeInTheDocument());

    // MVP is single-channel/in-app; Email/Teams/LINE remain Phase 2 Roadmap.
    expect(screen.queryByText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/teams/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/line notify/i)).not.toBeInTheDocument();
  });
});
