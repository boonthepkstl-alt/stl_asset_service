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
    renderWithProviders(<AssetDetailPage />, { route: '/assets/a1', path: '/assets/:assetId' });
    await waitFor(() => screen.getByText('AST-0001 · C02XK1ABJGH'));

    // a1 starts Assigned to Sarah Chen per seed fixture data (no audit entry backs that --
    // same documented limitation the Audit tab already has for pre-existing seeded assets).
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
});
