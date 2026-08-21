import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { AIDecisionCenterPage } from './index';

describe('AIDecisionCenterPage', () => {
  it('renders the Repair vs. Replace Analyzer with live Asset data merged into the AI profile', async () => {
    renderWithProviders(<AIDecisionCenterPage />, { route: '/ai', path: '/ai' });

    await waitFor(() => {
      expect(screen.getByText('Repair vs. Replace Analyzer')).toBeInTheDocument();
    });
    // First profile in the fixture is a5 (Dell PowerEdge R750) — its real Asset purchase cost
    // ($8,500) should render, not the legacy decisionData fixture's own drifted copy ($12,500).
    await waitFor(() => {
      expect(screen.getByText('$8,500')).toBeInTheDocument();
    });
  });

  it('switches to the Portfolio Risk Matrix tab and shows the full asset register', async () => {
    renderWithProviders(<AIDecisionCenterPage />, { route: '/ai', path: '/ai' });

    await waitFor(() => {
      expect(screen.getByText('Repair vs. Replace Analyzer')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Portfolio Risk Matrix/ }));

    await waitFor(() => {
      expect(screen.getByText('Asset Lifecycle Decision & Risk Register')).toBeInTheDocument();
    });
  });

  it('switches to the Executive Intelligence tab and generates a briefing with real numbers', async () => {
    renderWithProviders(<AIDecisionCenterPage />, { route: '/ai', path: '/ai' });

    await waitFor(() => {
      expect(screen.getByText('Repair vs. Replace Analyzer')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Executive Intelligence & Briefing/ }));

    await waitFor(() => {
      expect(screen.getByText(/Executive Briefing for Q1 2026/)).toBeInTheDocument();
    });
    expect(screen.queryByText(/1,248/)).not.toBeInTheDocument();
  });
});
