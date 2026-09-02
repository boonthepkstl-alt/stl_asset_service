import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle2, XCircle } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Badge, Alert, Modal, Textarea, Button, useToast } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { getAssetIcon } from '@/data/asset-icons';
import { useHandovers } from '@/hooks/useHandovers';
import { handoverService } from '@/services/handover-service';
import { useAuth } from '@/contexts/AuthContext';
import type { AssetHandoverModel } from '@/types/handover';

// Stage 4 (IT Supervisor Approval) of the IT Hardware Assignment Approval Workflow
// (RAISE-FR-OPS-002 exception). Route-gated to IT_MANAGER/ADMIN client-side (App.tsx
// ProtectedRoute allowedRoles) -- UI-only for MVP per spec, no backend enforcement exists yet.
// Approve here is the only action in the entire workflow that sets the asset Assigned.
export function ITSupervisorApprovalQueuePage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { user } = useAuth();

  const { handovers, loading, error, refetch } = useHandovers({ status: 'PENDING_IT_SUPERVISOR_APPROVAL' });

  const [rejectTarget, setRejectTarget] = useState<AssetHandoverModel | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const actorId = user?.id ?? 'unknown';
  const actorName = user?.fullName ?? 'IT Supervisor';

  const handleApprove = async (row: AssetHandoverModel) => {
    try {
      await handoverService.decideHandover(row.handoverCode, { decision: 'APPROVE', actorId, actorName });
      refetch();
      push({ variant: 'success', title: 'Handover approved', message: `${row.asset.name} is now assigned to ${row.recipient.name}.` });
    } catch {
      push({ variant: 'error', title: 'Could not approve this handover', message: 'Please try again.' });
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    try {
      await handoverService.decideHandover(rejectTarget.handoverCode, { decision: 'REJECT', actorId, actorName, reason: rejectReason });
      refetch();
      setRejectTarget(null);
      setRejectReason('');
      push({ variant: 'warning', title: 'Handover rejected', message: `${rejectTarget.asset.name} has been returned to Available.` });
    } catch {
      push({ variant: 'error', title: 'Could not reject this handover', message: 'Please try again.' });
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
    { key: 'recipient', header: 'Recipient', sortable: true, sortValue: (r) => r.recipient.name, render: (r) => <span className="text-body-sm text-surface-800">{r.recipient.name}</span> },
    { key: 'processedBy', header: 'Processed by', sortable: true, sortValue: (r) => r.processedBy?.name ?? '', render: (r) => <span className="text-body-sm text-surface-800">{r.processedBy?.name ?? '—'}</span> },
    { key: 'processedAt', header: 'Processed on', sortable: true, sortValue: (r) => r.processedAt ?? '', render: (r) => <span className="text-caption text-surface-500">{r.processedAt ?? '—'}</span> },
  ];

  const rowActions = (row: AssetHandoverModel) => [
    { label: 'View Details', icon: <Eye className="h-4 w-4" />, onClick: () => navigate(`/handovers/${row.handoverCode}`) },
    { label: 'Approve', icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />, onClick: () => handleApprove(row) },
    { label: 'Reject', icon: <XCircle className="h-4 w-4 text-error-600" />, onClick: () => setRejectTarget(row), danger: true },
  ];

  return (
    <AppShell current="it-supervisor-approval-queue" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'RAISE' }, { label: 'IT Supervisor Approval Queue' }]}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="brand">{handovers.length} awaiting approval</Badge>
        </div>

        {error ? (
          <Alert variant="error" title="Unable to load the IT Supervisor Approval queue">
            {error} <button onClick={refetch} className="underline font-medium">Retry</button>
          </Alert>
        ) : (
          <DataTable
            columns={columns}
            data={handovers}
            loading={loading}
            rowActions={rowActions}
            onRowClick={(row) => navigate(`/handovers/${row.handoverCode}`)}
            emptyTitle="No handovers awaiting approval"
            emptyDescription="Handovers forwarded by IT Staff will appear here for final approval."
          />
        )}

        <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Handover" size="sm">
          <div className="flex flex-col gap-4 py-2">
            {rejectTarget && <p className="text-body text-surface-700">Rejecting {rejectTarget.handoverCode} ({rejectTarget.asset.name}) will return the asset to Available.</p>}
            <Textarea label="Reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} placeholder="Why is this handover being rejected?" />
            <div className="flex justify-end gap-2.5 pt-3 border-t border-surface-200">
              <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
              <Button variant="primary" className="bg-error-600 hover:bg-error-700" onClick={handleReject}>Confirm Reject</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
