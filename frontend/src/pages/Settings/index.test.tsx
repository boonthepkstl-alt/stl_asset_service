import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { SettingsPage } from './index';

describe('SettingsPage', () => {
  it('renders the General section with the seeded organization name', async () => {
    renderWithProviders(<SettingsPage />, { route: '/settings', path: '/settings' });

    await waitFor(() => {
      expect(screen.getByDisplayValue('RAISE Corporation')).toBeInTheDocument();
    });
  });

  it('switches to the Notifications section and shows the seeded toggle state', async () => {
    renderWithProviders(<SettingsPage />, { route: '/settings', path: '/settings' });

    await waitFor(() => {
      expect(screen.getByDisplayValue('RAISE Corporation')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));

    await waitFor(() => {
      expect(screen.getByText('Assignment updates')).toBeInTheDocument();
    });
  });

  it('saving a change persists it (Save Changes actually mutates, unlike the legacy toast-only button)', async () => {
    renderWithProviders(<SettingsPage />, { route: '/settings', path: '/settings' });

    await waitFor(() => {
      expect(screen.getByDisplayValue('RAISE Corporation')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue('RAISE Corporation'), { target: { value: 'Acme Corp' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(screen.getByText('Settings saved')).toBeInTheDocument();
    });

    const { settingsService } = await import('@/services/settings-service');
    const persisted = await settingsService.getSettings();
    expect(persisted.organizationName).toBe('Acme Corp');
  });

  // AC-WARRANTY-001-07. The P-018 NBV section: one row per configured Asset Type, each
  // pre-populated with its business-confirmed default useful life (PRD Section 16 Resolved
  // Question 54), keyed by Asset Type rather than Category (Resolved Question 52).
  it('renders the NBV section with one pre-populated row per configured Asset Type', async () => {
    renderWithProviders(<SettingsPage />, { route: '/settings', path: '/settings' });

    // Waits on the section nav rather than on the seeded organization name: the persist test
    // above mutates that name in the shared settings repository, so keying off it here would
    // make these two cases depend on execution order.
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'NBV' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'NBV' }));

    await waitFor(() => {
      expect(screen.getByText('NBV Useful Life')).toBeInTheDocument();
    });

    // Queried by the per-row accessible label rather than by display value, so that two types
    // sharing the value 5 stay distinguishable.
    expect(screen.getByLabelText('Useful life in years for Laptop')).toHaveValue(5);
    expect(screen.getByLabelText('Useful life in years for Smartphone')).toHaveValue(3);
    expect(screen.getByLabelText('Useful life in years for Tablet')).toHaveValue(5);
    expect(screen.getAllByText('Useful life in years')).toHaveLength(10);

    // The rows come from the confirmed table, not from the types observed in the register. An
    // unlisted type must not appear with an empty box inviting an admin to invent a number.
    expect(screen.queryByLabelText('Useful life in years for Drone')).not.toBeInTheDocument();
  });

  it('editing one Asset Type useful life saves without clobbering the others', async () => {
    renderWithProviders(<SettingsPage />, { route: '/settings', path: '/settings' });

    // Waits on the section nav rather than on the seeded organization name: the persist test
    // above mutates that name in the shared settings repository, so keying off it here would
    // make these two cases depend on execution order.
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'NBV' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'NBV' }));
    await waitFor(() => {
      expect(screen.getByLabelText('Useful life in years for Laptop')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Useful life in years for Laptop'), { target: { value: '4' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(screen.getByText('Settings saved')).toBeInTheDocument();
    });

    const { settingsService } = await import('@/services/settings-service');
    const persisted = await settingsService.getSettings();
    expect(persisted.nbv.usefulLifeYearsByType['Laptop']).toBe(4);
    expect(persisted.nbv.usefulLifeYearsByType['Smartphone']).toBe(3);
  });
});
