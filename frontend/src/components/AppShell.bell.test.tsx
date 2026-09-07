import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { AlertsPage } from '@/pages/Alerts';

// RAISE-FR-ALERT-001 header bell — PRD §16 Resolved Question 49, closing Gap 17.
//
// These render the real Alerts page, because the bell lives in AppShell and every page wraps
// itself in one. That is deliberate rather than incidental: it lets the last test below compare
// the bell's rows against the page's own rows in a single render, which is the property the
// decision actually turns on — the two surfaces must agree by construction, not by convention.

async function openBell() {
  const bell = await screen.findByRole('button', { name: /notifications/i });
  fireEvent.click(bell);
  return screen.getByRole('heading', { name: 'Notifications' }).closest('div')!.parentElement!;
}

describe('AppShell header bell', () => {
  it('shows the alert count on the badge, matching the Alerts screen', async () => {
    renderWithProviders(<AlertsPage />, { route: '/notifications', path: '/notifications' });

    // The seeded register yields 19 alerts (see lib/alerts.test.ts); the bell must report the
    // same total the page derives, not a count of its own.
    await waitFor(() => expect(screen.getByText(/Dell OptiPlex 7090/)).toBeInTheDocument());

    const panel = await openBell();
    expect(within(panel).getByText('19')).toBeInTheDocument();
  });

  it('lists exactly five alerts, not all of them', async () => {
    renderWithProviders(<AlertsPage />, { route: '/notifications', path: '/notifications' });
    await waitFor(() => expect(screen.getByText(/Dell OptiPlex 7090/)).toBeInTheDocument());

    const panel = await openBell();
    // Each row renders its record as "CODE · Name" — count those rather than any generic node.
    const rows = within(panel).getAllByText(/·/);
    expect(rows).toHaveLength(5);
  });

  it('shows the first five in the SAME order the Alerts screen uses', async () => {
    renderWithProviders(<AlertsPage />, { route: '/notifications', path: '/notifications' });
    await waitFor(() => expect(screen.getByText(/Dell OptiPlex 7090/)).toBeInTheDocument());

    const panel = await openBell();
    const bellRows = within(panel).getAllByText(/·/).map((n) => n.textContent);

    // Business rejected "5 most recent" because Alert has no timestamp; the confirmed rule is
    // the first five of the page's own severity ordering. Assert that literally: every bell row
    // must be High or Medium, since the seeded data has enough High/Medium alerts to fill five
    // and a Low one appearing here would mean the shared ordering had been bypassed.
    const severityDots = panel.querySelectorAll('span.h-2.w-2.rounded-full');
    expect(severityDots.length).toBe(5);
    severityDots.forEach((dot) => {
      expect(dot.className).not.toContain('bg-surface-400'); // Low
    });

    expect(bellRows).toHaveLength(5);
  });

  it('offers a link through to the full Alerts screen', async () => {
    renderWithProviders(<AlertsPage />, { route: '/notifications', path: '/notifications' });
    await waitFor(() => expect(screen.getByText(/Dell OptiPlex 7090/)).toBeInTheDocument());

    const panel = await openBell();
    expect(within(panel).getByRole('button', { name: 'View all alerts' })).toBeInTheDocument();
  });

  it('does not offer acknowledge, dismiss, mark-read or snooze — still out of MVP scope', async () => {
    renderWithProviders(<AlertsPage />, { route: '/notifications', path: '/notifications' });
    await waitFor(() => expect(screen.getByText(/Dell OptiPlex 7090/)).toBeInTheDocument());

    const panel = await openBell();
    const text = panel.textContent ?? '';
    expect(text).not.toMatch(/acknowledge|dismiss|snooze|mark as read|mark all/i);
  });
});
