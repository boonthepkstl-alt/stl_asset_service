import { screen, waitFor } from '@testing-library/react';
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
});
