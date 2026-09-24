import { screen, waitFor, within } from '@testing-library/react';
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

  // AC-DASH-01 / AC-EXEC-001-01, re-specified from nine tiles to ten by PRD Section 16 Resolved
  // Question 50. TC-DASH-01's earlier PASS was taken against the nine-tile version and does not
  // carry forward, so the tile list is asserted by name here rather than by count -- a count
  // alone would pass if a tile were renamed or swapped.
  it('renders all ten KPI tiles, including NBV at the tenth position', async () => {
    renderWithProviders(<DashboardPage />, { route: '/dashboard', path: '/dashboard' });

    await waitFor(() => {
      expect(screen.getByText('Total Assets')).toBeInTheDocument();
    });

    // Scoped to the KPI grid: several of these labels also appear in the charts below it
    // ("In Maintenance" and "Assigned" are Asset Status slices), and an unscoped query would
    // either collide or, worse, pass on the chart while the tile was missing.
    const grid = within(screen.getByText('Total Assets').closest('.grid') as HTMLElement);

    for (const label of [
      'Total Assets',
      'Available',
      'Assigned',
      'Utilization',
      'In Maintenance',
      'Expired Warranty',
      'Software Licenses',
      'Monthly Depreciation',
      'Monthly Cost',
      'NBV',
    ]) {
      expect(grid.getByText(label)).toBeInTheDocument();
    }

    // RQ50 kept the illustrative Monthly Depreciation tile unchanged beside the computed NBV
    // one. Asserted because "replace the fake depreciation number with the real one" is the
    // obvious-looking cleanup that the business decision explicitly did not ask for.
    expect(grid.getAllByText('illustrative — no depreciation model yet')).toHaveLength(2);
  });

  // AC-DASH-03b / AC-EXEC-001-03b. The NBV tile is computed, not illustrative, so this asserts
  // the real figure rather than mere presence. Fifteen seeded assets, each depreciated
  // straight-line from its own purchaseDate/purchaseCost over its type's confirmed useful life
  // (RQ54), summed and clamped at 0 per RQ46 -- recomputed here from the same fixtures and
  // settings the page reads, so the assertion tracks the fixtures instead of pinning a literal
  // that would need hand-editing whenever an asset is seeded.
  it('renders the NBV tile from the real register and the confirmed per-Asset-Type useful lives', async () => {
    const { assets } = await import('@/data/fixtures/mockData');
    const { settingsService } = await import('@/services/settings-service');
    const { computePortfolioNbv } = await import('@/lib/nbv');

    const { usefulLifeYearsByType } = (await settingsService.getSettings()).nbv;
    const expected = computePortfolioNbv(assets, (type) => Number(usefulLifeYearsByType[type]));

    renderWithProviders(<DashboardPage />, { route: '/dashboard', path: '/dashboard' });

    await waitFor(() => {
      expect(screen.getByText(`$${(expected.totalNbv / 1000).toFixed(1)}K`)).toBeInTheDocument();
    });
    expect(
      screen.getByText(`of $${(expected.totalPurchaseCost / 1000).toFixed(1)}K purchase cost, 15 assets`),
    ).toBeInTheDocument();

    // A portfolio NBV equal to total purchase cost would mean no asset depreciated at all --
    // the shape a silently-empty settings map produces, which would otherwise look plausible.
    expect(expected.totalNbv).toBeLessThan(expected.totalPurchaseCost);
  });
});
