import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { CategoriesPage } from './index';

describe('CategoriesPage', () => {
  // RAISE-FR-ASSET-002 / AC-ASSET-002-01, formally executed as TC-ASSET-002-01
  // (CHECKPOINT-2026-08-26-003). Originally failed here (F-25, OPEN-FINDINGS.md) -- the screen
  // didn't exist anywhere in routing/navigation, not just its taxonomy content. Locks in the
  // fix: a scoped-down first cut showing each category (parent) and its real assets (children).
  it('TC-ASSET-002-01: renders every known category as an expandable parent node', async () => {
    renderWithProviders(<CategoriesPage />, { route: '/categories', path: '/categories' });

    await waitFor(() => {
      expect(screen.getByText('IT Hardware')).toBeInTheDocument();
    });
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('Office Equipment')).toBeInTheDocument();
    expect(screen.getByText('Infrastructure')).toBeInTheDocument();
    expect(screen.getByText('Media Equipment')).toBeInTheDocument();
  });

  it('expanding a category shows the real assets registered under it, matching TC-ASSET-002-02\'s consistency requirement', async () => {
    renderWithProviders(<CategoriesPage />, { route: '/categories', path: '/categories' });
    await waitFor(() => screen.getByText('IT Hardware'));

    fireEvent.click(screen.getByText('IT Hardware'));

    await waitFor(() => {
      expect(screen.getByText('MacBook Pro 16" M3')).toBeInTheDocument();
    });
    expect(screen.getByText('AST-0001')).toBeInTheDocument();
  });
});
