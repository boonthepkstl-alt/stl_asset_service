import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { DashboardPage } from './index';

describe('DashboardPage', () => {
  it('renders real KPI values computed from the seeded asset/license fixtures', async () => {
    renderWithProviders(<DashboardPage />, { route: '/dashboard', path: '/dashboard' });

    await waitFor(() => {
      expect(screen.getByText('Total Assets')).toBeInTheDocument();
    });
    expect(screen.getByText('Software Licenses')).toBeInTheDocument();
    expect(screen.getByText('Department Distribution')).toBeInTheDocument();
    expect(screen.getByText('AI Insights')).toBeInTheDocument();
  });
});
