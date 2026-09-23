import { MockSettingsRepository, type SettingsRepository } from '@/services/settings-repository';
import { categories } from '@/data/fixtures/mockData';
import type { PlatformSettings, UpdateSettingsInput } from '@/types/settings';

// Seed values match the legacy defaultValue literals in src/pages/Settings.tsx exactly — see
// SYSTEM-SETTINGS-MIGRATION.md for the field-by-field trace back to the original page. The
// `warranty` section is new (AC-WARRANTY-001-03, resolved 2026-09-01) -- not part of the legacy
// page, since the Expiring-threshold concept didn't exist until this business decision.
// PRD Section 16 Resolved Question 54 (business-confirmed 2026-09-23 via Decision Request DR-02,
// closing Open Question 3a and Open Finding F-03, which had been held open across four requests).
// Business stated it as "5 years for everything except mobile phones, 3 years"; two ambiguities in
// that phrasing were put back and answered explicitly rather than inferred:
//
//   1. Tablet is 5, not 3. "Mobile phone" meant the Smartphone handset, not the whole Mobile
//      category -- which also contains Tablet. Smartphone is the ONLY Asset Type at 3 years.
//   2. These ten are the Asset Types present in the data today. They are NOT a blanket default:
//      a Type absent from this map is governed by Resolved Question 51, not by a fallback of 5.
//
// This is business data, transcribed. Do not add, remove, or adjust an entry without a recorded
// business decision -- Open Finding F-54 exists because four SLA values once shipped without one.
const NBV_USEFUL_LIFE_YEARS_BY_TYPE: Record<string, number> = {
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
};

const SEED: PlatformSettings = {
  organizationName: 'RAISE Corporation',
  supportEmail: 'support@raise.co',
  timezone: 'utc',
  dateFormat: 'iso',
  currency: 'usd',
  language: 'en',
  notifications: { assignment: true, maintenance: true, license: true, approval: true, system: false },
  security: { sessionTimeoutMinutes: 30, passwordPolicy: 'basic', twoFactor: 'off', maxLoginAttempts: 5, ipWhitelist: '' },
  appearance: { theme: 'light', primaryColor: 'bg-brand-600' },
  email: { smtpServer: 'smtp.raise.co', smtpPort: 587, smtpUsername: 'noreply@raise.co', encryption: 'tls', fromEmail: 'noreply@raise.co' },
  data: { autoBackupEnabled: true, dataRetentionDays: 365, exportScheduleEnabled: false },
  warranty: { expiringThresholdDaysByCategory: Object.fromEntries(categories.map((c) => [c, 90])) },
  nbv: { usefulLifeYearsByType: { ...NBV_USEFUL_LIFE_YEARS_BY_TYPE } },
};

const repository: SettingsRepository = new MockSettingsRepository(SEED);

/**
 * The stable frontend contract for the System Settings page (pages/Settings). Settings is its
 * own domain — a single platform-wide record, not a collection — with no dependency on any
 * other service and nothing else importing from it.
 */
export const settingsService = {
  getSettings: (): Promise<PlatformSettings> => repository.get(),
  updateSettings: (patch: UpdateSettingsInput): Promise<PlatformSettings> => repository.update(patch),
};
