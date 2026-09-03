import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ShieldCheck, Send, XCircle, CheckCircle2, Inbox, UserCheck } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Badge, Alert, Modal, Textarea, Button, Tabs, useToast, type TabItem } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { getAssetIcon } from '@/data/asset-icons';
import { useHandovers } from '@/hooks/useHandovers';
import { handoverService } from '@/services/handover-service';
import { useAuth } from '@/contexts/AuthContext';
import type { AssetHandoverModel } from '@/types/handover';

// Consolidation of the 3 former stage-specific pages (MyPendingAssignments, ITProcessingQueue,
// ITSupervisorApprovalQueue) for the IT Hardware Assignment Approval Workflow (RAISE-FR-OPS-002
// exception, PRs #72/#74) into ONE page with role-aware tabs -- mirroring pages/Maintenance's
// established pattern for this codebase's other multi-stage, multi-actor workflow (a single page
// everyone lands on, where role determines what's visible/actionable, not one page per stage).
// Route-level RBAC no longer applies to any of the 3 stages here -- visibility is now a
// page-level (tab) concern, same as Maintenance's role-perspective pills.

type TabId = 'pending' | 'processing' | 'supervisor';

export function HandoversPage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { user, loading: authLoading } = useAuth();

  // --- My Pending tab (Stage 2: Recipient Confirmation) -------------------------------------
  // KNOWN LIMITATION (carried over from the old MyPendingAssignments page): this codebase's
  // auth User (types/auth.ts) is not linked to an Employee record by id -- there is no
  // employeeId field on User. Per the spec's explicit guidance, this filters best-effort by
  // matching the logged-in user's fullName against the handover's recipient.name.
  const { handovers: pendingConfirmationHandovers, loading: pendingLoading, error: pendingError, refetch: refetchPending } = useHandovers({ status: 'PENDING_RECIPIENT_CONFIRMATION' });
  const myHandovers = useMemo(() => {
    const myName = user?.fullName?.trim().toLowerCase();
    if (!myName) return [];
    return pendingConfirmationHandovers.filter((h) => h.recipient.name.trim().toLowerCase() === myName);
  }, [pendingConfirmationHandovers, user]);

  // --- IT Processing tab (Stage 3) -----------------------------------------------------------
  const { handovers: processingHandovers, loading: processingLoading, error: processingError, refetch: refetchProcessing } = useHandovers({ status: 'PENDING_IT_PROCESSING' });

  // --- Supervisor Approval tab (Stage 4) -----------------------------------------------------
  const { handovers: supervisorHandovers, loading: supervisorLoading, error: supervisorError, refetch: refetchSupervisor } = useHandovers({ status: 'PENDING_IT_SUPERVISOR_APPROVAL' });

  const [processingRejectTarget, setProcessingRejectTarget] = useState<AssetHandoverModel | null>(null);
  const [processingRejectReason, setProcessingRejectReason] = useState('');
  const [supervisorRejectTarget, setSupervisorRejectTarget] = useState<AssetHandoverModel | null>(null);
  const [supervisorRejectReason, setSupervisorRejectReason] = useState('');

  const actorId = user?.id ?? 'unknown';
  const actorName = user?.fullName ?? 'Unknown User';

  const canProcessing = user?.role === 'IT_STAFF' || user?.role === 'ADMIN';
  const canSupervisor = user?.role === 'IT_MANAGER' || user?.role === 'ADMIN';

  // Default active tab: whichever tab is most relevant to the user's role. IT_MANAGER ->
  // Supervisor Approval, IT_STAFF -> IT Processing, everyone else (including ADMIN) -> My
  // Pending. Applied once, after auth finishes loading, so it doesn't clobber a manual tab
  // switch made before the role resolves.
  const [activeTab, setActiveTab] = useState<TabId>('pending');
  const [defaultTabApplied, setDefaultTabApplied] = useState(false);
  useEffect(() => {
    if (authLoading || defaultTabApplied) return;
    if (user?.role === 'IT_MANAGER') setActiveTab('supervisor');
    else if (user?.role === 'IT_STAFF') setActiveTab('processing');
    setDefaultTabApplied(true);
  }, [authLoading, user, defaultTabApplied]);

  const tabs: TabItem[] = [
    { id: 'pending', label: 'My Pending', icon: <Inbox className="h-4 w-4" />, count: myHandovers.length },
    ...(canProcessing ? [{ id: 'processing', label: 'IT Processing', icon: <UserCheck className="h-4 w-4" />, count: processingHandovers.length }] : []),
    ...(canSupervisor ? [{ id: 'supervisor', label: 'Supervisor Approval', icon: <ShieldCheck className="h-4 w-4" />, count: supervisorHandovers.length }] : []),
  ];

  // If the current tab becomes unavailable (e.g. role changes), fall back to My Pending.
  useEffect(() => {
    if (activeTab === 'processing' && !canProcessing) setActiveTab('pending');
    if (activeTab === 'supervisor' && !canSupervisor) setActiveTab('pending');
  }, [activeTab, canProcessing, canSupervisor]);

  const handleConfirm = async (row: AssetHandoverModel) => {
    try {
      await handoverService.confirmReceipt(row.handoverCode, { recipientId: row.recipient.id, recipientName: row.recipient.name });
      refetchPending();
      push({ variant: 'success', title: 'Receipt confirmed', message: `${row.handoverCode} routed to the IT Processing queue.` });
    } catch {
      push({ variant: 'error', title: 'Could not confirm receipt', message: 'Please try again.' });
    }
  };

  const handleProcess = async (row: AssetHandoverModel) => {
    try {
      await handoverService.processHandover(row.handoverCode, { actorId, actorName });
      refetchProcessing();
      push({ variant: 'success', title: 'Forwarded for approval', message: `${row.handoverCode} routed to the IT Supervisor Approval queue.` });
    } catch {
      push({ variant: 'error', title: 'Could not forward this handover', message: 'Please try again.' });
    }
  };

  const handleProcessingReject = async () => {
    if (!processingRejectTarget) return;
    try {
      await handoverService.decideHandover(processingRejectTarget.handoverCode, { decision: 'REJECT', actorId, actorName, reason: processingRejectReason });
      refetchProcessing();
      setProcessingRejectTarget(null);
      setProcessingRejectReason('');
      push({ variant: 'warning', title: 'Handover rejected', message: `${processingRejectTarget.asset.name} has been returned to Available.` });
    } catch {
      push({ variant: 'error', title: 'Could not reject this handover', message: 'Please try again.' });
    }
  };

  const handleApprove = async (row: AssetHandoverModel) => {
    try {
      await handoverService.decideHandover(row.handoverCode, { decision: 'APPROVE', actorId, actorName });
      refetchSupervisor();
      push({ variant: 'success', title: 'Handover approved', message: `${row.asset.name} is now assigned to ${row.recipient.name}.` });
    } catch {
      push({ variant: 'error', title: 'Could not approve this handover', message: 'Please try again.' });
    }
  };

  const handleSupervisorReject = async () => {
    if (!supervisorRejectTarget) return;
    try {
      await handoverService.decideHandover(supervisorRejectTarget.handoverCode, { decision: 'REJECT', actorId, actorName, reason: supervisorRejectReason });
      refetchSupervisor();
      setSupervisorRejectTarget(null);
      setSupervisorRejectReason('');
      push({ variant: 'warning', title: 'Handover rejected', message: `${supervisorRejectTarget.asset.name} has been returned to Available.` });
    } catch {
      push({ variant: 'error', title: 'Could not reject this handover', message: 'Please try again.' });
    }
  };

  const assetColumn: Column<AssetHandoverModel> = {
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
  };
  const categoryColumn: Column<AssetHandoverModel> = { key: 'category', header: 'Category', sortable: true, sortValue: (r) => r.asset.category, render: (r) => <Badge variant="neutral">{r.asset.category}</Badge> };

  const pendingColumns: Column<AssetHandoverModel>[] = [
    assetColumn,
    categoryColumn,
    { key: 'initiatedBy', header: 'Initiated by', sortable: true, sortValue: (r) => r.initiatedBy.name, render: (r) => <span className="text-body-sm text-surface-800">{r.initiatedBy.name}</span> },
    { key: 'initiatedAt', header: 'Initiated on', sortable: true, sortValue: (r) => r.initiatedAt, render: (r) => <span className="text-caption text-surface-500">{r.initiatedAt}</span> },
  ];
  const pendingRowActions = (row: AssetHandoverModel) => [
    { label: 'View Details', icon: <Eye className="h-4 w-4" />, onClick: () => navigate(`/handovers/${row.handoverCode}`) },
    { label: 'Confirm Receipt', icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />, onClick: () => handleConfirm(row) },
  ];

  const processingColumns: Column<AssetHandoverModel>[] = [
    assetColumn,
    categoryColumn,
    { key: 'recipient', header: 'Recipient', sortable: true, sortValue: (r) => r.recipient.name, render: (r) => <span className="text-body-sm text-surface-800">{r.recipient.name}</span> },
    { key: 'confirmedAt', header: 'Confirmed on', sortable: true, sortValue: (r) => r.confirmedAt ?? '', render: (r) => <span className="text-caption text-surface-500">{r.confirmedAt ?? '—'}</span> },
  ];
  const processingRowActions = (row: AssetHandoverModel) => [
    { label: 'View Details', icon: <Eye className="h-4 w-4" />, onClick: () => navigate(`/handovers/${row.handoverCode}`) },
    { label: 'Process / Forward for Approval', icon: <Send className="h-4 w-4 text-brand-600" />, onClick: () => handleProcess(row) },
    { label: 'Reject', icon: <XCircle className="h-4 w-4 text-error-600" />, onClick: () => setProcessingRejectTarget(row), danger: true },
  ];

  const supervisorColumns: Column<AssetHandoverModel>[] = [
    assetColumn,
    categoryColumn,
    { key: 'recipient', header: 'Recipient', sortable: true, sortValue: (r) => r.recipient.name, render: (r) => <span className="text-body-sm text-surface-800">{r.recipient.name}</span> },
    { key: 'processedBy', header: 'Processed by', sortable: true, sortValue: (r) => r.processedBy?.name ?? '', render: (r) => <span className="text-body-sm text-surface-800">{r.processedBy?.name ?? '—'}</span> },
    { key: 'processedAt', header: 'Processed on', sortable: true, sortValue: (r) => r.processedAt ?? '', render: (r) => <span className="text-caption text-surface-500">{r.processedAt ?? '—'}</span> },
  ];
  const supervisorRowActions = (row: AssetHandoverModel) => [
    { label: 'View Details', icon: <Eye className="h-4 w-4" />, onClick: () => navigate(`/handovers/${row.handoverCode}`) },
    { label: 'Approve', icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />, onClick: () => handleApprove(row) },
    { label: 'Reject', icon: <XCircle className="h-4 w-4 text-error-600" />, onClick: () => setSupervisorRejectTarget(row), danger: true },
  ];

  return (
    <AppShell current="handovers" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'RAISE' }, { label: 'Asset Handovers' }]}>
      <div className="flex flex-col gap-4">
        <Tabs items={tabs} active={activeTab} onChange={(id) => setActiveTab(id as TabId)} />

        {activeTab === 'pending' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="brand">{myHandovers.length} pending</Badge>
            </div>
            {pendingError ? (
              <Alert variant="error" title="Unable to load your pending assignments">
                {pendingError} <button onClick={refetchPending} className="underline font-medium">Retry</button>
              </Alert>
            ) : (
              <DataTable
                columns={pendingColumns}
                data={myHandovers}
                loading={pendingLoading}
                rowActions={pendingRowActions}
                onRowClick={(row) => navigate(`/handovers/${row.handoverCode}`)}
                emptyTitle="No pending assignments"
                emptyDescription="You have no IT Hardware assignments awaiting your confirmation."
              />
            )}
          </div>
        )}

        {activeTab === 'processing' && canProcessing && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="brand">{processingHandovers.length} awaiting processing</Badge>
            </div>
            {processingError ? (
              <Alert variant="error" title="Unable to load the IT Processing queue">
                {processingError} <button onClick={refetchProcessing} className="underline font-medium">Retry</button>
              </Alert>
            ) : (
              <DataTable
                columns={processingColumns}
                data={processingHandovers}
                loading={processingLoading}
                rowActions={processingRowActions}
                onRowClick={(row) => navigate(`/handovers/${row.handoverCode}`)}
                emptyTitle="No handovers awaiting processing"
                emptyDescription="Confirmed IT Hardware assignments will appear here for processing."
              />
            )}
          </div>
        )}

        {activeTab === 'supervisor' && canSupervisor && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="brand">{supervisorHandovers.length} awaiting approval</Badge>
            </div>
            {supervisorError ? (
              <Alert variant="error" title="Unable to load the IT Supervisor Approval queue">
                {supervisorError} <button onClick={refetchSupervisor} className="underline font-medium">Retry</button>
              </Alert>
            ) : (
              <DataTable
                columns={supervisorColumns}
                data={supervisorHandovers}
                loading={supervisorLoading}
                rowActions={supervisorRowActions}
                onRowClick={(row) => navigate(`/handovers/${row.handoverCode}`)}
                emptyTitle="No handovers awaiting approval"
                emptyDescription="Handovers forwarded by IT Staff will appear here for final approval."
              />
            )}
          </div>
        )}

        <Modal open={!!processingRejectTarget} onClose={() => setProcessingRejectTarget(null)} title="Reject Handover" size="sm">
          <div className="flex flex-col gap-4 py-2">
            {processingRejectTarget && <p className="text-body text-surface-700">Rejecting {processingRejectTarget.handoverCode} ({processingRejectTarget.asset.name}) will return the asset to Available.</p>}
            <Textarea label="Reason" value={processingRejectReason} onChange={(e) => setProcessingRejectReason(e.target.value)} rows={3} placeholder="Why is this handover being rejected?" />
            <div className="flex justify-end gap-2.5 pt-3 border-t border-surface-200">
              <Button variant="outline" onClick={() => setProcessingRejectTarget(null)}>Cancel</Button>
              <Button variant="primary" className="bg-error-600 hover:bg-error-700" onClick={handleProcessingReject}>Confirm Reject</Button>
            </div>
          </div>
        </Modal>

        <Modal open={!!supervisorRejectTarget} onClose={() => setSupervisorRejectTarget(null)} title="Reject Handover" size="sm">
          <div className="flex flex-col gap-4 py-2">
            {supervisorRejectTarget && <p className="text-body text-surface-700">Rejecting {supervisorRejectTarget.handoverCode} ({supervisorRejectTarget.asset.name}) will return the asset to Available.</p>}
            <Textarea label="Reason" value={supervisorRejectReason} onChange={(e) => setSupervisorRejectReason(e.target.value)} rows={3} placeholder="Why is this handover being rejected?" />
            <div className="flex justify-end gap-2.5 pt-3 border-t border-surface-200">
              <Button variant="outline" onClick={() => setSupervisorRejectTarget(null)}>Cancel</Button>
              <Button variant="primary" className="bg-error-600 hover:bg-error-700" onClick={handleSupervisorReject}>Confirm Reject</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
