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

  // RAISE-FR-EXEC-001 Utilization KPI (PRD §16 Resolved Question 27 + 29). The seeded register
  // holds 15 assets -- 8 Assigned, 4 Available, 2 In Maintenance, 1 Retired -- so the tile must
  // read 8/12 = 66.7%, NOT 8/15 = 53.3%. That difference is the whole point of RQ29(b)'s
  // denominator exclusion, so this asserts the excluded three are really excluded on the page.
  it('renders the Utilization KPI over assignable assets only, excluding In Maintenance and Retired', async () => {
    renderWithProviders(<DashboardPage />, { route: '/dashboard', path: '/dashboard' });

    await waitFor(() => {
      expect(screen.getByText('Utilization')).toBeInTheDocument();
    });
    expect(screen.getByText('66.7%')).toBeInTheDocument();
    expect(screen.getByText('8 of 12 assignable assets')).toBeInTheDocument();
  });
});
