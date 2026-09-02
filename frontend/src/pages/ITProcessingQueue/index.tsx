import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Send, XCircle } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Badge, Alert, Modal, Textarea, Button, useToast } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { getAssetIcon } from '@/data/asset-icons';
import { useHandovers } from '@/hooks/useHandovers';
import { handoverService } from '@/services/handover-service';
import { useAuth } from '@/contexts/AuthContext';
import type { AssetHandoverModel } from '@/types/handover';

// Stage 3 (IT Processing) of the IT Hardware Assignment Approval Workflow (RAISE-FR-OPS-002
// exception). Route-gated to IT_STAFF/ADMIN client-side (config's App.tsx ProtectedRoute
// allowedRoles) -- UI-only for MVP per spec, no backend enforcement exists yet.
export function ITProcessingQueuePage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { user } = useAuth();

  const { handovers, loading, error, refetch } = useHandovers({ status: 'PENDING_IT_PROCESSING' });

  const [rejectTarget, setRejectTarget] = useState<AssetHandoverModel | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const actorId = user?.id ?? 'unknown';
  const actorName = user?.fullName ?? 'IT Staff';

  const handleProcess = async (row: AssetHandoverModel) => {
    try {
      await handoverService.processHandover(row.handoverCode, { actorId, actorName });
      refetch();
      push({ variant: 'success', title: 'Forwarded for approval', message: `${row.handoverCode} routed to the IT Supervisor Approval queue.` });
    } catch {
      push({ variant: 'error', title: 'Could not forward this handover', message: 'Please try again.' });
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
    { key: 'confirmedAt', header: 'Confirmed on', sortable: true, sortValue: (r) => r.confirmedAt ?? '', render: (r) => <span className="text-caption text-surface-500">{r.confirmedAt ?? '—'}</span> },
  ];

  const rowActions = (row: AssetHandoverModel) => [
    { label: 'View Details', icon: <Eye className="h-4 w-4" />, onClick: () => navigate(`/handovers/${row.handoverCode}`) },
    { label: 'Process / Forward for Approval', icon: <Send className="h-4 w-4 text-brand-600" />, onClick: () => handleProcess(row) },
    { label: 'Reject', icon: <XCircle className="h-4 w-4 text-error-600" />, onClick: () => setRejectTarget(row), danger: true },
  ];

  return (
    <AppShell current="it-processing-queue" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'RAISE' }, { label: 'IT Processing Queue' }]}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="brand">{handovers.length} awaiting processing</Badge>
        </div>

        {error ? (
          <Alert variant="error" title="Unable to load the IT Processing queue">
            {error} <button onClick={refetch} className="underline font-medium">Retry</button>
          </Alert>
        ) : (
          <DataTable
            columns={columns}
            data={handovers}
            loading={loading}
            rowActions={rowActions}
            onRowClick={(row) => navigate(`/handovers/${row.handoverCode}`)}
            emptyTitle="No handovers awaiting processing"
            emptyDescription="Confirmed IT Hardware assignments will appear here for processing."
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
