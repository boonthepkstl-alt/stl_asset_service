import { describe, expect, it } from 'vitest';
import { deriveAlerts, severityFor, type AlertCondition } from './alerts';
import type { Asset } from '@/types/asset';
import type { Ticket } from '@/types/ticket';
import type { AssetHandoverModel } from '@/types/handover';
import { assets as seededAssets } from '@/data/fixtures/mockData';
import { initialRequisitions } from '@/data/fixtures/requisitionData';
import { initialHandovers } from '@/data/fixtures/handoverData';

// Covers the alert-derivation rules confirmed in RAISE-PRD.md v0.15 §16 Resolved Question 44
// (Open Finding F-05, resolved as R-23) and implemented for Gap 16.
//
// The per-rule tests build their own minimal fixtures rather than reading the shared seed
// data. That is deliberate: the shared fixtures are a module-level singleton other suites
// mutate, which is exactly the coupling behind F-40, and asserting "this condition yields
// this severity" needs inputs the test controls outright. `asOf` is injected throughout so
// nothing depends on the clock. The final block is the deliberate exception -- it runs the
// derivation over the real seed data to confirm every condition fires against it, which the
// page test cannot check because the table paginates.

const NOW = new Date('2026-09-04T00:00:00Z');
const thresholds = (days = 90) => () => days;

function asset(over: Partial<Asset> = {}): Asset {
  return {
    id: 'a1',
    code: 'AST-0001',
    name: 'Test Laptop',
    category: 'IT Hardware',
    warrantyExpiry: '2030-01-01',
    ...over,
  } as Asset;
}

function ticket(over: Record<string, unknown> = {}): Ticket {
  return {
    id: 't1',
    ticketCode: 'REQ-2026-0001',
    title: 'Broken hinge',
    status: 'IN_PROGRESS',
    itAssignment: {},
    ...over,
  } as unknown as Ticket;
}

function handover(over: Partial<AssetHandoverModel> = {}): AssetHandoverModel {
  return {
    id: 'h1',
    handoverCode: 'AHO-2026-001',
    status: 'PENDING_IT_PROCESSING',
    asset: { id: 'a9', code: 'AST-0009', name: 'Handover Laptop', category: 'IT Hardware' },
    recipient: { id: 'e1', name: 'Sarah Chen' },
    ...over,
  } as AssetHandoverModel;
}

const empty = { assets: [], tickets: [], handovers: [], warrantyThresholdFor: thresholds(), asOf: NOW };

describe('deriveAlerts — the five confirmed conditions', () => {
  it('raises Warranty EXPIRED at High for an asset past its warranty date', () => {
    const [alert] = deriveAlerts({ ...empty, assets: [asset({ warrantyExpiry: '2024-03-15' })] });

    expect(alert.condition).toBe('WARRANTY_EXPIRED');
    expect(alert.severity).toBe('High');
    expect(alert.record).toMatchObject({ kind: 'Asset', code: 'AST-0001', href: '/assets/a1' });
  });

  it('raises Warranty EXPIRING at Medium inside the category threshold, and nothing outside it', () => {
    // 30 days out: inside a 90-day threshold, outside a 10-day one. Same asset, same date --
    // proving the threshold is read from Settings rather than hardcoded (AC-WARRANTY-001-03).
    const soon = [asset({ warrantyExpiry: '2026-10-04' })];

    const inside = deriveAlerts({ ...empty, assets: soon, warrantyThresholdFor: thresholds(90) });
    expect(inside[0].condition).toBe('WARRANTY_EXPIRING');
    expect(inside[0].severity).toBe('Medium');

    expect(deriveAlerts({ ...empty, assets: soon, warrantyThresholdFor: thresholds(10) })).toHaveLength(0);
  });

  it('raises Ticket OVERDUE at High once the target resolution date has passed', () => {
    const overdue = ticket({ itAssignment: { targetResolutionDate: '2026-08-14' } });
    const [alert] = deriveAlerts({ ...empty, tickets: [overdue] });

    expect(alert.condition).toBe('TICKET_OVERDUE');
    expect(alert.severity).toBe('High');
    expect(alert.record).toMatchObject({ kind: 'Ticket', href: '/maintenance/REQ-2026-0001' });
  });

  it('does not raise Ticket OVERDUE when the ticket is already DONE', () => {
    // The rule is "date passed AND status != DONE" -- the date alone is not enough.
    const done = ticket({ status: 'DONE', itAssignment: { targetResolutionDate: '2026-08-14' } });
    expect(deriveAlerts({ ...empty, tickets: [done] })).toHaveLength(0);
  });

  it('raises Ticket ON_HOLD at Medium', () => {
    const [alert] = deriveAlerts({ ...empty, tickets: [ticket({ status: 'ON_HOLD' })] });

    expect(alert.condition).toBe('TICKET_ON_HOLD');
    expect(alert.severity).toBe('Medium');
  });

  it('raises Handover PENDING at Low for every non-terminal stage, and none for terminal ones', () => {
    const pending = ['PENDING_RECIPIENT_CONFIRMATION', 'PENDING_IT_PROCESSING', 'PENDING_IT_SUPERVISOR_APPROVAL'];
    for (const status of pending) {
      const [alert] = deriveAlerts({ ...empty, handovers: [handover({ status } as Partial<AssetHandoverModel>)] });
      expect(alert.condition).toBe('HANDOVER_PENDING');
      expect(alert.severity).toBe('Low');
      expect(alert.record).toMatchObject({ kind: 'Handover', href: '/handovers/AHO-2026-001' });
    }

    for (const status of ['ASSIGNED', 'REJECTED']) {
      expect(deriveAlerts({ ...empty, handovers: [handover({ status } as Partial<AssetHandoverModel>)] })).toHaveLength(0);
    }
  });
});

