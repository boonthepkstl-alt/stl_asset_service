import { describe, it, expect } from 'vitest';
import { assetAgeInYears, computeAssetNbv, computePortfolioNbv } from '@/lib/nbv';

// RAISE-FR-EXEC-001 NBV, per PRD §16 Resolved Question 46.
//
// Every case supplies its own useful-life values. That is not a testing convenience — the
// defaults are business data owned by Settings (PRD §16 Resolved Question 54, confirmed
// 2026-09-23), so the module takes the lookup as a parameter and the numbers here are arbitrary
// test inputs chosen to make the arithmetic readable. Nothing in this file should be read as a
// confirmed default for any Asset Type; the confirmed ten live in services/settings-service.ts
// and are asserted there.
//
// The lookup is keyed by the asset's `type`, not its `category` — PRD §16 Resolved Question 52
// (2026-09-08) re-keyed it, and the module followed on 2026-09-23.
//
// `asOf` is always passed explicitly so nothing depends on the clock.

const AS_OF = new Date('2026-09-07T00:00:00Z');

// Dates are built as EXACT multiples of the module's own year length rather than written by
// hand. A calendar year is not 365.25 days, so '2024-09-07' is 1.9986 years before AS_OF, not
// 2 -- hand-picked dates made three assertions fail by cents and tempted a looser tolerance.
// Deriving them keeps the arithmetic exact, so the assertions can stay strict.
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const yearsBefore = (years: number) => new Date(AS_OF.getTime() - years * MS_PER_YEAR).toISOString();

const TWO_YEARS_AGO = yearsBefore(2);
const FIVE_YEARS_AGO = yearsBefore(5);

const asset = (over: Partial<{ purchaseCost: number; purchaseDate: string; type: string }> = {}) => ({
  purchaseCost: 1000,
  purchaseDate: TWO_YEARS_AGO,
  type: 'Laptop',
  ...over,
});

const lifeOf = (years: number) => () => years;

describe('assetAgeInYears', () => {
  it('measures age in fractional years', () => {
    expect(assetAgeInYears(TWO_YEARS_AGO, AS_OF)).toBeCloseTo(2, 6);
    expect(assetAgeInYears(yearsBefore(0.5), AS_OF)).toBeCloseTo(0.5, 6);
  });

  it('never returns a negative age for a future purchase date', () => {
    // A data-entry mistake should not turn into an asset worth MORE than it cost.
    expect(assetAgeInYears('2030-01-01', AS_OF)).toBe(0);
  });

  it('returns 0 rather than NaN for an unparseable date', () => {
    expect(assetAgeInYears('not-a-date', AS_OF)).toBe(0);
  });
});

