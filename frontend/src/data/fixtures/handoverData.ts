import type { AssetHandoverModel } from '@/types/handover';

// Seed data for MockHandoverRepository. Unlike assets/employees, handovers are normally
// created dynamically by user action (Stage 1 Assign on an IT Hardware asset) -- but per the
// Ticket domain's own seed-data convention (data/fixtures/requisitionData.ts's
// initialRequisitions), a handful of realistic in-flight records are seeded so the three new
// queue screens have something to show in Mock mode without manual setup. Each references a
// real IT Hardware asset/employee from mockData.ts (a11 MacBook Air M2 / Available, a12
// ThinkPad X1 Carbon / e6 James Wilson, a2 Dell UltraSharp Monitor / e1 Sarah Chen) so the
// asset/recipient snapshots line up with what Assets/Employees pages already show.

export const initialHandovers: AssetHandoverModel[] = [
  {
    id: 'aho-1',
    handoverCode: 'AHO-2026-001',
    status: 'PENDING_RECIPIENT_CONFIRMATION',
    createdAt: '2026-08-28T09:15:00Z',
    asset: { id: 'a11', code: 'AST-0011', name: 'MacBook Air M2', category: 'IT Hardware', type: 'Laptop' },
    recipient: { id: 'e3', name: 'Priya Patel', role: 'Design' },
    initiatedBy: { id: 'e1', name: 'Sarah Chen', role: 'Administrator' },
    initiatedAt: '2026-08-28T09:15:00Z',
    timeline: [
      {
        id: 'aho-1-tl-1',
        stage: 'Creation',
        actorName: 'Sarah Chen',
        actorRole: 'Administrator',
        timestamp: '2026-08-28T09:15:00Z',
        action: 'Assignment initiated for MacBook Air M2 (AST-0011) to Priya Patel — awaiting recipient confirmation.',
      },
    ],
  },
  {
    id: 'aho-2',
    handoverCode: 'AHO-2026-002',
    status: 'PENDING_IT_PROCESSING',
    createdAt: '2026-08-26T11:00:00Z',
    asset: { id: 'a12', code: 'AST-0012', name: 'ThinkPad X1 Carbon Gen 11', category: 'IT Hardware', type: 'Laptop' },
    recipient: { id: 'e6', name: 'James Wilson', role: 'Finance' },
    initiatedBy: { id: 'e1', name: 'Sarah Chen', role: 'Administrator' },
    initiatedAt: '2026-08-26T11:00:00Z',
    confirmedAt: '2026-08-27T08:30:00Z',
    timeline: [
      {
        id: 'aho-2-tl-1',
        stage: 'Creation',
        actorName: 'Sarah Chen',
        actorRole: 'Administrator',
        timestamp: '2026-08-26T11:00:00Z',
        action: 'Assignment initiated for ThinkPad X1 Carbon Gen 11 (AST-0012) to James Wilson — awaiting recipient confirmation.',
      },
      {
        id: 'aho-2-tl-2',
        stage: 'Recipient Confirmation',
        actorName: 'James Wilson',
        actorRole: 'Recipient',
        timestamp: '2026-08-27T08:30:00Z',
        action: 'Recipient confirmed receipt — routed to IT Processing queue.',
      },
    ],
  },
  {
    id: 'aho-3',
    handoverCode: 'AHO-2026-003',
    status: 'PENDING_IT_SUPERVISOR_APPROVAL',
    createdAt: '2026-08-20T13:45:00Z',
    asset: { id: 'a2', code: 'AST-0002', name: 'Dell UltraSharp 32" Monitor', category: 'IT Hardware', type: 'Monitor' },
    recipient: { id: 'e1', name: 'Sarah Chen', role: 'Engineering' },
    initiatedBy: { id: 'e6', name: 'James Wilson', role: 'Administrator' },
    initiatedAt: '2026-08-20T13:45:00Z',
    confirmedAt: '2026-08-21T09:00:00Z',
    processedBy: { id: 'tech-1', name: 'Alex Rivera', role: 'IT Staff' },
    processedAt: '2026-08-22T10:20:00Z',
    timeline: [
      {
        id: 'aho-3-tl-1',
        stage: 'Creation',
        actorName: 'James Wilson',
        actorRole: 'Administrator',
        timestamp: '2026-08-20T13:45:00Z',
        action: 'Assignment initiated for Dell UltraSharp 32" Monitor (AST-0002) to Sarah Chen — awaiting recipient confirmation.',
      },
      {
        id: 'aho-3-tl-2',
        stage: 'Recipient Confirmation',
        actorName: 'Sarah Chen',
        actorRole: 'Recipient',
        timestamp: '2026-08-21T09:00:00Z',
        action: 'Recipient confirmed receipt — routed to IT Processing queue.',
      },
      {
        id: 'aho-3-tl-3',
        stage: 'IT Processing',
        actorName: 'Alex Rivera',
        actorRole: 'IT Staff',
        timestamp: '2026-08-22T10:20:00Z',
        action: 'Forwarded to IT Supervisor for final approval.',
      },
    ],
  },
  {
    // Rejected at Stage 3 (IT Processing), not Stage 4 -- regression fixture for the
    // GovernanceStep "Rejected" label bug found during live verification (2026-09-02): it used
    // to always attribute the rejection to Stage 4's display regardless of where it actually
    // happened. See pages/HandoverDetail/index.test.tsx.
    id: 'aho-4',
    handoverCode: 'AHO-2026-004',
    status: 'REJECTED',
    createdAt: '2026-08-19T09:00:00Z',
    asset: { id: 'a12', code: 'AST-0012', name: 'ThinkPad X1 Carbon Gen 11', category: 'IT Hardware', type: 'Laptop' },
    recipient: { id: 'e6', name: 'James Wilson', role: 'Finance' },
    initiatedBy: { id: 'e1', name: 'Sarah Chen', role: 'Administrator' },
    initiatedAt: '2026-08-19T09:00:00Z',
    confirmedAt: '2026-08-19T10:00:00Z',
    rejectedBy: { id: 'tech-1', name: 'Alex Rivera', role: 'IT Staff' },
    rejectedAt: '2026-08-19T11:00:00Z',
    rejectionStage: 'IT Processing',
    rejectionReason: 'Device failed pre-issue diagnostics.',
    timeline: [
      {
        id: 'aho-4-tl-1',
        stage: 'Creation',
        actorName: 'Sarah Chen',
        actorRole: 'Administrator',
        timestamp: '2026-08-19T09:00:00Z',
        action: 'Assignment initiated for ThinkPad X1 Carbon Gen 11 (AST-0012) to James Wilson — awaiting recipient confirmation.',
      },
      {
        id: 'aho-4-tl-2',
        stage: 'Recipient Confirmation',
        actorName: 'James Wilson',
        actorRole: 'Recipient',
        timestamp: '2026-08-19T10:00:00Z',
        action: 'Recipient confirmed receipt — routed to IT Processing queue.',
      },
      {
        id: 'aho-4-tl-3',
        stage: 'IT Processing',
        actorName: 'Alex Rivera',
        actorRole: 'IT Staff',
        timestamp: '2026-08-19T11:00:00Z',
        action: 'Rejected -- asset remains Available.',
        notes: 'Device failed pre-issue diagnostics.',
      },
    ],
  },
];
