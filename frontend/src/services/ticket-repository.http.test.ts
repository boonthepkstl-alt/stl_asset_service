import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { Ticket } from '@/types/ticket';
import type { ITTechnician } from '@/data/fixtures/requisitionData';

// HttpTicketRepository is the real implementation backing go-template-main's Ticket domain --
// same mocking approach as asset-repository.http.test.ts/employee-repository.http.test.ts (no
// axios-mock-adapter/msw installed).

const getMock = vi.fn();
const postMock = vi.fn();

vi.mock('@/services/api-client', () => ({
  default: {
    get: (...args: unknown[]) => getMock(...args),
    post: (...args: unknown[]) => postMock(...args),
  },
}));

const sampleTicket: Ticket = {
  id: 'req-1',
  ticketCode: 'ITR-2026-001',
  title: "Laptop won't power on",
  category: 'Hardware Fault & Repair',
  priority: 'High',
  slaTargetHours: 8,
  description: 'User requested inspection and servicing.',
  location: 'HQ',
  createdAt: 'Just now',
  status: 'PENDING_DEPT_APPROVAL',
  requester: {
    id: 'e1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    jobTitle: 'Staff Specialist',
    department: 'Engineering',
    initials: 'SC',
    avatarColor: 'bg-brand-500',
  },
  asset: {
    id: 'a1',
    code: 'AST-0001',
    name: 'MacBook Pro 16"',
    type: 'Laptop',
    serialNumber: 'SN-0001',
    location: 'HQ',
    isMyAssignedAsset: true,
    purchaseCost: 2500,
    currentValue: 1800,
  },
  departmentApproval: {
    status: 'Pending',
    approverName: 'Department Lead',
    approverTitle: 'Department Head',
    isDelegated: false,
  },
  itAssignment: {},
  itExecution: { currentStatus: 'Pending Dispatch' },
  timeline: [
    {
      id: 't-1',
      stage: 'Creation',
      actorName: 'Sarah Chen',
      actorRole: 'Requester (Staff Specialist)',
      timestamp: 'Just now',
      action: 'Requisition submitted and routed to department head for review.',
    },
  ],
};

const sampleTechnician: ITTechnician = {
  id: 'tech-1',
  name: 'Alex Rivera',
  role: 'Lead Hardware Specialist',
  specialty: 'Apple Certified',
  avatarColor: 'bg-indigo-500',
  initials: 'AR',
  activeTicketsCount: 2,
  completedThisMonth: 5,
};

describe('HttpTicketRepository', () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
  });

  it('list calls GET /tickets with only the non-empty/non-"ALL" query params', async () => {
    getMock.mockResolvedValueOnce({ data: { data: [sampleTicket], total: 1 } });
    const { HttpTicketRepository } = await import('@/services/ticket-repository');
    const repo = new HttpTicketRepository();

    const result = await repo.list({ search: 'laptop', status: 'ALL', priority: 'High', category: 'ALL', department: 'ALL' });

    expect(getMock).toHaveBeenCalledWith('/tickets', { params: { search: 'laptop', priority: 'High' } });
    expect(result).toEqual({ data: [sampleTicket], total: 1 });
  });

  it('getByCode calls GET /tickets/:code and returns the ticket', async () => {
    getMock.mockResolvedValueOnce({ data: sampleTicket });
    const { HttpTicketRepository } = await import('@/services/ticket-repository');
    const repo = new HttpTicketRepository();

    const result = await repo.getByCode('ITR-2026-001');

    expect(getMock).toHaveBeenCalledWith('/tickets/ITR-2026-001');
    expect(result).toEqual(sampleTicket);
  });

  it('getByCode returns null on a 404, matching MockTicketRepository', async () => {
    getMock.mockRejectedValueOnce({ response: { status: 404 } });
    const { HttpTicketRepository } = await import('@/services/ticket-repository');
    const repo = new HttpTicketRepository();

    const result = await repo.getByCode('does-not-exist');

    expect(result).toBeNull();
  });

  it('create calls POST /tickets with the requester/asset ids extracted from the ticket', async () => {
    postMock.mockResolvedValueOnce({ data: sampleTicket });
    const { HttpTicketRepository } = await import('@/services/ticket-repository');
    const repo = new HttpTicketRepository();

    const result = await repo.create(sampleTicket);

    expect(postMock).toHaveBeenCalledWith('/tickets', {
      requesterId: 'e1',
      assetId: 'a1',
      category: 'Hardware Fault & Repair',
      priority: 'High',
      title: "Laptop won't power on",
      description: 'User requested inspection and servicing.',
      location: 'HQ',
    });
    expect(result).toEqual(sampleTicket);
  });

  it('decideApproval calls POST /tickets/:id/approval with the input body', async () => {
    const updated = { ...sampleTicket, status: 'PENDING_IT_DISPATCH' as const };
    postMock.mockResolvedValueOnce({ data: updated });
    const { HttpTicketRepository } = await import('@/services/ticket-repository');
    const repo = new HttpTicketRepository();

    const result = await repo.decideApproval('req-1', { decision: 'Approve' });

    expect(postMock).toHaveBeenCalledWith('/tickets/req-1/approval', { decision: 'Approve' });
    expect(result).toEqual(updated);
  });

  it('dispatch calls POST /tickets/:id/dispatch with the input body', async () => {
    const updated = { ...sampleTicket, status: 'IN_PROGRESS' as const };
    postMock.mockResolvedValueOnce({ data: updated });
    const { HttpTicketRepository } = await import('@/services/ticket-repository');
    const repo = new HttpTicketRepository();

    const result = await repo.dispatch('req-1', { technicianId: 'tech-1' }, sampleTechnician);

    expect(postMock).toHaveBeenCalledWith('/tickets/req-1/dispatch', { technicianId: 'tech-1' });
    expect(result).toEqual(updated);
  });

  it('updateExecutionStatus calls POST /tickets/:id/status with the input body', async () => {
    const updated = { ...sampleTicket, status: 'DONE' as const };
    postMock.mockResolvedValueOnce({ data: updated });
    const { HttpTicketRepository } = await import('@/services/ticket-repository');
    const repo = new HttpTicketRepository();

    const result = await repo.updateExecutionStatus('req-1', { status: 'Done' });

    expect(postMock).toHaveBeenCalledWith('/tickets/req-1/status', { status: 'Done' });
    expect(result).toEqual(updated);
  });

  it('listTechnicians calls GET /technicians', async () => {
    getMock.mockResolvedValueOnce({ data: [sampleTechnician] });
    const { HttpTicketRepository } = await import('@/services/ticket-repository');
    const repo = new HttpTicketRepository();

    const result = await repo.listTechnicians();

    expect(getMock).toHaveBeenCalledWith('/technicians');
    expect(result).toEqual([sampleTechnician]);
  });

  it('changeAsset and changeRequester throw, matching backend scope (not implemented server-side)', async () => {
    const { HttpTicketRepository } = await import('@/services/ticket-repository');
    const repo = new HttpTicketRepository();

    await expect(repo.changeAsset('req-1', sampleTicket.asset)).rejects.toThrow();
    await expect(repo.changeRequester('req-1', sampleTicket.requester)).rejects.toThrow();
  });
});