describe('computeAssetNbv', () => {
  it('depreciates straight-line over the injected useful life', () => {
    // 1000 over 5 years = 200/year; 2 years old => 1000 - 400 = 600.
    const nbv = computeAssetNbv({ asset: asset(), usefulLifeYearsFor: lifeOf(5), asOf: AS_OF });
    expect(nbv).toBeCloseTo(600, 0);
  });

  it('uses the useful life of the asset\'s OWN category, not a single global value', () => {
    // RQ46 is explicit that useful life is per Asset Category, not one constant. Pin that by
    // giving two categories different lives and asserting the same-cost asset differs.
    const byType = (t: string) => (t === 'Smartphone' ? 2 : 10);

    const mobile = computeAssetNbv({ asset: asset({ type: 'Smartphone' }), usefulLifeYearsFor: byType, asOf: AS_OF });
    const infra = computeAssetNbv({ asset: asset({ type: 'Server' }), usefulLifeYearsFor: byType, asOf: AS_OF });

    expect(mobile).toBeCloseTo(0, 0); // 2-year life, 2 years old -> fully depreciated
    expect(infra).toBeCloseTo(800, 0); // 10-year life, 2 years old -> 1000 - 200
    expect(mobile).not.toBeCloseTo(infra, 0);
  });

  it('reaches exactly zero at the end of the useful life', () => {
    const nbv = computeAssetNbv({
      asset: asset({ purchaseDate: FIVE_YEARS_AGO }),
      usefulLifeYearsFor: lifeOf(5),
      asOf: AS_OF,
    });
    expect(nbv).toBeCloseTo(0, 0);
  });

  it('clamps at 0 well past the useful life instead of going negative', () => {
    // RQ46: salvage value is zero and NBV is clamped. Twenty years into a 5-year life must
    // read 0, not -3000.
    const nbv = computeAssetNbv({
      asset: asset({ purchaseDate: yearsBefore(20) }),
      usefulLifeYearsFor: lifeOf(5),
      asOf: AS_OF,
    });
    expect(nbv).toBe(0);
  });

  it('returns the full purchase cost for a brand-new asset', () => {
    const nbv = computeAssetNbv({
      asset: asset({ purchaseDate: yearsBefore(0) }),
      usefulLifeYearsFor: lifeOf(5),
      asOf: AS_OF,
    });
    expect(nbv).toBeCloseTo(1000, 0);
  });

  // The next three pin the RQ51 "unconfigured Asset Type" behaviour. RQ54 supplied values for
  // the ten Asset Types in the data today and explicitly declined to make them a blanket
  // default, and `type` is free text — so a Type with no configured value is a permanent,
  // expected state rather than a transitional one, and these stay load-bearing.
  it('returns purchase cost unchanged when the type has no useful life configured (0)', () => {
    expect(computeAssetNbv({ asset: asset(), usefulLifeYearsFor: lifeOf(0), asOf: AS_OF })).toBe(1000);
  });

  it('returns purchase cost unchanged for a negative useful life', () => {
    expect(computeAssetNbv({ asset: asset(), usefulLifeYearsFor: lifeOf(-5), asOf: AS_OF })).toBe(1000);
  });

  it('returns purchase cost unchanged, never NaN, when the lookup yields NaN', () => {
    // A missing Settings entry read through `?? NaN` or a bad parse must not render "NaN"
    // on a KPI tile.
    const nbv = computeAssetNbv({ asset: asset(), usefulLifeYearsFor: () => Number.NaN, asOf: AS_OF });
    expect(Number.isNaN(nbv)).toBe(false);
    expect(nbv).toBe(1000);
  });

  it('never reads currentValue, even when it contradicts the computed value', () => {
    // Guards the trap RQ46 records: `currentValue` is set to purchaseCost on create and never
    // recomputed, so any implementation that reached for it would look right on seeded data
    // and be wrong forever after. A wildly wrong value here must change nothing.
    const withMisleadingCurrentValue = { ...asset(), currentValue: 999999 } as never;
    const nbv = computeAssetNbv({ asset: withMisleadingCurrentValue, usefulLifeYearsFor: lifeOf(5), asOf: AS_OF });
    expect(nbv).toBeCloseTo(600, 0);
  });
});

describe('computePortfolioNbv', () => {
  it('sums NBV, purchase cost and count across assets of different types', () => {
    const byType = (t: string) => (t === 'Smartphone' ? 2 : 10);
    const result = computePortfolioNbv(
      [
        asset({ type: 'Smartphone', purchaseCost: 1000 }), // 2y life, 2y old -> 0
        asset({ type: 'Server', purchaseCost: 1000 }), // 10y life, 2y old -> 800
      ],
      byType,
      AS_OF,
    );

    expect(result.assetCount).toBe(2);
    expect(result.totalPurchaseCost).toBe(2000);
    expect(result.totalNbv).toBeCloseTo(800, 0);
  });

  it('includes every asset with no status filter', () => {
    // Deliberate: Utilization excludes Retired and In Maintenance per RQ29(b), but RQ46 states
    // no equivalent exclusion for NBV, and a retired asset still has a book value. Inventing
    // one would be inventing a business rule — this asserts none was invented.
    const assets = [
      { ...asset(), status: 'Retired' },
      { ...asset(), status: 'In Maintenance' },
      { ...asset(), status: 'Assigned' },
    ] as never[];

    expect(computePortfolioNbv(assets, lifeOf(5), AS_OF).assetCount).toBe(3);
  });

  it('returns zeroes for an empty register rather than NaN', () => {
    const result = computePortfolioNbv([], lifeOf(5), AS_OF);
    expect(result).toEqual({ totalNbv: 0, totalPurchaseCost: 0, assetCount: 0 });
  });

  it('still counts an asset whose type has no configured useful life, at full purchase cost', () => {
    // RQ51 spelled out at the portfolio level, which is where it is visible to a reader of the
    // tile: an unconfigured type must not be dropped from the count, and must not read as 0.
    // Both would be defensible-looking bugs — one under-reports the fleet, the other writes off
    // an asset the business never said was worthless.
    const configured = (t: string) => (t === 'Laptop' ? 10 : Number.NaN);
    const result = computePortfolioNbv(
      [
        asset({ type: 'Laptop', purchaseCost: 1000 }), // 10y life, 2y old -> 800
        asset({ type: 'Drone', purchaseCost: 500 }), // no row -> 500, unchanged
      ],
      configured,
      AS_OF,
    );

    expect(result.assetCount).toBe(2);
    expect(result.totalPurchaseCost).toBe(1500);
    expect(result.totalNbv).toBeCloseTo(1300, 0);
  });
});
