import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { AssetDetailPage } from './index';

describe('AssetDetailPage', () => {
  it('loads and displays a known asset by route param', async () => {
    renderWithProviders(<AssetDetailPage />, { route: '/assets/a1', path: '/assets/:assetId' });

    await waitFor(() => {
      expect(screen.getByText('AST-0001 · C02XK1ABJGH')).toBeInTheDocument();
    });
  });

  it('shows a not-found state for an unknown asset id', async () => {
    renderWithProviders(<AssetDetailPage />, { route: '/assets/does-not-exist', path: '/assets/:assetId' });

    await waitFor(() => {
      expect(screen.getByText('Asset not found')).toBeInTheDocument();
    });
  });

  // RAISE-FR-ASSET-001 / AC-ASSET-001-D-01, formally executed as TC-ASSET-001-D-01
  // (CHECKPOINT-2026-08-26-003). Originally failed here (F-24, OPEN-FINDINGS.md) -- Financial
  // and Lifecycle were the 2 of 9 required sections missing entirely. Locks in the fix.
  it('TC-ASSET-001-D-01: Financial and Lifecycle sections are present', async () => {
    renderWithProviders(<AssetDetailPage />, { route: '/assets/a1', path: '/assets/:assetId' });
    await waitFor(() => screen.getByText('AST-0001 · C02XK1ABJGH'));

    expect(screen.getByText('Financial')).toBeInTheDocument();
    expect(screen.getByText('$3,299')).toBeInTheDocument();
    expect(screen.getByText('$2,800')).toBeInTheDocument();

    expect(screen.getByText('Lifecycle')).toBeInTheDocument();
    expect(screen.getByText('Assigned to Sarah Chen')).toBeInTheDocument();
  });

  // RAISE-FR-ASSET-003 / AC-ASSET-003-02, formally executed as TC-ASSET-003-02/-03
  // (CHECKPOINT-2026-08-26-003). Originally failed here (F-26, OPEN-FINDINGS.md) -- the History
  // tab derived a single "current custody state" row instead of an append-only chronological
  // log; a Check-in overwrote the prior entry rather than appending alongside it. Locks in the
  // fix, which renders the History tab from the same per-asset audit trail (RAISE-FR-AUDIT-001)
  // the Audit tab already uses -- append-only by construction.
  it('TC-ASSET-003-02/-03: Check-in and Assign each append a history entry without replacing prior ones', async () => {
    // a1 (MacBook Pro) is "IT Hardware" and, as of the IT Hardware Assignment Approval
    // Workflow (RAISE-FR-OPS-002 exception), no longer assigns immediately -- see the
    // dedicated "IT Hardware Assign interception" tests below. This test covers the
    // still-unaffected immediate-assign path, so it uses a3 (iPhone 15 Pro, category
    // "Mobile") instead, which starts Assigned to Marcus Johnson per seed fixture data.
    renderWithProviders(<AssetDetailPage />, { route: '/assets/a3', path: '/assets/:assetId' });
    await waitFor(() => screen.getByText('AST-0003 · IP15P0982'));

    fireEvent.click(screen.getByRole('button', { name: 'Check-in' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Assign' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Assign' }));
    const assignModal = (await screen.findByText('Assign Asset')).closest('.bg-white') as HTMLElement;
    fireEvent.change(within(assignModal).getByRole('combobox'), { target: { value: 'e1' } });
    fireEvent.click(within(assignModal).getByRole('button', { name: 'Assign' }));

    await waitFor(() => {
      expect(screen.queryByText('Assign Asset')).not.toBeInTheDocument();
    });
    // The assign/refetch cycle briefly shows a "Loading asset..." state (useAsset.refetch sets
    // loading=true) before the page (and its tab bar) re-renders -- wait for that to settle.
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Check-in' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /^History/ }));
    const historyCard = (await screen.findByText('Assignment History')).closest('.card-base') as HTMLElement;
    await waitFor(() => {
      expect(within(historyCard).getByText('Asset assigned to Sarah Chen')).toBeInTheDocument();
    });
    // The Check-in entry from before the re-assign must still be present, not overwritten
    // (there's also a toast with the coincidentally-identical title "Asset checked in" --
    // scoping to the History card avoids matching that instead).
    expect(within(historyCard).getByText('Asset checked in')).toBeInTheDocument();
  });

  // RAISE-FR-OPS-002 exception (IT Hardware Assignment Approval Workflow, PRs #72-73).
  // Assigning an "IT Hardware" category asset must NOT immediately assign it -- it must
  // create a pending handover instead, and the asset stays Available (not Assigned) until
  // Stage 4 approval. Regression guard for the non-IT-Hardware path lives in the test above.
  describe('IT Hardware Assign interception', () => {
    it('initiating an assignment on an IT Hardware asset does not immediately assign it', async () => {
      // a13 (Dell OptiPlex 7090) is "IT Hardware" and starts unassigned per seed data, with no
      // seeded active handover against it (unlike a11/a12/a2, which data/fixtures/
      // handoverData.ts already has active handovers against).
      renderWithProviders(<AssetDetailPage />, { route: '/assets/a13', path: '/assets/:assetId' });
      await waitFor(() => screen.getByRole('button', { name: 'Assign' }));

      fireEvent.click(screen.getByRole('button', { name: 'Assign' }));
      const assignModal = (await screen.findByText('Assign Asset')).closest('.bg-white') as HTMLElement;
      fireEvent.change(within(assignModal).getByRole('combobox'), { target: { value: 'e2' } });
      fireEvent.click(within(assignModal).getByRole('button', { name: 'Assign' }));

      await waitFor(() => {
        expect(screen.queryByText('Assign Asset')).not.toBeInTheDocument();
      });
      // Not "Assigned" -- a distinct pending badge, and the Assign button is replaced with an
      // "Assignment Pending" one (not Check-in, since the asset itself never transitioned to
      // Assigned). Both the header badge and the quick-action button render this text.
      await waitFor(() => {
        expect(screen.getAllByText(/Assignment Pending/).length).toBeGreaterThan(0);
      });
      expect(screen.queryByRole('button', { name: 'Check-in' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Assign' })).not.toBeInTheDocument();
    });
  });

  // RAISE-FR-MAINT-001 / AC-MAINT-001-01, formally executed as TC-MAINT-001-01
  // (CHECKPOINT-2026-08-28-003). Originally failed here (F-28, OPEN-FINDINGS.md) -- the
  // Maintenance & Tickets tab showed ticket code/priority/status/title but no date or cost.
  // Locks in the fix.
  it('TC-MAINT-001-01: maintenance records show date and cost alongside status and title', async () => {
    renderWithProviders(<AssetDetailPage />, { route: '/assets/a1', path: '/assets/:assetId' });
    await waitFor(() => screen.getByText('AST-0001 · C02XK1ABJGH'));

    fireEvent.click(screen.getByRole('button', { name: /^Maintenance & Tickets/ }));

    await waitFor(() => {
      expect(screen.getByText('REQ-2026-0042')).toBeInTheDocument();
    });
    // REQ-2026-0042: createdAt '2026-08-15 09:30 AM', actualCost 120 (preferred once known, over
    // the earlier itAssignment.estimatedCost of 350).
    expect(screen.getByText('2026-08-15 09:30 AM · Cost: $120')).toBeInTheDocument();
  });
});
