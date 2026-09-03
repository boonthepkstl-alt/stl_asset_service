import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRightLeft, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Card, CardHeader, Button, Badge, EmptyState, SectionCard, Modal, Textarea, useToast } from '@/components/ui';
import { getAssetIcon } from '@/data/asset-icons';
import { useHandover } from '@/hooks/useHandover';
import { handoverService } from '@/services/handover-service';
import { useAuth } from '@/contexts/AuthContext';
import type { HandoverStatus } from '@/types/handover';
import { cn } from '@/lib/cn';

// Detail page for the IT Hardware Assignment Approval Workflow (RAISE-FR-OPS-002 exception).
// Follows pages/TicketDetail's exact pattern: a single route (not an inline expand/modal --
// TicketDetail is the established convention for "detail" here; Maintenance's list page links
// out to it rather than embedding it) with a 4-stage GovernanceStep-style indicator plus the
// full timeline. Reads/writes exclusively through handoverService/useHandover.

export function HandoverDetailPage() {
  const { handoverCode } = useParams<{ handoverCode: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const { user } = useAuth();
  const { handover, loading, error, notFound, refetch } = useHandover(handoverCode);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [busy, setBusy] = useState(false);

  const getStatusBadge = (status: HandoverStatus) => {
    switch (status) {
      case 'PENDING_RECIPIENT_CONFIRMATION': return <Badge variant="warning" dot>1. Awaiting Recipient Confirmation</Badge>;
      case 'PENDING_IT_PROCESSING': return <Badge variant="brand" dot>2. Awaiting IT Processing</Badge>;
      case 'PENDING_IT_SUPERVISOR_APPROVAL': return <Badge variant="accent" dot>3. Awaiting IT Supervisor Approval</Badge>;
      case 'ASSIGNED': return <Badge variant="success" dot>4. Assigned</Badge>;
      case 'REJECTED': return <Badge variant="error" dot>Rejected</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  if (loading) {
    return <AppShell current="handovers" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'Handover Details' }]}><div className="flex items-center justify-center py-24 text-body text-surface-400">Loading handover...</div></AppShell>;
  }
  if (error) {
    return <AppShell current="handovers" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'Handover Details' }]}><EmptyState icon={<AlertTriangle className="h-6 w-6" />} title="Unable to load handover" description={error} action={<Button onClick={refetch}>Retry</Button>} /></AppShell>;
  }
  if (notFound || !handover) {
    return <AppShell current="handovers" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'Handover Details' }]}><EmptyState icon={<ArrowRightLeft className="h-6 w-6" />} title="Handover not found" description="This handover may have been removed or the link is out of date." action={<Button onClick={() => navigate('/handovers')}>Back</Button>} /></AppShell>;
  }

  const Icon = getAssetIcon(handover.asset.type);

  const currentStage: 1 | 2 | 3 | null =
    handover.status === 'PENDING_RECIPIENT_CONFIRMATION' ? 1 :
    handover.status === 'PENDING_IT_PROCESSING' ? 2 :
    handover.status === 'PENDING_IT_SUPERVISOR_APPROVAL' ? 3 :
    null;

  const actorId = user?.id ?? 'unknown';
  const actorName = user?.fullName ?? 'Unknown User';

  const handleConfirmReceipt = async () => {
    setBusy(true);
    try {
      await handoverService.confirmReceipt(handover.handoverCode, { recipientId: handover.recipient.id, recipientName: handover.recipient.name });
      refetch();
      setIsConfirmModalOpen(false);
      push({ variant: 'success', title: 'Receipt confirmed', message: `${handover.handoverCode} routed to the IT Processing queue.` });
    } catch {
      push({ variant: 'error', title: 'Could not confirm receipt', message: 'Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  const handleProcess = async () => {
    setBusy(true);
    try {
      await handoverService.processHandover(handover.handoverCode, { actorId, actorName });
      refetch();
      setIsProcessModalOpen(false);
      push({ variant: 'success', title: 'Forwarded for approval', message: `${handover.handoverCode} routed to the IT Supervisor Approval queue.` });
    } catch {
      push({ variant: 'error', title: 'Could not forward this handover', message: 'Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  const handleApprove = async () => {
    setBusy(true);
    try {
      await handoverService.decideHandover(handover.handoverCode, { decision: 'APPROVE', actorId, actorName });
      refetch();
      setIsApproveModalOpen(false);
      push({ variant: 'success', title: 'Handover approved', message: `${handover.asset.name} is now assigned to ${handover.recipient.name}.` });
    } catch {
      push({ variant: 'error', title: 'Could not approve this handover', message: 'Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    setBusy(true);
    try {
      await handoverService.decideHandover(handover.handoverCode, { decision: 'REJECT', actorId, actorName, reason: rejectReason });
      refetch();
      setIsRejectModalOpen(false);
      setRejectReason('');
      push({ variant: 'warning', title: 'Handover rejected', message: `${handover.asset.name} has been returned to Available.` });
    } catch {
      push({ variant: 'error', title: 'Could not reject this handover', message: 'Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell current="handovers" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'Handover', href: '/handovers' }, { label: handover.handoverCode }]}>
      <div className="flex flex-col gap-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-body text-surface-500 hover:text-surface-800 transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <Card>
          <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0"><Icon className="h-6 w-6 text-brand-600" /></div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-title font-bold text-surface-900 bg-surface-100 px-2 py-0.5 rounded-lg border border-surface-200">{handover.handoverCode}</span>
                  {getStatusBadge(handover.status)}
                  <Badge variant="neutral">{handover.asset.category}</Badge>
                </div>
                <h1 className="text-heading font-bold text-surface-900 mt-2">{handover.asset.name}</h1>
                <p className="text-caption text-surface-500 mt-1">Recipient: <strong className="text-surface-800">{handover.recipient.name}</strong> · Initiated by {handover.initiatedBy.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {handover.status === 'PENDING_RECIPIENT_CONFIRMATION' && (
                <Button size="sm" leftIcon={<ShieldCheck className="h-4 w-4" />} onClick={() => setIsConfirmModalOpen(true)}>Confirm Receipt</Button>
              )}
              {handover.status === 'PENDING_IT_PROCESSING' && (
                <>
                  <Button size="sm" variant="outline" onClick={() => setIsProcessModalOpen(true)}>Process / Forward for Approval</Button>
                  <Button size="sm" variant="outline" className="text-error-600 hover:bg-error-50 border-error-200" onClick={() => setIsRejectModalOpen(true)}>Reject</Button>
                </>
              )}
              {handover.status === 'PENDING_IT_SUPERVISOR_APPROVAL' && (
                <>
                  <Button size="sm" onClick={() => setIsApproveModalOpen(true)}>Approve</Button>
                  <Button size="sm" variant="outline" className="text-error-600 hover:bg-error-50 border-error-200" onClick={() => setIsRejectModalOpen(true)}>Reject</Button>
                </>
              )}
              <Button size="sm" variant="ghost" leftIcon={<ExternalLink className="h-4 w-4" />} onClick={() => navigate(`/assets/${handover.asset.id}`)}>Open Asset</Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {handover.status === 'REJECTED' && (
              <div className="p-4 rounded-xl bg-error-50 border border-error-200 text-error-900 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Handover Rejected at {handover.rejectionStage || 'an earlier stage'}</span>
                  <p className="text-body mt-1">{handover.rejectionReason || 'No reason provided.'} Asset returned to Available.</p>
                </div>
              </div>
            )}
            {handover.status === 'ASSIGNED' && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                <div><span className="font-bold">Approved & Assigned</span><p className="text-body mt-1">{handover.asset.name} is now assigned to {handover.recipient.name}.</p></div>
              </div>
            )}

            <SectionCard title="4-Stage Governance & Audit Trail" description="Complete chain of custody from initiation through final approval">
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-200">
                <GovernanceStep n={1} done label="Initiation" detail={`By ${handover.initiatedBy.name} — assigned to ${handover.recipient.name}`} timestamp={handover.initiatedAt} />
                <GovernanceStep n={2} done={!!handover.confirmedAt} current={currentStage === 1} label="Recipient Confirmation" detail={handover.confirmedAt ? `Confirmed by ${handover.recipient.name}` : 'Awaiting recipient confirmation'} timestamp={handover.confirmedAt} />
                <GovernanceStep n={3} done={!!handover.processedAt} current={currentStage === 2} label="IT Processing" detail={handover.processedBy ? `Processed by ${handover.processedBy.name}` : handover.rejectionStage === 'IT Processing' ? 'Rejected' : 'Awaiting IT processing'} timestamp={handover.processedAt} />
                <GovernanceStep n={4} done={handover.status === 'ASSIGNED'} current={currentStage === 3} label="IT Supervisor Approval" detail={handover.approvedBy ? `Approved by ${handover.approvedBy.name}` : handover.rejectionStage === 'IT Supervisor Approval' ? 'Rejected' : 'Awaiting IT supervisor approval'} timestamp={handover.approvedAt} />
              </div>
            </SectionCard>
          </div>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader title="Asset" />
              <div className="p-5">
                <div className="p-3 bg-surface-50 rounded-xl border border-surface-200 flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-lg bg-white border border-surface-200 flex items-center justify-center shrink-0"><Icon className="h-5 w-5 text-brand-600" /></div>
                  <div className="min-w-0"><p className="text-body font-bold text-surface-900 truncate">{handover.asset.name}</p><p className="text-caption text-surface-500 font-mono">{handover.asset.code}</p></div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader title="Audit Trail" />
          <div className="p-6 space-y-3">
            {handover.timeline.map((event) => (
              <div key={event.id} className="p-3 rounded-lg border border-surface-200 bg-surface-50/50">
                <div className="flex items-center justify-between"><span className="font-semibold text-surface-900 text-body-sm">{event.stage}</span><span className="text-caption text-surface-400">{event.timestamp}</span></div>
                <p className="text-caption text-surface-600 mt-1">{event.action}</p>
                <p className="text-caption text-surface-500 mt-0.5">By {event.actorName} ({event.actorRole})</p>
                {event.notes && <p className="text-caption text-surface-500 italic mt-1">{event.notes}</p>}
              </div>
            ))}
          </div>
        </Card>

        <Modal open={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Confirm Receipt" description={`Confirm you have received ${handover.asset.name}`} size="sm">
          <div className="flex flex-col gap-4 py-2">
            <p className="text-body text-surface-700">
              By confirming, you acknowledge receipt of <strong>{handover.asset.name}</strong> ({handover.asset.code}). This will route the assignment to the IT Processing queue.
            </p>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-surface-200">
              <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmReceipt} disabled={busy}>{busy ? 'Confirming...' : 'Confirm Receipt'}</Button>
            </div>
          </div>
        </Modal>

        <Modal open={isProcessModalOpen} onClose={() => setIsProcessModalOpen(false)} title="Process / Forward for Approval" size="sm">
          <div className="flex flex-col gap-4 py-2">
            <p className="text-body text-surface-700">This will forward {handover.handoverCode} to the IT Supervisor Approval queue.</p>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-surface-200">
              <Button variant="outline" onClick={() => setIsProcessModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleProcess} disabled={busy}>{busy ? 'Forwarding...' : 'Forward for Approval'}</Button>
            </div>
          </div>
        </Modal>

        <Modal open={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} title="Approve Handover" size="sm">
          <div className="flex flex-col gap-4 py-2">
            <p className="text-body text-surface-700">Approving will assign {handover.asset.name} to {handover.recipient.name} and set the asset's status to Assigned.</p>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-surface-200">
              <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleApprove} disabled={busy}>{busy ? 'Approving...' : 'Approve'}</Button>
            </div>
          </div>
        </Modal>

        <Modal open={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Handover" size="sm">
          <div className="flex flex-col gap-4 py-2">
            <Textarea label="Reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} placeholder="Why is this handover being rejected?" />
            <div className="flex justify-end gap-2.5 pt-3 border-t border-surface-200">
              <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
              <Button variant="primary" className="bg-error-600 hover:bg-error-700" onClick={handleReject} disabled={busy}>{busy ? 'Rejecting...' : 'Confirm Reject'}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}

function GovernanceStep({ n, done, current, label, detail, timestamp }: { n: number; done: boolean; current?: boolean; label: string; detail: string; timestamp?: string }) {
  return (
    <div className="relative flex items-start gap-3 pl-1">
      <div className={cn('h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 text-white shrink-0', done ? 'bg-emerald-600' : current ? 'bg-brand-600 ring-4 ring-brand-100' : 'bg-surface-400')}>{done ? '✓' : n}</div>
      <div className={cn('flex-1 p-3 rounded-xl border', current ? 'bg-brand-50 border-brand-200' : 'bg-surface-50 border-surface-200')}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-body font-bold text-surface-900 flex items-center gap-2">
            {n}. {label}
            {current && <Badge variant="brand">Current</Badge>}
          </p>
          {timestamp && <span className="text-caption text-surface-400 font-mono">{timestamp}</span>}
        </div>
        <p className="text-caption text-surface-600 mt-1">{detail}</p>
      </div>
    </div>
  );
}
