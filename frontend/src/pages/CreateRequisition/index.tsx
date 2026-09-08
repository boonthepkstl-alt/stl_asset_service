import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Button, Input, Select, Textarea, SectionCard, useToast } from '@/components/ui';
import { useAssets } from '@/hooks/useAssets';
import { ticketService } from '@/services/ticket-service';
import type { TicketCategory, TicketPriority } from '@/types/ticket';

// Full-page "Create IT Requisition", replacing the Modal that pages/Maintenance/index.tsx used
// to open in place. Layout deliberately mirrors pages/CreateAsset/index.tsx — AppShell +
// SectionCards + a sticky action bar, single scrollable page, one validation pass on submit —
// because that is the create-form pattern this app already ships and the request was for the
// same treatment.
//
// Nothing about the requisition's DOMAIN behaviour changes: it still submits through
// ticketService.createTicket() with the same field set, and Stage 1 still lands the ticket in
// PENDING_DEPT_APPROVAL (RAISE-FR-MAINT-001, AC-MAINT-001-03).
//
// Why this needed no specification change: AC-MAINT-001-03 constrains the resulting STATE, not
// the presentation, and TC-MAINT-001-03's step 1 reads "open the maintenance-request form for
// an asset" — form-agnostic. Prototype v0.19 §15 P-009's Stage 1 concept lists the fields and a
// Submit control without specifying modal versus page. Checked before building rather than
// after.

const categoryOptions: { label: string; value: TicketCategory; icon: string }[] = [
  { label: 'Hardware Fault & Repair', value: 'Hardware Fault & Repair', icon: '💻' },
  { label: 'Equipment Replacement / Upgrade', value: 'Equipment Replacement', icon: '🔄' },
  { label: 'Software & OS Issue', value: 'Software & OS Issue', icon: '🖥️' },
  { label: 'Network & Wi-Fi', value: 'Network & Wi-Fi', icon: '📡' },
  { label: 'Peripherals & Accessories', value: 'Peripherals & Accessories', icon: '⌨️' },
  { label: 'Account & Access', value: 'Account & Access', icon: '🔑' },
  { label: 'Preventive Maintenance', value: 'Preventive Maintenance', icon: '🛠️' },
];

const priorityOptions: { value: TicketPriority; label: string }[] = [
  { value: 'Critical', label: 'Critical (2h SLA)' },
  { value: 'High', label: 'High (8h SLA)' },
  { value: 'Medium', label: 'Medium (24h SLA)' },
  { value: 'Low', label: 'Low (48h SLA)' },
];

export function CreateRequisitionPage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { assets } = useAssets({});
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    assetId: '',
    category: 'Hardware Fault & Repair' as TicketCategory,
    priority: 'Medium' as TicketPriority,
    title: '',
    description: '',
    // Carried over verbatim from the Modal this page replaces, so the prefilled value a
    // requester used to see is unchanged. It is a seeded placeholder, not a real lookup —
    // there is no current-user location source yet.
    location: 'HQ - Floor 4, Desk E-412',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [assetPreselected, setAssetPreselected] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Same preselection the Modal did on open: default to the current user's first assigned
  // asset. The 'Sarah Chen' identity is carried over verbatim from Maintenance's own
  // myAssignedAssets filter — this page does not introduce a real current-user lookup, because
  // there is no User->Employee link yet (PRD §16 Q22a).
  const myAssignedAssets = useMemo(
    () => assets.filter((a) => a.assignedTo === 'Sarah Chen'),
    [assets],
  );

  // Assets arrive asynchronously, so preselect once they land rather than on mount. Guarded so
  // it never overwrites a choice the user has already made.
  useEffect(() => {
    if (assetPreselected || myAssignedAssets.length === 0) return;
    setAssetPreselected(true);
    setForm((f) => (f.assetId ? f : { ...f, assetId: myAssignedAssets[0].id }));
  }, [assetPreselected, myAssignedAssets]);

  // The Modal validated the same two fields but reported them through a single toast. Surfacing
  // them as per-field errors matches CreateAsset and shows both at once; the required set is
  // unchanged, so nothing that used to submit is now rejected.
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.assetId) e.assetId = 'Affected asset is required';
    if (!form.title.trim()) e.title = 'Subject / problem summary is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await ticketService.createTicket({
        requesterId: 'e1',
        assetId: form.assetId,
        category: form.category,
        priority: form.priority,
        title: form.title,
        description: form.description,
        location: form.location,
      });
      push({
        variant: 'success',
        title: 'IT Requisition Submitted',
        message: `${created.ticketCode} routed to Department Approver for sign-off.`,
      });
      navigate('/maintenance');
    } catch {
      setSubmitError('Unable to submit the IT requisition. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell
      current="maintenance"
      onNavigate={(id) => navigate(`/${id}`)}
      breadcrumb={[
        { label: 'IT Requisition & Maintenance', href: '/maintenance' },
        { label: 'Create IT Requisition' },
      ]}
    >
      {/* Full width on purpose: these four create/edit pages all carried
          `max-w-3xl mx-auto`, which left most of the screen empty on a desktop. Removed
          from all four together so the create/edit forms stay consistent with each other
          — widening only some of them was the alternative, and that is the kind of
          half-applied change this codebase keeps having to go back and finish. */}
      <div className="flex flex-col gap-4">
        <SectionCard title="Request Details" description="What is being requested, and for which asset">
          <div className="flex flex-col gap-4">
            <Select
              name="assetId"
              label="Affected Asset"
              value={form.assetId}
              onChange={(e) => set('assetId', e.target.value)}
              error={errors.assetId}
              options={[
                { value: '', label: '— Select asset —' },
                ...assets.map((a) => ({ value: a.id, label: `${a.code} • ${a.name}` })),
              ]}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                name="category"
                label="Category"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                options={categoryOptions.map((c) => ({ value: c.value, label: `${c.icon} ${c.label}` }))}
              />
              <Select
                name="priority"
                label="Priority"
                value={form.priority}
                onChange={(e) => set('priority', e.target.value)}
                options={priorityOptions}
              />
            </div>
            <Input
              name="title"
              label="Subject / Problem Summary"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              error={errors.title}
            />
            <Textarea
              name="description"
              label="Detailed Description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4}
            />
          </div>
        </SectionCard>

        <SectionCard title="Location" description="Where the asset or the issue is">
          <Input
            name="location"
            label="Physical Location"
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
          />
        </SectionCard>

        {submitError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-error-50 border border-error-200 text-body text-error-700">
            {submitError}
          </div>
        )}

        {/* Sticky action bar: `main` in AppShell is the scroll container, so bottom-0 pins this
            to the bottom of the viewport while the form scrolls behind it — same as CreateAsset. */}
        <div className="sticky bottom-0 z-10 -mx-1 px-1 py-3 bg-surface-50/95 backdrop-blur border-t border-surface-200 flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/maintenance')} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} loading={submitting} leftIcon={<Send className="h-4 w-4" />}>
            Submit IT Requisition
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
