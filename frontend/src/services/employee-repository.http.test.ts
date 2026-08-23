import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { Employee } from '@/types/employee';

// HttpEmployeeRepository is the real implementation backing go-template-main's Employee
// domain -- same mocking approach as asset-repository.http.test.ts (no axios-mock-adapter/msw
// installed).

const getMock = vi.fn();
const postMock = vi.fn();
const putMock = vi.fn();

vi.mock('@/services/api-client', () => ({
  default: {
    get: (...args: unknown[]) => getMock(...args),
    post: (...args: unknown[]) => postMock(...args),
    put: (...args: unknown[]) => putMock(...args),
  },
}));

const sampleEmployee: Employee = {
  id: 'e1',
  employeeCode: 'EMP-0001',
  name: 'Sarah Chen',
  email: 'sarah.chen@example.com',
  phone: '+1 (555) 000-0000',
  jobTitle: 'Staff Specialist',
  title: 'Staff Specialist',
  department: 'Engineering',
  departmentId: 'DEPT-ENG',
  location: 'HQ',
  deskLocation: 'Open Desk',
  manager: '',
  managerId: '',
  status: 'Active',
  avatarColor: 'bg-brand-500',
  initials: 'SC',
  startDate: '2026-01-15',
  workstationType: 'Standard Corporate Workstation',
  primaryOs: 'macOS & Windows 11',
  assignedCount: 0,
};

describe('HttpEmployeeRepository', () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
    putMock.mockReset();
  });

  it('list calls GET /employees with only the non-empty/non-"ALL" query params', async () => {
    getMock.mockResolvedValueOnce({ data: { data: [sampleEmployee], total: 1 } });
    const { HttpEmployeeRepository } = await import('@/services/employee-repository');
    const repo = new HttpEmployeeRepository();

    const result = await repo.list({ search: 'Sarah', department: 'ALL', location: 'ALL', status: 'Active' });

    expect(getMock).toHaveBeenCalledWith('/employees', { params: { search: 'Sarah', status: 'Active' } });
    expect(result).toEqual({ data: [sampleEmployee], total: 1 });
  });

  it('getById calls GET /employees/:id and returns the employee', async () => {
    getMock.mockResolvedValueOnce({ data: sampleEmployee });
    const { HttpEmployeeRepository } = await import('@/services/employee-repository');
    const repo = new HttpEmployeeRepository();

    const result = await repo.getById('EMP-0001');

    expect(getMock).toHaveBeenCalledWith('/employees/EMP-0001');
    expect(result).toEqual(sampleEmployee);
  });

  it('getById returns null on a 404, matching MockEmployeeRepository', async () => {
    getMock.mockRejectedValueOnce({ response: { status: 404 } });
    const { HttpEmployeeRepository } = await import('@/services/employee-repository');
    const repo = new HttpEmployeeRepository();

    const result = await repo.getById('does-not-exist');

    expect(result).toBeNull();
  });

  it('create calls POST /employees with the input body', async () => {
    postMock.mockResolvedValueOnce({ data: sampleEmployee });
    const { HttpEmployeeRepository } = await import('@/services/employee-repository');
    const repo = new HttpEmployeeRepository();

    const input = { name: 'Sarah Chen', email: 'sarah.chen@example.com', department: 'Engineering', location: 'HQ' };
    const result = await repo.create(input);

    expect(postMock).toHaveBeenCalledWith('/employees', input);
    expect(result).toEqual(sampleEmployee);
  });

  it('update calls PUT /employees/:id with the input body', async () => {
    const updated = { ...sampleEmployee, department: 'Marketing' };
    putMock.mockResolvedValueOnce({ data: updated });
    const { HttpEmployeeRepository } = await import('@/services/employee-repository');
    const repo = new HttpEmployeeRepository();

    const result = await repo.update('e1', { department: 'Marketing' });

    expect(putMock).toHaveBeenCalledWith('/employees/e1', { department: 'Marketing' });
    expect(result).toEqual(updated);
  });
});
