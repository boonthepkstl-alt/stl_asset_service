import { describe, it, expect } from 'vitest';
import { assetAgeInYears, computeAssetNbv, computePortfolioNbv } from '@/lib/nbv';

// RAISE-FR-EXEC-001 NBV, per PRD §16 Resolved Question 46.
//
// Every case supplies its own useful-life values. That is not a testing convenience — the
// per-category defaults are a genuinely open business input (PRD Open Question 3a), so the
// module takes the lookup as a parameter and these tests are the only place numbers appear.
// Nothing here should be read as a confirmed default for any category.
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

const asset = (over: Partial<{ purchaseCost: number; purchaseDate: string; category: string }> = {}) => ({
  purchaseCost: 1000,
  purchaseDate: TWO_YEARS_AGO,
  category: 'IT Hardware',
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
    const byCategory = (c: string) => (c === 'Mobile' ? 2 : 10);

    const mobile = computeAssetNbv({ asset: asset({ category: 'Mobile' }), usefulLifeYearsFor: byCategory, asOf: AS_OF });
    const infra = computeAssetNbv({ asset: asset({ category: 'Infrastructure' }), usefulLifeYearsFor: byCategory, asOf: AS_OF });

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

  // The next three pin the "unconfigured category" behaviour, which is the case that will
  // actually occur first: the tile ships before every category has a useful life set.
  it('returns purchase cost unchanged when the category has no useful life configured (0)', () => {
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
  it('sums NBV, purchase cost and count across assets of different categories', () => {
    const byCategory = (c: string) => (c === 'Mobile' ? 2 : 10);
    const result = computePortfolioNbv(
      [
        asset({ category: 'Mobile', purchaseCost: 1000 }), // 2y life, 2y old -> 0
        asset({ category: 'Infrastructure', purchaseCost: 1000 }), // 10y life, 2y old -> 800
      ],
      byCategory,
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
});
