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
});
