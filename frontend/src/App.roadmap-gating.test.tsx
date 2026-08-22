import { screen, waitFor, render, cleanup } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { STORAGE_KEYS } from '@/config/constants';
import type { User } from '@/types/auth';

// Regression coverage for the Roadmap-gating fix: RAISE-FR-LICENSE-001 (Software License) and
// RAISE-AI-RECOMMEND-001 (AI Decision Center) are confirmed Roadmap-only in RAISE-PRD.md, not
// MVP, but their pages/routes/nav entries were already built ahead of that confirmation. This
// file verifies the default (flag off) build actually hides both -- from the sidebar and from
// direct navigation -- rather than just trusting the featureFlags.ts constant in isolation.
//
// The rest of the test suite runs with VITE_ENABLE_ROADMAP_FEATURES=true (see vitest.config.ts)
// so those tests can keep asserting the pages are reachable when the flag is on. This file
// stubs the env var to 'false'/unset and resets modules so config/navigation.ts and App.tsx
// re-evaluate the flag fresh, matching what a real default build (no env var set) would do.

function seedAuth() {
  const user: User = { id: 'u1', username: 'test.user', fullName: 'Test User', role: 'EMPLOYEE' };
  localStorage.setItem(STORAGE_KEYS.TOKEN, 'test-token');
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

describe('Roadmap-only features are gated off by default', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
    vi.stubEnv('VITE_ENABLE_ROADMAP_FEATURES', 'false');
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    window.history.pushState({}, '', '/');
  });

  it('excludes Software License and AI Decision Center from the sidebar nav', async () => {
    const { navGroups } = await import('@/config/navigation');
    const allIds = navGroups.flatMap((g) => g.items.map((i) => i.id));

    expect(allIds).not.toContain('licenses');
    expect(allIds).not.toContain('ai');
    // Sanity check the filter didn't over-remove: confirmed-MVP items must still be present.
    expect(allIds).toContain('dashboard');
    expect(allIds).toContain('assets');
    expect(allIds).toContain('maintenance');
  });

  it('drops the Overview group entirely if AI Decision Center was its only remaining item', async () => {
    // Overview currently holds exactly {dashboard, ai}; if ai is filtered and dashboard
    // remains, Overview should still be present with just dashboard -- this only fails if a
    // future edit adds a third Overview item without updating this assumption.
    const { navGroups } = await import('@/config/navigation');
    const overview = navGroups.find((g) => g.label === 'Overview');
    expect(overview?.items.map((i) => i.id)).toEqual(['dashboard']);
  });

  it('renders the 404 page when navigating directly to /licenses', async () => {
    seedAuth();
    window.history.pushState({}, '', '/licenses');
    const { default: App } = await import('@/App');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('404 — Page not found')).toBeInTheDocument();
    });
  });

  it('renders the 404 page when navigating directly to /ai', async () => {
    seedAuth();
    window.history.pushState({}, '', '/ai');
    const { default: App } = await import('@/App');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('404 — Page not found')).toBeInTheDocument();
    });
  });
});
