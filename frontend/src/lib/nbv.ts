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
// The lookup is keyed by the asset's **`type`**, not its `category` — PRD §16 Resolved Question
// 52 (2026-09-08) re-keyed the configuration, because IT Hardware has no single lifespan ("it
// depends on the equipment purchased") while a per-Type table is a superset of a per-Category
// one. This module was written before that decision and keyed by `category` until 2026-09-23.
//
// The default values themselves are NOT here. They are business data, they live in Settings
// (`services/settings-service.ts`, PRD §16 Resolved Question 54), and this module takes
// `usefulLifeYearsFor` as an INJECTED lookup — exactly as `lib/alerts.ts` takes
// `warrantyThresholdFor` rather than hardcoding RQ41's 90 days. Every test below passes its own
// values in. Nothing here invents a number, and a type absent from the injected table is handled
// by the RQ51 rule below rather than by a fallback constant.
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
  asset: Pick<Asset, 'purchaseCost' | 'purchaseDate' | 'type'>;
  /**
   * Useful life for this asset's **type**, in years (PRD §16 Resolved Question 52). Injected
   * rather than looked up here: the defaults are business data owned by Settings
   * (`nbv.usefulLifeYearsByType`), following RQ41's `expiringThresholdDaysByCategory` shape.
   */
  usefulLifeYearsFor: (type: string) => number;
  asOf?: Date;
}

/**
 * Straight-line NBV for one asset, clamped at 0.
 *
 * Returns `purchaseCost` unchanged when the useful life is not a usable positive number. This is
 * PRD §16 Resolved Question 51, not a defensive fallback: an Asset Type with no configured
 * lifespan contributes its `purchaseCost` unchanged and stays counted in the portfolio total,
 * treated as not yet depreciated. RQ54 supplied values for the ten Asset Types present in the
 * data today and explicitly did NOT make them a blanket default, so a new Type appearing in the
 * data lands here by design — reporting "not yet depreciated" is honest, whereas 0 would claim
 * the asset is worthless and NaN would render as "NaN" on a KPI tile.
 */
export function computeAssetNbv({ asset, usefulLifeYearsFor, asOf = new Date() }: NbvInput): number {
  const { purchaseCost } = asset;
  const usefulLifeYears = usefulLifeYearsFor(asset.type);

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
  assets: Pick<Asset, 'purchaseCost' | 'purchaseDate' | 'type'>[],
  usefulLifeYearsFor: (type: string) => number,
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
