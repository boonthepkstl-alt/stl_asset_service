import { useEffect, useState } from 'react';
import { assetService } from '@/services/asset-service';
import { settingsService } from '@/services/settings-service';
import { computePortfolioNbv, type PortfolioNbv } from '@/lib/nbv';

// RAISE-FR-EXEC-001's NBV KPI tile (AC-DASH-03b / AC-EXEC-001-03b), the tenth tile on the
// dashboard's KPI grid per PRD Section 16 Resolved Question 50.
//
// Why this is its own hook rather than a field on useDashboardStats: NBV needs every asset's
// `purchaseCost`, `purchaseDate` and `type`, and dashboardService returns aggregates only -- its
// repository (mock or HTTP) is a counts API. Asking it for NBV would mean either pushing the
// formula behind a backend that has no NBV endpoint, or widening its contract to stream whole
// assets for a single tile. Both are larger changes than the tile warrants.
//
// `listAssets({})` sends no page/limit, and both repositories return the FULL result set in that
// case -- the mock slices nothing, and the Go side resolves limit<=0 to "everything" after
// ClampPageLimit (see go-template-main/model/pagination.go, which spells out that the clamp
// bounds what a caller may ask for, not what the endpoint returns). A portfolio total computed
// over one page would be silently wrong, so that guarantee is load-bearing here, not incidental.
export interface UsePortfolioNbvResult {
  nbv: PortfolioNbv | null;
  loading: boolean;
  error: string | null;
}

export function usePortfolioNbv(): UsePortfolioNbvResult {
  const [nbv, setNbv] = useState<PortfolioNbv | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([assetService.listAssets({}), settingsService.getSettings()])
      .then(([{ data: assets }, settings]) => {
        if (cancelled) return;
        const { usefulLifeYearsByType } = settings.nbv;
        // An Asset Type with no configured row yields `undefined` here. `Number(undefined)` is
        // NaN, and computeAssetNbv's non-finite branch reads that as "not yet depreciated",
        // contributing `purchaseCost` unchanged -- PRD Section 16 Resolved Question 51. The
        // coercion exists to satisfy the lookup's `number` return type without an assertion; the
        // rule itself lives in lib/nbv.ts, not here.
        setNbv(computePortfolioNbv(assets, (type) => Number(usefulLifeYearsByType[type])));
      })
      .catch(() => {
        if (!cancelled) setError('Unable to compute Net Book Value. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { nbv, loading, error };
}