describe('deriveAlerts — rules the decision fixed explicitly', () => {
  it('assigns severity per condition type, not by how overdue something is', () => {
    // Resolved Question 44 rejected duration-based severity outright. Two assets expired 2
    // years apart must therefore carry the identical severity.
    const alerts = deriveAlerts({
      ...empty,
      assets: [
        asset({ id: 'a1', code: 'AST-0001', warrantyExpiry: '2022-01-01' }),
        asset({ id: 'a2', code: 'AST-0002', warrantyExpiry: '2026-09-01' }),
      ],
    });

    expect(alerts).toHaveLength(2);
    expect(new Set(alerts.map((a) => a.severity))).toEqual(new Set(['High']));
  });

  it('exposes exactly the five confirmed conditions and no sixth', () => {
    const expected: Record<AlertCondition, string> = {
      WARRANTY_EXPIRED: 'High',
      TICKET_OVERDUE: 'High',
      WARRANTY_EXPIRING: 'Medium',
      TICKET_ON_HOLD: 'Medium',
      HANDOVER_PENDING: 'Low',
    };
    for (const [condition, severity] of Object.entries(expected)) {
      expect(severityFor(condition as AlertCondition)).toBe(severity);
    }
  });

  it('emits both alerts for a ticket that is on hold AND overdue', () => {
    // The five conditions are independent and Resolved Question 44 defines no precedence
    // between them, so suppressing one would be inventing a rule.
    const both = ticket({ status: 'ON_HOLD', itAssignment: { targetResolutionDate: '2026-08-14' } });
    const conditions = deriveAlerts({ ...empty, tickets: [both] }).map((a) => a.condition);

    expect(conditions).toContain('TICKET_OVERDUE');
    expect(conditions).toContain('TICKET_ON_HOLD');
  });

  it('is a read-time derivation: an alert disappears once its condition stops holding', () => {
    // No alert entity or persisted record exists (RAISE-DESIGN.md v0.13 §14), so resolving
    // the underlying state is all it takes for the alert to be gone on the next read.
    const onHold = ticket({ status: 'ON_HOLD' });
    expect(deriveAlerts({ ...empty, tickets: [onHold] })).toHaveLength(1);
    expect(deriveAlerts({ ...empty, tickets: [ticket({ status: 'DONE' })] })).toHaveLength(0);
  });

  it('orders High before Medium before Low', () => {
    const alerts = deriveAlerts({
      ...empty,
      assets: [asset({ warrantyExpiry: '2024-01-01' })],
      tickets: [ticket({ status: 'ON_HOLD' })],
      handovers: [handover()],
    });

    expect(alerts.map((a) => a.severity)).toEqual(['High', 'Medium', 'Low']);
  });

  it('ignores an asset with no warranty date rather than treating it as expired', () => {
    expect(deriveAlerts({ ...empty, assets: [asset({ warrantyExpiry: '' })] })).toHaveLength(0);
  });
});

describe('deriveAlerts — against the real seeded data', () => {
  // The page test can only see the first page of the table, so the check that every
  // condition actually fires against real data belongs here rather than there.
  it('produces alerts for all five conditions', () => {
    const alerts = deriveAlerts({
      assets: seededAssets,
      tickets: initialRequisitions,
      handovers: initialHandovers,
      warrantyThresholdFor: () => 90,
      asOf: NOW,
    });

    const conditions = new Set(alerts.map((a) => a.condition));
    expect(conditions).toEqual(
      new Set(['WARRANTY_EXPIRED', 'TICKET_OVERDUE', 'WARRANTY_EXPIRING', 'TICKET_ON_HOLD', 'HANDOVER_PENDING'])
    );

    // Every alert must reach an existing detail route -- P-012 invents no Alert Detail screen.
    for (const alert of alerts) {
      expect(alert.record.href).toMatch(/^\/(assets|maintenance|handovers)\//);
    }
  });
});
