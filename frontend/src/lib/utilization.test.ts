import { describe, it, expect } from 'vitest';
import { computeUtilization } from '@/lib/utilization';

// RAISE-FR-EXEC-001 Utilization KPI (PRD §16 Resolved Question 27 + Resolved Question 29).
// Each case pins one clause of those two resolutions, so a later edit that quietly changes the
// denominator or the rounding fails here rather than on the dashboard.

describe('computeUtilization', () => {
  it('computes assigned over (available + assigned)', () => {
    expect(computeUtilization({ available: 6, assigned: 9 })).toEqual({
      assigned: 9,
      eligible: 15,
      percent: 60,
    });
  });

  // RQ29(b): In Maintenance and Retired assets are excluded from the denominator -- they are
  // NOT counted as idle capacity. The function takes only the two fields it may use, so this
  // asserts the contract at the call site: passing a stats object with maintenance/retired
  // counts must not change the result.
  it('ignores In Maintenance and Retired counts entirely', () => {
    const withoutExcluded = computeUtilization({ available: 4, assigned: 4 });
    const withExcluded = computeUtilization({
      available: 4,
      assigned: 4,
      // @ts-expect-error -- deliberately passing excess fields to prove they are unread
      inMaintenance: 50,
      retired: 50,
    });

    expect(withExcluded).toEqual(withoutExcluded);
    expect(withExcluded.eligible).toBe(8);
    expect(withExcluded.percent).toBe(50);
  });

  it('returns 0% rather than NaN when no asset is in an assignable state', () => {
    const result = computeUtilization({ available: 0, assigned: 0 });

    expect(result.percent).toBe(0);
    expect(Number.isNaN(result.percent)).toBe(false);
  });

  it('reports 100% when every eligible asset is assigned', () => {
    expect(computeUtilization({ available: 0, assigned: 7 }).percent).toBe(100);
  });

  it('reports 0% when no eligible asset is assigned', () => {
    expect(computeUtilization({ available: 7, assigned: 0 }).percent).toBe(0);
  });

  it('rounds to one decimal place', () => {
    // 1/3 -> 33.333...% must render as 33.3, not 33 and not 33.33333333333333.
    expect(computeUtilization({ available: 2, assigned: 1 }).percent).toBe(33.3);
    // 2/3 -> 66.666...% rounds up at the same precision.
    expect(computeUtilization({ available: 1, assigned: 2 }).percent).toBe(66.7);
  });
});
