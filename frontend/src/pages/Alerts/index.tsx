import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Card, Badge, EmptyState } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { useAssets } from '@/hooks/useAssets';
import { useTickets } from '@/hooks/useTickets';
import { useHandovers } from '@/hooks/useHandovers';
import { useSettings } from '@/hooks/useSettings';
import { deriveAlerts, type Alert, type AlertSeverity } from '@/lib/alerts';

// RAISE-FR-ALERT-001 / Prototype P-012. The five trigger conditions and their fixed
// severities were confirmed by business on 2026-09-04 (PRD v0.15 §16 Resolved Question 44,
// closing Open Finding F-05 as R-23) and this page implements Gap 16 -- the four conditions
// that were still unbuilt, plus the real severity values, replacing the honest "Not yet
// defined" placeholder the earlier scoped-down cut showed.
//
// The derivation itself lives in lib/alerts.ts, alongside the warranty helper it reuses,
// per RAISE-DESIGN.md v0.13 §14. Alerts are read-time only: no alert entity, table or
// persisted record exists, and this page holds no alert state of its own.
//
// Still deliberately NOT implemented here: the header bell-icon dropdown (Gap 17 -- an
// unreconciled contradiction between PRD §16 Resolved Question 35 and
// ESAPS-UI-FOUNDATION-BASELINE.md line 88 about whether it belongs to this requirement at
// all), and any acknowledge/dismiss/read-unread/snooze behaviour, which is out of MVP scope.

const SEVERITY_VARIANT: Record<AlertSeverity, 'error' | 'warning' | 'neutral'> = {
  High: 'error',
  Medium: 'warning',
  Low: 'neutral',
};

export function AlertsPage() {
  const navigate = useNavigate();
  const { assets, loading: assetsLoading } = useAssets({});
  const { tickets, loading: ticketsLoading } = useTickets({});
  const { handovers, loading: handoversLoading } = useHandovers({});
  const { settings: platformSettings } = useSettings();

  const loading = assetsLoading || ticketsLoading || handoversLoading;

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

  const columns: Column<Alert>[] = [
    {
      key: 'severity',
      header: 'Severity',
      render: (r) => <Badge variant={SEVERITY_VARIANT[r.severity]}>{r.severity}</Badge>,
    },
    {
      key: 'label',
      header: 'Condition',
      render: (r) => (
        <div>
          <p className="font-medium text-surface-800">{r.label}</p>
          <p className="text-caption text-surface-500">{r.description}</p>
        </div>
      ),
    },
    {
      key: 'record',
      header: 'Affected Record',
      sortable: true,
      sortValue: (r) => r.record.name,
      render: (r) => (
        <button
          onClick={() => navigate(r.record.href)}
          className="font-medium text-brand-600 hover:text-brand-700 transition-colors text-left"
        >
          {r.record.name} <span className="text-caption text-surface-400 font-mono">{r.record.code}</span>
        </button>
      ),
    },
  ];

  return (
    <AppShell current="notifications" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'Alerts' }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-surface-900">Alerts</h1>
          <p className="text-body-sm text-surface-500">
            Expired and expiring warranties, overdue and on-hold maintenance tickets, and IT
            hardware handovers awaiting action. Severity is fixed per condition type.
          </p>
        </div>

        <Card className="p-6">
          {alerts.length === 0 && !loading ? (
            <EmptyState
              icon={<Bell className="h-10 w-10 text-surface-400" />}
              title="No alerts"
              description="No asset, maintenance ticket or handover currently meets an alert condition."
            />
          ) : (
            <DataTable
              columns={columns}
              data={alerts}
              loading={loading}
              searchable={false}
              pageSize={10}
              onRowClick={(row) => navigate(row.record.href)}
            />
          )}
        </Card>
      </div>
    </AppShell>
  );
}
