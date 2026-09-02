import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Badge, Alert, useToast } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { getAssetIcon } from '@/data/asset-icons';
import { useHandovers } from '@/hooks/useHandovers';
import { handoverService } from '@/services/handover-service';
import { useAuth } from '@/contexts/AuthContext';
import type { AssetHandoverModel } from '@/types/handover';

// Stage 2 (Recipient Confirmation) of the IT Hardware Assignment Approval Workflow
// (RAISE-FR-OPS-002 exception). No role restriction -- any authenticated user, filtered to
// their own recipient records.
//
// KNOWN LIMITATION: this codebase's auth User (types/auth.ts) is not linked to an Employee
// record by id -- there is no employeeId field on User, and no other screen in this app
// resolves one either. Per the spec's explicit guidance, this filters best-effort by matching
// the logged-in user's fullName against the handover's recipient.name. This will silently miss
// a handover if the two names differ (e.g. a nickname, a name change) -- a real fix needs a
// User->Employee link that doesn't exist anywhere in this codebase yet, not something to invent
// here.
export function MyPendingAssignmentsPage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { user } = useAuth();

  const { handovers, loading, error, refetch } = useHandovers({ status: 'PENDING_RECIPIENT_CONFIRMATION' });

  const myHandovers = useMemo(() => {
    const myName = user?.fullName?.trim().toLowerCase();
    if (!myName) return [];
    return handovers.filter((h) => h.recipient.name.trim().toLowerCase() === myName);
  }, [handovers, user]);

  const handleConfirm = async (row: AssetHandoverModel) => {
    try {
      await handoverService.confirmReceipt(row.handoverCode, { recipientId: row.recipient.id, recipientName: row.recipient.name });
      refetch();
      push({ variant: 'success', title: 'Receipt confirmed', message: `${row.handoverCode} routed to the IT Processing queue.` });
    } catch {
      push({ variant: 'error', title: 'Could not confirm receipt', message: 'Please try again.' });
    }
  };

  const columns: Column<AssetHandoverModel>[] = [
    {
      key: 'asset',
      header: 'Asset',
      sortable: true,
      sortValue: (r) => r.asset.name,
      render: (r) => {
        const Icon = getAssetIcon(r.asset.type);
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-surface-100 flex items-center justify-center shrink-0"><Icon className="h-4 w-4 text-brand-600" /></div>
            <div className="min-w-0">
              <p className="font-mono font-bold text-surface-900">{r.handoverCode}</p>
              <p className="text-caption text-surface-600 truncate">{r.asset.name} · {r.asset.code}</p>
            </div>
          </div>
        );
      },
    },
    { key: 'category', header: 'Category', sortable: true, sortValue: (r) => r.asset.category, render: (r) => <Badge variant="neutral">{r.asset.category}</Badge> },
    { key: 'initiatedBy', header: 'Initiated by', sortable: true, sortValue: (r) => r.initiatedBy.name, render: (r) => <span className="text-body-sm text-surface-800">{r.initiatedBy.name}</span> },
    { key: 'initiatedAt', header: 'Initiated on', sortable: true, sortValue: (r) => r.initiatedAt, render: (r) => <span className="text-caption text-surface-500">{r.initiatedAt}</span> },
  ];

  const rowActions = (row: AssetHandoverModel) => [
    { label: 'View Details', icon: <Eye className="h-4 w-4" />, onClick: () => navigate(`/handovers/${row.handoverCode}`) },
    { label: 'Confirm Receipt', icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />, onClick: () => handleConfirm(row) },
  ];

  return (
    <AppShell current="my-pending-assignments" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'RAISE' }, { label: 'My Pending Assignments' }]}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="brand">{myHandovers.length} pending</Badge>
        </div>

        {error ? (
          <Alert variant="error" title="Unable to load your pending assignments">
            {error} <button onClick={refetch} className="underline font-medium">Retry</button>
          </Alert>
        ) : (
          <DataTable
            columns={columns}
            data={myHandovers}
            loading={loading}
            rowActions={rowActions}
            onRowClick={(row) => navigate(`/handovers/${row.handoverCode}`)}
            emptyTitle="No pending assignments"
            emptyDescription="You have no IT Hardware assignments awaiting your confirmation."
          />
        )}
      </div>
    </AppShell>
  );
}

