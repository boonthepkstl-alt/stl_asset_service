export function isWarrantyExpired(warrantyExpiry: string, asOf: Date = new Date()): boolean {
  return new Date(warrantyExpiry) < asOf;
}

export type WarrantyStatus = 'Active' | 'Expiring' | 'Expired';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// AC-WARRANTY-001-03 (resolved 2026-09-01, per confirmed business decision): the "Expiring"
// threshold is not a single fixed number (PRD Section 6.7's "90 days" was illustrative only) --
// it is configurable per Asset Category (PlatformSettings.warranty.expiringThresholdDaysByCategory,
// defaulting to 90 for every category), adjustable by an admin via Settings.
export function getWarrantyStatus(warrantyExpiry: string, thresholdDays: number, asOf: Date = new Date()): WarrantyStatus {
  const expiry = new Date(warrantyExpiry);
  if (expiry < asOf) return 'Expired';
  const daysUntilExpiry = (expiry.getTime() - asOf.getTime()) / MS_PER_DAY;
  return daysUntilExpiry <= thresholdDays ? 'Expiring' : 'Active';
}
