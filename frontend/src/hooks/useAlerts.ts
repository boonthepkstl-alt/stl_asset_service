import { useMemo } from 'react';
import { useAssets } from '@/hooks/useAssets';
import { useTickets } from '@/hooks/useTickets';
import { useHandovers } from '@/hooks/useHandovers';
import { useSettings } from '@/hooks/useSettings';
import { deriveAlerts, type Alert } from '@/lib/alerts';

// RAISE-FR-ALERT-001. Extracted from pages/Alerts/index.tsx when the header bell was wired up
// (PRD §16 Resolved Question 49, closing Gap 17), so that the bell and the Alerts screen cannot
// disagree about what an alert is, how many there are, or what order they come in.
//
// That shared ordering is not incidental -- it is the decision. Business first asked for "the 5
// most recent" alerts in the bell, which is NOT COMPUTABLE: `Alert` has no timestamp of any kind
// (see lib/alerts.ts), because alerts are a read-time derivation with no persisted record and
// therefore no creation time. `deriveAlerts` sorts by SEVERITY (High -> Medium -> Low). Business
// was shown this and confirmed the bell takes the first five of that same ordering, so the two
// surfaces agree by construction rather than by convention.
//
// This hook adds no state and no caching of its own; it is the same four hooks the Alerts page
// already called, plus the same derivation, in one place.

export interface UseAlertsResult {
  alerts: Alert[];
  loading: boolean;
}

export function useAlerts(): UseAlertsResult {
  const { assets, loading: assetsLoading } = useAssets({});
  const { tickets, loading: ticketsLoading } = useTickets({});
  const { handovers, loading: handoversLoading } = useHandovers({});
  const { settings: platformSettings } = useSettings();

  const alerts = useMemo<Alert[]>(
    () =>
      deriveAlerts({
        assets,
        tickets,
        handovers,
        // Same lookup the Assets list and Asset Detail use -- 90 is the seeded default, not a
        // hardcoded rule (AC-WARRANTY-001-03 / R-17).
        warrantyThresholdFor: (category) =>
          platformSettings?.warranty.expiringThresholdDaysByCategory[category] ?? 90,
      }),
    [assets, tickets, handovers, platformSettings]
  );

  return { alerts, loading: assetsLoading || ticketsLoading || handoversLoading };
}
