import type { Asset } from '@/types/asset';

// RAISE-FR-EXEC-001's NBV (Net Book Value) KPI.
//
// The formula is confirmed: PRD §16 Resolved Question 46 (business-confirmed 2026-09-05,
// narrowing Open Finding F-03 to R-28). Straight-line, from the `purchaseDate` and
// `purchaseCost` fields that already exist end-to-end on every Asset — no new field, no data
// model change:
//
//     NBV = purchaseCost − (purchaseCost ÷ usefulLifeYears × assetAgeInYears)
//
// with salvage value **zero** and the result **clamped at 0**, so a fully depreciated asset
// reads 0 rather than going negative.
//
// WHAT IS DELIBERATELY NOT HERE, and why this file can exist before it: the **default**
// useful-life years per Asset Category are still unsupplied (PRD §16 Open Question 3a —
// business was asked directly and said they would specify them). So this module takes
// `usefulLifeYearsFor` as an INJECTED lookup and defines no defaults of its own, exactly as
// `lib/alerts.ts` takes `warrantyThresholdFor` rather than hardcoding RQ41's 90 days. Every
// test below passes its own values in. Nothing here invents a number, and nothing here can
// render on the dashboard until Settings has real defaults to feed it.
//
// A trap worth naming, since the Asset record makes it inviting: `Asset.currentValue` looks
// like a ready-made NBV and is not one. `go-template-main/service/assetService.go:101` sets it
// equal to `purchaseCost` on create and never recomputes it, and the seed fixtures hold
// hand-written values at inconsistent rates (a1 is 85% of cost after 1.6 years; a5 is 60% after
// 3.8). Using it would put a number on an executive dashboard that never moves. This module
// never reads it.

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/** Age in fractional years. 365.25 accounts for leap years without a calendar library. */
export function assetAgeInYears(purchaseDate: string, asOf: Date = new Date()): number {
  const purchased = new Date(purchaseDate).getTime();
  if (Number.isNaN(purchased)) return 0;
  return Math.max(0, (asOf.getTime() - purchased) / MS_PER_YEAR);
}

export interface NbvInput {
  /** Reads `purchaseCost` and `purchaseDate` only — never `currentValue` (see note above). */
  asset: Pick<Asset, 'purchaseCost' | 'purchaseDate' | 'category'>;
  /**
   * Useful life for this asset's category, in years. Injected rather than looked up here:
   * the per-category defaults are an open business input (PRD Open Question 3a), and the
   * eventual source is Settings, following RQ41's `expiringThresholdDaysByCategory` shape.
   */
  usefulLifeYearsFor: (category: string) => number;
  asOf?: Date;
}

/**
 * Straight-line NBV for one asset, clamped at 0.
 *
 * Returns `purchaseCost` unchanged when the useful life is not a usable positive number. That
 * is deliberate rather than a silent 0 or a NaN: a missing or zero useful life means the
 * category has no configured lifespan yet, and reporting "not yet depreciated" is honest,
 * whereas 0 would claim the asset is worthless and NaN would render as "NaN" on a KPI tile.
 */
export function computeAssetNbv({ asset, usefulLifeYearsFor, asOf = new Date() }: NbvInput): number {
  const { purchaseCost } = asset;
  const usefulLifeYears = usefulLifeYearsFor(asset.category);

  if (!Number.isFinite(usefulLifeYears) || usefulLifeYears <= 0) return purchaseCost;

  const annualDepreciation = purchaseCost / usefulLifeYears;
  const depreciated = annualDepreciation * assetAgeInYears(asset.purchaseDate, asOf);

  return Math.max(0, purchaseCost - depreciated);
}

export interface PortfolioNbv {
  /** Sum of every asset's clamped NBV. */
  totalNbv: number;
  /** Sum of every asset's `purchaseCost`, for context beside the NBV figure. */
  totalPurchaseCost: number;
  /** How many assets were included. */
  assetCount: number;
}

/**
 * Portfolio total, for the dashboard tile.
 *
 * Every asset is included, with no status filter. That is a deliberate difference from the
 * Utilization KPI, whose denominator excludes Retired and In Maintenance per PRD §16 Resolved
 * Question 29(b) — that exclusion is Utilization's own confirmed rule and RQ46 states no
 * equivalent for NBV. A retired asset still has a book value, so inventing an exclusion here
 * would be inventing a business rule.
 */
export function computePortfolioNbv(
  assets: Pick<Asset, 'purchaseCost' | 'purchaseDate' | 'category'>[],
  usefulLifeYearsFor: (category: string) => number,
  asOf: Date = new Date(),
): PortfolioNbv {
  return assets.reduce<PortfolioNbv>(
    (acc, asset) => ({
      totalNbv: acc.totalNbv + computeAssetNbv({ asset, usefulLifeYearsFor, asOf }),
      totalPurchaseCost: acc.totalPurchaseCost + asset.purchaseCost,
      assetCount: acc.assetCount + 1,
    }),
    { totalNbv: 0, totalPurchaseCost: 0, assetCount: 0 },
  );
}
