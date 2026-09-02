import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { AssetHandoverModel } from '@/types/handover';

// HttpHandoverRepository is the real implementation backing go-template-main's Handover domain
// (PRs #72-73) -- same mocking approach as ticket-repository.http.test.ts (no
// axios-mock-adapter/msw installed).

const getMock = vi.fn();
const postMock = vi.fn();

vi.mock('@/services/api-client', () => ({
  default: {
    get: (...args: unknown[]) => getMock(...args),
    post: (...args: unknown[]) => postMock(...args),
  },
}));

const sampleHandover: AssetHandoverModel = {
  id: 'aho-1',
  handoverCode: 'AHO-2026-001',
  status: 'PENDING_RECIPIENT_CONFIRMATION',
  createdAt: '2026-08-28T09:15:00Z',
  asset: { id: 'a11', code: 'AST-0011', name: 'MacBook Air M2', category: 'IT Hardware', type: 'Laptop' },
  recipient: { id: 'e3', name: 'Priya Patel' },
  initiatedBy: { id: 'e1', name: 'Sarah Chen', role: 'Administrator' },
  initiatedAt: '2026-08-28T09:15:00Z',
  timeline: [],
};

describe('HttpHandoverRepository', () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
  });

  it('list calls GET /handovers with only the non-empty/non-"ALL" query params', async () => {
    getMock.mockResolvedValueOnce({ data: { data: [sampleHandover], total: 1 } });
    const { HttpHandoverRepository } = await import('@/services/handover-repository');
    const repo = new HttpHandoverRepository();

    const result = await repo.list({ search: 'macbook', status: 'ALL', recipientEmployeeId: 'e3' });

    expect(getMock).toHaveBeenCalledWith('/handovers', { params: { search: 'macbook', recipientEmployeeId: 'e3' } });
    expect(result).toEqual({ data: [sampleHandover], total: 1 });
  });

  it('getByCode calls GET /handovers/:code and returns the handover', async () => {
    getMock.mockResolvedValueOnce({ data: sampleHandover });
    const { HttpHandoverRepository } = await import('@/services/handover-repository');
    const repo = new HttpHandoverRepository();

    const result = await repo.getByCode('AHO-2026-001');

    expect(getMock).toHaveBeenCalledWith('/handovers/AHO-2026-001');
    expect(result).toEqual(sampleHandover);
  });

  it('getByCode returns null on a 404, matching MockHandoverRepository', async () => {
    getMock.mockRejectedValueOnce({ response: { status: 404 } });
    const { HttpHandoverRepository } = await import('@/services/handover-repository');
    const repo = new HttpHandoverRepository();

    const result = await repo.getByCode('does-not-exist');

    expect(result).toBeNull();
  });

  it('initiate calls POST /assets/:id/handover with the recipient input', async () => {
    postMock.mockResolvedValueOnce({ data: sampleHandover });
    const { HttpHandoverRepository } = await import('@/services/handover-repository');
    const repo = new HttpHandoverRepository();

    const result = await repo.initiate(
      'a11',
      { employeeId: 'e3', employeeName: 'Priya Patel' },
      sampleHandover.asset,
      sampleHandover.initiatedBy
    );

    expect(postMock).toHaveBeenCalledWith('/assets/a11/handover', { employeeId: 'e3', employeeName: 'Priya Patel' });
    expect(result).toEqual(sampleHandover);
  });

  it('confirmReceipt calls POST /handovers/:code/confirm with the input body', async () => {
    const updated = { ...sampleHandover, status: 'PENDING_IT_PROCESSING' as const };
    postMock.mockResolvedValueOnce({ data: updated });
    const { HttpHandoverRepository } = await import('@/services/handover-repository');
    const repo = new HttpHandoverRepository();

    const result = await repo.confirmReceipt('AHO-2026-001', { recipientId: 'e3', recipientName: 'Priya Patel' });

    expect(postMock).toHaveBeenCalledWith('/handovers/AHO-2026-001/confirm', { recipientId: 'e3', recipientName: 'Priya Patel' });
    expect(result).toEqual(updated);
  });

  it('process calls POST /handovers/:code/process with the input body', async () => {
    const updated = { ...sampleHandover, status: 'PENDING_IT_SUPERVISOR_APPROVAL' as const };
    postMock.mockResolvedValueOnce({ data: updated });
    const { HttpHandoverRepository } = await import('@/services/handover-repository');
    const repo = new HttpHandoverRepository();

    const result = await repo.process('AHO-2026-001', { actorId: 'tech-1', actorName: 'Alex Rivera' });

    expect(postMock).toHaveBeenCalledWith('/handovers/AHO-2026-001/process', { actorId: 'tech-1', actorName: 'Alex Rivera' });
    expect(result).toEqual(updated);
  });

  it('decide calls POST /handovers/:code/decision with the input body', async () => {
    const updated = { ...sampleHandover, status: 'ASSIGNED' as const };
    postMock.mockResolvedValueOnce({ data: updated });
    const { HttpHandoverRepository } = await import('@/services/handover-repository');
    const repo = new HttpHandoverRepository();

    const result = await repo.decide('AHO-2026-001', { decision: 'APPROVE', actorId: 'mgr-1', actorName: 'Jordan Lee' });

    expect(postMock).toHaveBeenCalledWith('/handovers/AHO-2026-001/decision', { decision: 'APPROVE', actorId: 'mgr-1', actorName: 'Jordan Lee' });
    expect(result).toEqual(updated);
  });
});
