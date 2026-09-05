import type { DashboardStats } from '@/types/dashboard';

// RAISE-FR-EXEC-001's Utilization KPI.
//
// Unlike NBV and Risk (the other two proposal-defined KPIs, still open as PRD §16 Q3/Q4 and
// Open Finding F-03), Utilization's definition and calculation mechanics were BOTH confirmed
// by business well before this was built -- PRD §16 Resolved Question 27 (2026-08-21) and
// Resolved Question 29 (2026-08-21). Nothing here is a new decision; it implements those two.
//
// RQ27 -- definition: assignment-time-based. Utilization is the share of an asset's available
// time during which it is assigned to a user/department.
//
// RQ29 -- mechanics, and this is the part that makes the above computable today:
//   (a) Aggregation window = REAL-TIME SNAPSHOT. This is explicitly NOT a time-series average
//       over a trailing window ("average utilization over the last 30/90 days"). At a single
//       instant, "share of available time spent assigned" collapses to "share of eligible
//       assets currently assigned" -- which is why no assignment-history table is needed and
//       why this is a pure function over the stats the dashboard already fetches.
//   (b) Denominator exclusions: assets that are not in an active/available-for-assignment
//       state are excluded from the denominator entirely -- they are not counted as idle.
//
// RQ29 names Disposed, Retired and Under Maintenance as the excluded states. `AssetStatus`
// (types/asset.ts) has only four values -- 'Available' | 'Assigned' | 'In Maintenance' |
// 'Retired' -- so 'In Maintenance' and 'Retired' are excluded here and there is no Disposed
// status to exclude: Disposal is confirmed Enterprise Roadmap, not MVP (PRD §16 Resolved
// Question 26). That absence is recorded rather than papered over; if a Disposed status is
// ever added it must be excluded here too.
//
// The remaining denominator is therefore Available + Assigned, and the numerator is Assigned.

export interface UtilizationResult {
  /** Assets currently assigned -- the numerator. */
  assigned: number;
  /** Assets in an assignable state (Available + Assigned) -- the denominator per RQ29(b). */
  eligible: number;
  /** Assigned / eligible as a percentage, rounded to one decimal place. 0 when nothing is eligible. */
  percent: number;
}

/**
 * Computes the Utilization KPI as a real-time snapshot from stats the dashboard already has.
 *
 * Returns 0% rather than NaN when no asset is in an assignable state (every asset retired or
 * in maintenance, or an empty register) -- a divide-by-zero would otherwise render "NaN%".
 */
export function computeUtilization(stats: Pick<DashboardStats, 'available' | 'assigned'>): UtilizationResult {
  const assigned = stats.assigned;
  const eligible = stats.available + stats.assigned;

  return {
    assigned,
    eligible,
    percent: eligible === 0 ? 0 : Math.round((assigned / eligible) * 1000) / 10,
  };
}
