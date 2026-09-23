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

  // AC-WARRANTY-001-07. These ten numbers are business data, not an implementation detail, and
  // this is the test that pins them: PRD Section 16 Resolved Question 54, confirmed 2026-09-23
  // via Decision Request DR-02, closing Open Question 3a and Open Finding F-03.
  //
  // Written as a whole-object equality rather than ten separate lookups so that an ELEVENTH
  // entry fails too. Adding an Asset Type with an invented useful life is the realistic
  // mistake here -- the business explicitly declined to make 5 a blanket default, so a helpful
  // -looking row for a type they never ruled on is exactly the kind of fabricated business
  // number Open Finding F-54 was raised over.
  it('seeds exactly the ten business-confirmed per-Asset-Type useful lives (RQ54)', async () => {
    const settingsService = await freshSettingsService();
    const { usefulLifeYearsByType } = (await settingsService.getSettings()).nbv;

    expect(usefulLifeYearsByType).toEqual({
      Laptop: 5,
      Monitor: 5,
      Headphones: 5,
      Smartphone: 3,
      Tablet: 5,
      Printer: 5,
      Projector: 5,
      Server: 5,
      Router: 5,
      Camera: 5,
    });
  });

  // The two clarifications the business answered explicitly when asked to disambiguate "5 years
  // for everything except mobile phones, 3 years". Both are asserted separately from the table
  // above, because the table alone would not say WHY those two values are what they are, and
  // both are the readings a future editor is most likely to "correct".
  it('treats Smartphone, not the Mobile category, as the only 3-year Asset Type', async () => {
    const settingsService = await freshSettingsService();
    const { usefulLifeYearsByType } = (await settingsService.getSettings()).nbv;

    // Tablet is the other Asset Type in the Mobile category. Business confirmed it is 5.
    expect(usefulLifeYearsByType['Tablet']).toBe(5);
    expect(usefulLifeYearsByType['Smartphone']).toBe(3);
    expect(Object.values(usefulLifeYearsByType).filter((y) => y === 3)).toHaveLength(1);
  });

  it('has no entry for an Asset Type the business did not rule on, and merges per-Type edits', async () => {
    const settingsService = await freshSettingsService();
    const before = await settingsService.getSettings();

    // RQ54 covers the ten Asset Types in the data today and is explicitly NOT a blanket
    // default. An unlisted type must be absent, so that lib/nbv.ts applies RQ51 to it
    // (purchaseCost unchanged) rather than silently depreciating it over an assumed 5 years.
    expect(before.nbv.usefulLifeYearsByType['Drone']).toBeUndefined();

    const updated = await settingsService.updateSettings({ nbv: { usefulLifeYearsByType: { Laptop: 4 } } });
    expect(updated.nbv.usefulLifeYearsByType['Laptop']).toBe(4);
    expect(updated.nbv.usefulLifeYearsByType['Smartphone']).toBe(3);
    expect(Object.keys(updated.nbv.usefulLifeYearsByType)).toHaveLength(10);
  });
});
