import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { AssetsPage } from './index';

describe('AssetsPage', () => {
  it('renders the seeded assets, e.g. the first fixture asset by name', async () => {
    renderWithProviders(<AssetsPage />, { route: '/assets', path: '/assets' });

    await waitFor(() => {
      expect(screen.getByText('MacBook Pro 16" M3')).toBeInTheDocument();
    });
  });

  it('renders the asset count badge', async () => {
    renderWithProviders(<AssetsPage />, { route: '/assets', path: '/assets' });
    await waitFor(() => {
      expect(screen.getByText(/^\d+ assets$/)).toBeInTheDocument();
    });
  });

  // RAISE-FR-WARRANTY-001 / AC-WARRANTY-001-01/-02 (field list resolved 2026-08-29: F-01,
  // OPEN-FINDINGS.md). Per explicit user direction, warranty status is added to the Asset
  // Registry list rather than a standalone Warranty screen (P-010).
  it('TC-WARRANTY-001-01/-02: the Warranty column shows the expiry date and Active/Expired state', async () => {
    renderWithProviders(<AssetsPage />, { route: '/assets', path: '/assets' });
    await waitFor(() => screen.getByText('MacBook Pro 16" M3'));

    // a1 (and a2, same warranty batch): warrantyExpiry 2027-01-15 (Active).
    expect(screen.getAllByText('2027-01-15').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0);

    // a13 (Dell OptiPlex 7090): warrantyExpiry 2024-03-15 (Expired) — search to bring it into view.
    fireEvent.change(screen.getByPlaceholderText('Search by name or code...'), { target: { value: 'AST-0013' } });
    await waitFor(() => {
      expect(screen.getByText('2024-03-15')).toBeInTheDocument();
    });
    expect(screen.getByText('Expired')).toBeInTheDocument();
  });

  // RAISE-FR-OPS-001 / AC-OPS-001-01..03, formally executed as TC-OPS-001-01..03
  // (CHECKPOINT-2026-08-26-001). TC-OPS-001-03 originally failed here (F-21,
  // OPEN-FINDINGS.md) -- these three lock in the fix.
  describe('Scan QR', () => {
    it('TC-OPS-001-02: a well-formed but unmapped code shows a distinct "not found" message', async () => {
      renderWithProviders(<AssetsPage />, { route: '/assets', path: '/assets' });
      await waitFor(() => screen.getByText('MacBook Pro 16" M3'));

      fireEvent.click(screen.getByRole('button', { name: 'Scan QR' }));
      fireEvent.change(screen.getByPlaceholderText('Scan or type asset code...'), { target: { value: 'AST-9999' } });
      fireEvent.click(screen.getByRole('button', { name: 'Go to asset' }));

      await waitFor(() => {
        expect(screen.getByText('No asset found for "AST-9999".')).toBeInTheDocument();
      });
    });

    it('TC-OPS-001-03: a malformed code shows a distinct "invalid code" message, not "not found"', async () => {
      renderWithProviders(<AssetsPage />, { route: '/assets', path: '/assets' });
      await waitFor(() => screen.getByText('MacBook Pro 16" M3'));

      fireEvent.click(screen.getByRole('button', { name: 'Scan QR' }));
      fireEvent.change(screen.getByPlaceholderText('Scan or type asset code...'), { target: { value: '%%$#!!garbage///' } });
      fireEvent.click(screen.getByRole('button', { name: 'Go to asset' }));

      await waitFor(() => {
        expect(screen.getByText('Invalid code — "%%$#!!garbage///" doesn\'t look like a scannable asset code.')).toBeInTheDocument();
      });
      expect(screen.queryByText(/No asset found/)).not.toBeInTheDocument();
    });
  });

  // RAISE-FR-ASSET-001 / AC-ASSET-001, formally executed as TC-ASSET-001-03
  // (CHECKPOINT-2026-08-26-003). Originally failed here (F-23, OPEN-FINDINGS.md) -- the
  // Filters panel had no Category select at all. Locks in the fix.
  it('TC-ASSET-001-03: filtering by Category narrows the asset list', async () => {
    renderWithProviders(<AssetsPage />, { route: '/assets', path: '/assets' });
    await waitFor(() => screen.getByText('MacBook Pro 16" M3'));

    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    // Select's label isn't programmatically associated with its <select> (no id/name passed),
    // so query the Filters panel's selects positionally: Status, Category, Department, Location.
    const categorySelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(categorySelect, { target: { value: 'Infrastructure' } });

    await waitFor(() => {
      expect(screen.getByText('2 assets')).toBeInTheDocument();
    });
    expect(screen.getByText('Dell PowerEdge R750')).toBeInTheDocument();
    expect(screen.queryByText('MacBook Pro 16" M3')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    await waitFor(() => {
      expect(screen.getByText('MacBook Pro 16" M3')).toBeInTheDocument();
    });
  });

  // RAISE-FR-ASSET-002 / AC-ASSET-002-01, formally executed as TC-ASSET-002-01
  // (CHECKPOINT-2026-08-26-003). Originally failed here (F-25, OPEN-FINDINGS.md) -- no
  // Category & Hierarchy screen existed anywhere. First shipped as a standalone /categories
  // page, then folded into Asset Management as a "By Category" view (per user request) since
  // it's just another lens on the same Asset Registry data. Extended to a 2-level Category ->
  // Type -> assets hierarchy (F-27, resolved 2026-09-01) -- sub-category is the asset's
  // existing `type` field.
  describe('By Category view', () => {
    it('TC-ASSET-002-01: switching to "By Category" shows every known category as an expandable parent node', async () => {
      renderWithProviders(<AssetsPage />, { route: '/assets', path: '/assets' });
      await waitFor(() => screen.getByText('MacBook Pro 16" M3'));

      fireEvent.click(screen.getByRole('button', { name: 'By Category' }));

      await waitFor(() => {
        expect(screen.getByText('IT Hardware')).toBeInTheDocument();
      });
      expect(screen.getByText('Mobile')).toBeInTheDocument();
      expect(screen.getByText('Office Equipment')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('Media Equipment')).toBeInTheDocument();
    });

    it('expanding a category shows its Type sub-groups, matching TC-ASSET-002-02\'s consistency requirement', async () => {
      renderWithProviders(<AssetsPage />, { route: '/assets', path: '/assets' });
      await waitFor(() => screen.getByText('MacBook Pro 16" M3'));

      fireEvent.click(screen.getByRole('button', { name: 'By Category' }));
      await waitFor(() => screen.getByText('IT Hardware'));
      fireEvent.click(screen.getByText('IT Hardware'));

      await waitFor(() => {
        expect(screen.getByText('Laptop')).toBeInTheDocument();
      });
      expect(screen.getByText('Monitor')).toBeInTheDocument();
      expect(screen.getByText('Headphones')).toBeInTheDocument();
    });

    // AC-ASSET-002-03 / TC-ASSET-002-03 (F-27, OPEN-FINDINGS.md, resolved 2026-09-01):
    // sub-category is the asset's existing `type` field -- a 2-level Category -> Type ->
    // assets hierarchy. Expanding a Type sub-group reveals the individual assets under it.
    it('TC-ASSET-002-03: expanding a Type sub-group reveals the individual assets under it', async () => {
      renderWithProviders(<AssetsPage />, { route: '/assets', path: '/assets' });
      await waitFor(() => screen.getByText('MacBook Pro 16" M3'));

      fireEvent.click(screen.getByRole('button', { name: 'By Category' }));
      await waitFor(() => screen.getByText('IT Hardware'));
      fireEvent.click(screen.getByText('IT Hardware'));
      await waitFor(() => screen.getByText('Laptop'));
      fireEvent.click(screen.getByText('Laptop'));

      await waitFor(() => {
        expect(screen.getAllByText('MacBook Pro 16" M3').length).toBeGreaterThan(0);
      });
      expect(screen.getByText('AST-0001')).toBeInTheDocument();
      // Monitor's assets aren't shown -- only the expanded "Laptop" sub-group's assets are.
      expect(screen.queryByText('AST-0002')).not.toBeInTheDocument();
    });
  });
});
