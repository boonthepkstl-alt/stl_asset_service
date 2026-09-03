import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Card, Badge, EmptyState } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { useAssets } from '@/hooks/useAssets';
import { isWarrantyExpired } from '@/lib/warranty';
import type { Asset } from '@/types/asset';

interface AlertRow {
  id: string;
  asset: Asset;
  description: string;
}

// RAISE-FR-ALERT-001 / Prototype P-012 (F-32, OPEN-FINDINGS.md, resolved 2026-09-01): per
// explicit business decision, this scoped first cut derives alerts from the one condition
// already confirmed elsewhere in the app -- an asset's warrantyExpiry being in the past
// (the same check the Assets list's Warranty column and the Dashboard's Expired Warranty
// tile already use). Trigger rules for any other condition, and severity levels for any
// alert, remain undefined (PRD Section 6.9 Open Question, tracked as F-05) -- severity is
// therefore rendered honestly as "Not yet defined" rather than an invented High/Medium/Low.
export function AlertsPage() {
  const navigate = useNavigate();
  const { assets, loading } = useAssets({});

  const alerts = useMemo<AlertRow[]>(
    () =>
      assets
        .filter((a) => isWarrantyExpired(a.warrantyExpiry))
        .map((asset) => ({ id: asset.id, asset, description: `Warranty expired ${asset.warrantyExpiry}` })),
    [assets]
  );

  const columns: Column<AlertRow>[] = [
    { key: 'severity', header: 'Severity', render: () => <Badge variant="neutral">Not yet defined</Badge> },
    { key: 'description', header: 'Alert', render: (r) => <span className="text-surface-800">{r.description}</span> },
    {
      key: 'asset',
      header: 'Asset',
      sortable: true,
      sortValue: (r) => r.asset.name,
      render: (r) => (
        <button onClick={() => navigate(`/assets/${r.asset.id}`)} className="font-medium text-brand-600 hover:text-brand-700 transition-colors text-left">
          {r.asset.name} <span className="text-caption text-surface-400 font-mono">{r.asset.code}</span>
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
            Warranty-expired assets. Other alert conditions (maintenance due, etc.) and severity levels are not yet defined (Open Finding F-05) — see the Warranty column on{' '}
            <button onClick={() => navigate('/assets')} className="underline hover:text-brand-600">
              Asset Registry
            </button>{' '}
            for the same expiry data.
          </p>
        </div>

        <Card className="p-6">
          {alerts.length === 0 && !loading ? (
            <EmptyState icon={<Bell className="h-10 w-10 text-surface-400" />} title="No alerts" description="No assets currently have an expired warranty." />
          ) : (
            <DataTable columns={columns} data={alerts} loading={loading} searchable={false} pageSize={10} onRowClick={(row) => navigate(`/assets/${row.asset.id}`)} />
          )}
        </Card>
      </div>
    </AppShell>
  );
}
