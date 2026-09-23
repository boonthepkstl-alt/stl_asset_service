// Platform Settings domain types (Phase 7). Unlike every domain migrated so far, the legacy
// page (src/pages/Settings.tsx) has no backing fixture at all — every field is local component
// state seeded with a hardcoded defaultValue, and "Save Changes" only shows a toast, never
// persisting anything. This is a single settings record (no list, no id), not a collection —
// modeled here as one object so `settingsService.updateSettings` can actually persist changes
// in the mock (an improvement over legacy's toast-only Save, not a redesign of the UI itself).

export type ThemePreference = 'light' | 'dark' | 'system';
export type PasswordPolicy = 'basic' | 'standard' | 'strict';
export type TwoFactorPolicy = 'off' | 'optional' | 'required';
export type SmtpEncryption = 'tls' | 'ssl' | 'none';

export interface NotificationPreferences {
  assignment: boolean;
  maintenance: boolean;
  license: boolean;
  approval: boolean;
  system: boolean;
}

export interface SecuritySettings {
  sessionTimeoutMinutes: number;
  passwordPolicy: PasswordPolicy;
  twoFactor: TwoFactorPolicy;
  maxLoginAttempts: number;
  ipWhitelist: string;
}

export interface AppearanceSettings {
  theme: ThemePreference;
  primaryColor: string;
}

export interface EmailSettings {
  smtpServer: string;
  smtpPort: number;
  smtpUsername: string;
  encryption: SmtpEncryption;
  fromEmail: string;
}

export interface DataSettings {
  autoBackupEnabled: boolean;
  dataRetentionDays: number;
  exportScheduleEnabled: boolean;
}

// AC-WARRANTY-001-03 (resolved 2026-09-01, per confirmed business decision): the "Expiring"
// threshold is configurable per Asset Category, not a single fixed number -- PRD Section 6.7's
// "90 days" was an illustrative business example, not a confirmed generalizable rule, and
// different equipment types carry different real-world warranty terms. Keyed by the Asset
// `category` field (data/fixtures/mockData.ts's `categories` list); defaults to 90 for every
// category, adjustable by an admin via Settings.
export interface WarrantySettings {
  expiringThresholdDaysByCategory: Record<string, number>;
}

// AC-WARRANTY-001-07 / AC-DASH-03b / AC-EXEC-001-03b. Useful life in years per Asset Type, the
// only input RQ46's straight-line NBV formula needs beyond `purchaseCost` and `purchaseDate`.
//
// Keyed by the Asset `type` field, NOT `category` (PRD Section 16 Resolved Question 52,
// 2026-09-08): IT Hardware has no single lifespan -- "it depends on the equipment purchased" --
// while a per-Type table is a superset of a per-Category one, since a category with one fixed
// value simply repeats it across its types.
//
// The map is deliberately sparse, and a missing key is a real state rather than an error: PRD
// Section 16 Resolved Question 54 supplied values for the ten Asset Types present in the data
// today and explicitly declined to make them a blanket default for future types. `type` is free
// text, so new kinds will appear with no row here, and Resolved Question 51 governs them --
// `lib/nbv.ts` contributes their `purchaseCost` unchanged, still counted in the portfolio total.
export interface NbvSettings {
  usefulLifeYearsByType: Record<string, number>;
}

export interface PlatformSettings {
  organizationName: string;
  supportEmail: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  notifications: NotificationPreferences;
  security: SecuritySettings;
  appearance: AppearanceSettings;
  email: EmailSettings;
  data: DataSettings;
  warranty: WarrantySettings;
  nbv: NbvSettings;
}

export type UpdateSettingsInput = Partial<Omit<PlatformSettings, 'notifications' | 'security' | 'appearance' | 'email' | 'data' | 'warranty' | 'nbv'>> & {
  notifications?: Partial<NotificationPreferences>;
  security?: Partial<SecuritySettings>;
  appearance?: Partial<AppearanceSettings>;
  email?: Partial<EmailSettings>;
  data?: Partial<DataSettings>;
  warranty?: Partial<WarrantySettings>;
  nbv?: Partial<NbvSettings>;
};
