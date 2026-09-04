import { getWarrantyStatus } from '@/lib/warranty';
import type { Asset } from '@/types/asset';
import type { Ticket } from '@/types/ticket';
import type { AssetHandoverModel } from '@/types/handover';

// RAISE-FR-ALERT-001 alert derivation (Gap 16 in RAISE-TRACEABILITY-MATRIX.md v1.9).
//
// The five trigger conditions and their severities were confirmed by business on 2026-09-04
// and are recorded in RAISE-PRD.md v0.15 §16 Resolved Question 44 (Open Finding F-05, R-23).
// Nothing here is inferred: every condition reads state that already exists, and the severity
// of each is FIXED PER CONDITION TYPE -- deliberately not computed from how overdue something
// is, and not from asset value or an asset-criticality field (no such field exists).
//
// Per RAISE-DESIGN.md v0.13 §14 this is a READ-TIME DERIVATION: there is no Alert entity, no
// alert table and no persisted alert record. An alert exists exactly as long as the underlying
// Asset/Ticket/Handover state satisfies its condition, and disappears when that state changes.
// That is why this is a pure function over already-fetched lists rather than a service.

export type AlertSeverity = 'High' | 'Medium' | 'Low';

export type AlertCondition =
  | 'WARRANTY_EXPIRED'
  | 'TICKET_OVERDUE'
  | 'WARRANTY_EXPIRING'
  | 'TICKET_ON_HOLD'
  | 'HANDOVER_PENDING';

/** The record an alert points at. Alerts span three domains, so this is not always an Asset. */
export type AlertRecordKind = 'Asset' | 'Ticket' | 'Handover';

export interface Alert {
  /** Stable within a render: condition + record id. Not persisted -- see the note above. */
  id: string;
  condition: AlertCondition;
  severity: AlertSeverity;
  /** Human-readable label for the condition, as shown in Prototype P-012. */
  label: string;
  description: string;
  record: {
    kind: AlertRecordKind;
    name: string;
    code: string;
    /** Existing detail route. P-012 invents no "Alert Detail" screen and neither does this. */
    href: string;
  };
}

// PRD §16 Resolved Question 44's mapping, in one place so it cannot drift across call sites.
const SEVERITY: Record<AlertCondition, AlertSeverity> = {
  WARRANTY_EXPIRED: 'High',
  TICKET_OVERDUE: 'High',
  WARRANTY_EXPIRING: 'Medium',
  TICKET_ON_HOLD: 'Medium',
  HANDOVER_PENDING: 'Low',
};

const LABEL: Record<AlertCondition, string> = {
  WARRANTY_EXPIRED: 'Warranty Expired',
  TICKET_OVERDUE: 'Maintenance Ticket Overdue',
  WARRANTY_EXPIRING: 'Warranty Expiring',
  TICKET_ON_HOLD: 'Maintenance Ticket On Hold',
  HANDOVER_PENDING: 'IT Hardware Handover Pending',
};

export function severityFor(condition: AlertCondition): AlertSeverity {
  return SEVERITY[condition];
}

// Renders High before Medium before Low, matching P-012's wireframe. Presentation only --
// it does not imply any ranking rule beyond the fixed mapping above.
const SEVERITY_ORDER: Record<AlertSeverity, number> = { High: 0, Medium: 1, Low: 2 };

// Non-terminal stages of the 4-stage IT Hardware Assignment Approval Workflow
// (RAISE-FR-OPS-002). ASSIGNED and REJECTED are terminal and raise no alert.
const PENDING_HANDOVER_STATUSES = [
  'PENDING_RECIPIENT_CONFIRMATION',
  'PENDING_IT_PROCESSING',
  'PENDING_IT_SUPERVISOR_APPROVAL',
];

export interface DeriveAlertsInput {
  assets: Asset[];
  tickets: Ticket[];
  handovers: AssetHandoverModel[];
  /**
   * Per-Asset-Category "Expiring" threshold in days. This REUSES the threshold already
   * confirmed and shipped for RAISE-FR-WARRANTY-001 (AC-WARRANTY-001-03, R-17) and editable
   * by an ADMIN in Settings -- Resolved Question 44 explicitly does not introduce a second one.
   */
  warrantyThresholdFor: (category: string) => number;
  /** Injectable for deterministic tests; defaults to now. */
  asOf?: Date;
}

export function deriveAlerts({
  assets,
  tickets,
  handovers,
  warrantyThresholdFor,
  asOf = new Date(),
}: DeriveAlertsInput): Alert[] {
  const alerts: Alert[] = [];

  for (const asset of assets) {
    if (!asset.warrantyExpiry) continue;
    const status = getWarrantyStatus(asset.warrantyExpiry, warrantyThresholdFor(asset.category), asOf);
    if (status === 'Active') continue;

    const condition: AlertCondition = status === 'Expired' ? 'WARRANTY_EXPIRED' : 'WARRANTY_EXPIRING';
    alerts.push({
      id: `${condition}:${asset.id}`,
      condition,
      severity: SEVERITY[condition],
      label: LABEL[condition],
      description:
        status === 'Expired'
          ? `Warranty expired ${asset.warrantyExpiry}`
          : `Warranty expires ${asset.warrantyExpiry}`,
      record: { kind: 'Asset', name: asset.name, code: asset.code, href: `/assets/${asset.id}` },
    });
  }

  for (const ticket of tickets) {
    const href = `/maintenance/${ticket.ticketCode}`;
    const record = { kind: 'Ticket' as const, name: ticket.title, code: ticket.ticketCode, href };

    // A ticket that is both stalled and past its target date genuinely satisfies both
    // conditions, so both alerts are emitted. Resolved Question 44 defines five independent
    // conditions and no precedence between them -- suppressing one here would be inventing a
    // rule the business was never asked for.
    const target = ticket.itAssignment?.targetResolutionDate;
    if (target && ticket.status !== 'DONE' && new Date(target) < asOf) {
      alerts.push({
        id: `TICKET_OVERDUE:${ticket.id}`,
        condition: 'TICKET_OVERDUE',
        severity: SEVERITY.TICKET_OVERDUE,
        label: LABEL.TICKET_OVERDUE,
        description: `Target resolution date ${target} has passed`,
        record,
      });
    }

    if (ticket.status === 'ON_HOLD') {
      alerts.push({
        id: `TICKET_ON_HOLD:${ticket.id}`,
        condition: 'TICKET_ON_HOLD',
        severity: SEVERITY.TICKET_ON_HOLD,
        label: LABEL.TICKET_ON_HOLD,
        description: 'Ticket is on hold',
        record,
      });
    }
  }

  for (const handover of handovers) {
    if (!PENDING_HANDOVER_STATUSES.includes(handover.status)) continue;
    alerts.push({
      id: `HANDOVER_PENDING:${handover.id}`,
      condition: 'HANDOVER_PENDING',
      severity: SEVERITY.HANDOVER_PENDING,
      label: LABEL.HANDOVER_PENDING,
      description: `Awaiting action for ${handover.recipient.name}`,
      record: {
        kind: 'Handover',
        name: handover.asset.name,
        code: handover.handoverCode,
        href: `/handovers/${handover.handoverCode}`,
      },
    });
  }

  return alerts.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}
