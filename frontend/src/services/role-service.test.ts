import { beforeEach, describe, expect, it } from 'vitest';
import { vi } from 'vitest';

async function freshRoleService() {
  vi.resetModules();
  const mod = await import('@/services/role-service');
  return mod.roleService;
}

describe('roleService', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('updatePermissions persists a module permission matrix that listRoles then reflects', async () => {
    const roleService = await freshRoleService();
    const before = await roleService.listRoles();
    const assetManager = before.data.find((r) => r.name === 'Asset Manager');
    expect(assetManager).toBeDefined();
    expect(assetManager?.modulePermissions).toBeUndefined();

    const updated = await roleService.updatePermissions(assetManager!.id, {
      Assets: ['View', 'Create', 'Edit', 'Approve'],
      Reports: ['View'],
    });
    expect(updated.modulePermissions?.Assets).toEqual(['View', 'Create', 'Edit', 'Approve']);
    expect(updated.permissions).toBe(5);

    const reread = await roleService.getRole(assetManager!.id);
    expect(reread?.modulePermissions?.Reports).toEqual(['View']);
  });

  it('updatePermissions rejects changes to a system role', async () => {
    const roleService = await freshRoleService();
    const roles = await roleService.listRoles();
    const systemRole = roles.data.find((r) => r.system);
    expect(systemRole).toBeDefined();

    await expect(roleService.updatePermissions(systemRole!.id, { Dashboard: ['View'] })).rejects.toThrow(
      'system role',
    );
  });
});
