import { beforeEach, describe, expect, it, vi } from 'vitest';

async function freshSettingsService() {
  vi.resetModules();
  const mod = await import('@/services/settings-service');
  return mod.settingsService;
}

describe('settingsService', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('getSettings returns the seeded platform defaults', async () => {
    const settingsService = await freshSettingsService();
    const settings = await settingsService.getSettings();
    expect(settings.organizationName).toBe('RAISE Corporation');
    expect(settings.notifications.system).toBe(false);
    expect(settings.security.passwordPolicy).toBe('basic');
  });

  it('updateSettings persists a top-level field change', async () => {
    const settingsService = await freshSettingsService();
    const updated = await settingsService.updateSettings({ organizationName: 'Acme Corp' });
    expect(updated.organizationName).toBe('Acme Corp');
    const reread = await settingsService.getSettings();
    expect(reread.organizationName).toBe('Acme Corp');
  });

  it('updateSettings merges nested notification preferences without clobbering the rest', async () => {
    const settingsService = await freshSettingsService();
    const before = await settingsService.getSettings();
    const updated = await settingsService.updateSettings({ notifications: { system: true } });
    expect(updated.notifications.system).toBe(true);
    expect(updated.notifications.assignment).toBe(before.notifications.assignment);
  });

  it('updateSettings merges nested security settings', async () => {
    const settingsService = await freshSettingsService();
    const updated = await settingsService.updateSettings({ security: { twoFactor: 'required' } });
    expect(updated.security.twoFactor).toBe('required');
    expect(updated.security.sessionTimeoutMinutes).toBe(30);
  });

  // AC-WARRANTY-001-03 (resolved 2026-09-01): the Expiring threshold defaults to 90 for every
  // Asset Category, and updating one category's threshold must not clobber the others.
  it('seeds a 90-day warranty Expiring threshold for every category, and updateSettings merges per-category changes', async () => {
    const settingsService = await freshSettingsService();
    const before = await settingsService.getSettings();
    expect(before.warranty.expiringThresholdDaysByCategory['IT Hardware']).toBe(90);
    expect(before.warranty.expiringThresholdDaysByCategory['Mobile']).toBe(90);

    const updated = await settingsService.updateSettings({ warranty: { expiringThresholdDaysByCategory: { 'IT Hardware': 60 } } });
    expect(updated.warranty.expiringThresholdDaysByCategory['IT Hardware']).toBe(60);
    expect(updated.warranty.expiringThresholdDaysByCategory['Mobile']).toBe(90);
  });
});
