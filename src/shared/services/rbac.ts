import { cache } from 'react';
import { and, eq, gt, inArray, isNull, or } from 'drizzle-orm';

import { db } from '@/core/db';
import { permission, role, rolePermission, userRole } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';
import { getAllConfigs } from '@/shared/models/config';
import { User } from '@/shared/models/user';

// Types
export type Role = typeof role.$inferSelect;
export type Permission = typeof permission.$inferSelect;
export type RolePermission = typeof rolePermission.$inferSelect;
export type UserRole = typeof userRole.$inferSelect;

export type NewRole = typeof role.$inferInsert;
export type NewPermission = typeof permission.$inferInsert;
export type NewRolePermission = typeof rolePermission.$inferInsert;
export type NewUserRole = typeof userRole.$inferInsert;

export type UpdateRole = Partial<Omit<Role, 'id' | 'createdAt'>>;
export type UpdatePermission = Partial<Omit<Permission, 'id' | 'createdAt'>>;
export type UpdateRolePermission = Partial<
  Omit<RolePermission, 'id' | 'createdAt'>
>;
export type UpdateUserRole = Partial<Omit<UserRole, 'id' | 'createdAt'>>;

// Role constants
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

export enum RoleStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  DELETED = 'deleted',
}

/**
 * Get all roles
 */
export async function getRoles(): Promise<Role[]> {
  return await db()
    .select()
    .from(role)
    .where(eq(role.status, RoleStatus.ACTIVE));
}

/**
 * Get role by ID
 */
export async function getRoleById(roleId: string): Promise<Role | undefined> {
  const [result] = await db().select().from(role).where(eq(role.id, roleId));
  return result;
}

/**
 * Get role by name
 */
export async function getRoleByName(name: string): Promise<Role | undefined> {
  const [result] = await db().select().from(role).where(eq(role.name, name));
  return result;
}

/**
 * Create a new role
 */
export async function createRole(newRole: NewRole): Promise<Role> {
  const [result] = await db().insert(role).values(newRole).returning();
  return result;
}

/**
 * Update a role
 */
export async function updateRole(
  roleId: string,
  updates: UpdateRole
): Promise<Role> {
  const [result] = await db()
    .update(role)
    .set(updates)
    .where(eq(role.id, roleId))
    .returning();
  return result;
}

/**
 * Delete a role
 */
export async function deleteRole(roleId: string): Promise<void> {
  await db().delete(role).where(eq(role.id, roleId));
}

/**
 * Get all permissions
 */
export async function getPermissions(): Promise<Permission[]> {
  return await db().select().from(permission);
}

/**
 * Get permission by code
 */
export async function getPermissionByCode(
  code: string
): Promise<Permission | undefined> {
  const [result] = await db()
    .select()
    .from(permission)
    .where(eq(permission.code, code));
  return result;
}

/**
 * Create a new permission
 */
export async function createPermission(
  newPermission: NewPermission
): Promise<Permission> {
  const [result] = await db()
    .insert(permission)
    .values(newPermission)
    .returning();
  return result;
}

/**
 * Get permissions for a role
 */
export async function getRolePermissions(
  roleId: string
): Promise<Permission[]> {
  const result = await db()
    .select({
      id: permission.id,
      code: permission.code,
      resource: permission.resource,
      action: permission.action,
      title: permission.title,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    })
    .from(rolePermission)
    .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
    .where(eq(rolePermission.roleId, roleId));

  return result;
}

/**
 * Assign permission to role
 */
export async function assignPermissionToRole(
  roleId: string,
  permissionId: string
): Promise<RolePermission> {
  const [result] = await db()
    .insert(rolePermission)
    .values({
      id: getUuid(),
      roleId,
      permissionId,
    })
    .returning();
  return result;
}

/**
 * Remove permission from role
 */
export async function removePermissionFromRole(
  roleId: string,
  permissionId: string
): Promise<void> {
  await db()
    .delete(rolePermission)
    .where(
      and(
        eq(rolePermission.roleId, roleId),
        eq(rolePermission.permissionId, permissionId)
      )
    );
}

/**
 * Batch assign permissions to role
 */
export async function assignPermissionsToRole(
  roleId: string,
  permissionIds: string[]
): Promise<void> {
  // First, remove all existing permissions
  await db().delete(rolePermission).where(eq(rolePermission.roleId, roleId));

  // Then, add new permissions
  if (permissionIds.length > 0) {
    await db()
      .insert(rolePermission)
      .values(
        permissionIds.map((permissionId) => ({
          id: getUuid(),
          roleId,
          permissionId,
        }))
      );
  }
}

/**
 * Get user's roles
 */
export const getUserRoles = cache(async (userId: string): Promise<Role[]> => {
  const now = new Date();
  const result = await db()
    .select({
      id: role.id,
      name: role.name,
      title: role.title,
      description: role.description,
      status: role.status,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      sort: role.sort,
    })
    .from(userRole)
    .innerJoin(role, eq(userRole.roleId, role.id))
    .where(
      and(
        eq(userRole.userId, userId),
        eq(role.status, RoleStatus.ACTIVE),
        // Check if role is not expired
        // Either expiresAt is null or expiresAt > now
        or(isNull(userRole.expiresAt), gt(userRole.expiresAt, now))
      )
    );

  return result;
});

/**
 * Get user's permissions (through roles)
 */
export const getUserPermissions = cache(
  async (userId: string): Promise<Permission[]> => {
    const roles = await getUserRoles(userId);
    if (roles.length === 0) return [];

    const roleIds = roles.map((r) => r.id);

    const result = await db()
      .selectDistinct({
        id: permission.id,
        code: permission.code,
        resource: permission.resource,
        action: permission.action,
        title: permission.title,
        description: permission.description,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      })
      .from(rolePermission)
      .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
      .where(inArray(rolePermission.roleId, roleIds));

    return result;
  }
);

/**
 * Check if user has a specific permission
 * Supports wildcard matching (e.g., "admin.*", "admin.posts.*")
 */
export const hasPermission = cache(
  async (userId: string, permissionCode: string): Promise<boolean> => {
    const permissions = await getUserPermissions(userId);
    const permissionCodes = permissions.map((p) => p.code);

    // Check exact match
    if (permissionCodes.includes(permissionCode)) {
      return true;
    }

    // Check wildcard match
    // If user has "admin.*", they have all "admin.xxx" permissions
    const parts = permissionCode.split('.');
    for (let i = parts.length - 1; i > 0; i--) {
      const wildcard = parts.slice(0, i).join('.') + '.*';
      if (permissionCodes.includes(wildcard)) {
        return true;
      }
    }

    // Check if user has "*" (super admin)
    if (permissionCodes.includes('*')) {
      return true;
    }

    return false;
  }
);

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(
  userId: string,
  permissionCodes: string[]
): Promise<boolean> {
  for (const code of permissionCodes) {
    if (await hasPermission(userId, code)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if user has all of the specified permissions
 */
export async function hasAllPermissions(
  userId: string,
  permissionCodes: string[]
): Promise<boolean> {
  for (const code of permissionCodes) {
    if (!(await hasPermission(userId, code))) {
      return false;
    }
  }
  return true;
}

/**
 * Check if user has a specific role
 */
export const hasRole = cache(
  async (userId: string, roleName: string): Promise<boolean> => {
    const roles = await getUserRoles(userId);
    return roles.some((r) => r.name === roleName);
  }
);

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(
  userId: string,
  roleNames: string[]
): Promise<boolean> {
  const roles = await getUserRoles(userId);
  const userRoleNames = roles.map((r) => r.name);
  return roleNames.some((name) => userRoleNames.includes(name));
}

/**
 * Assign role to user
 */
export async function assignRoleToUser(
  userId: string,
  roleId: string,
  updatedAt?: Date
): Promise<UserRole> {
  const [result] = await db()
    .insert(userRole)
    .values({
      id: getUuid(),
      userId,
      roleId,
      updatedAt,
    })
    .returning();
  return result;
}

/**
 * Remove role from user
 */
export async function removeRoleFromUser(
  userId: string,
  roleId: string
): Promise<void> {
  await db()
    .delete(userRole)
    .where(and(eq(userRole.userId, userId), eq(userRole.roleId, roleId)));
}

/**
 * Batch assign roles to user
 */
export async function assignRolesToUser(
  userId: string,
  roleIds: string[]
): Promise<void> {
  await db().transaction(async (tx: any) => {
    await tx.delete(userRole).where(eq(userRole.userId, userId));

    if (roleIds.length > 0) {
      await tx.insert(userRole).values(
        roleIds.map((roleId) => ({
          id: getUuid(),
          userId,
          roleId,
        }))
      );
    }
  });
}

/**
 * Get users by role
 */
export async function getUsersByRole(roleId: string): Promise<string[]> {
  const result = await db()
    .select({ userId: userRole.userId })
    .from(userRole)
    .where(eq(userRole.roleId, roleId));

  return result.map((r: any) => r.userId);
}

/**
 * RBAC 表为空时自动初始化默认角色和权限。
 * 仅在首次需要时执行一次，后续调用会检测到数据已存在直接跳过。
 */
async function ensureRbacSeeded(): Promise<void> {
  const existing = await getRoles();
  if (existing.length > 0) return;

  console.log('[RBAC] tables empty, auto-seeding default roles & permissions...');

  const defaultPermissions = [
    { code: 'admin.access', resource: 'admin', action: 'access', title: 'Admin Access', description: 'Access to admin area' },
    { code: 'admin.users.read', resource: 'users', action: 'read', title: 'Read Users', description: 'View user list and details' },
    { code: 'admin.users.write', resource: 'users', action: 'write', title: 'Write Users', description: 'Create and update users' },
    { code: 'admin.users.delete', resource: 'users', action: 'delete', title: 'Delete Users', description: 'Delete users' },
    { code: 'admin.posts.read', resource: 'posts', action: 'read', title: 'Read Posts', description: 'View post list and details' },
    { code: 'admin.posts.write', resource: 'posts', action: 'write', title: 'Write Posts', description: 'Create and update posts' },
    { code: 'admin.posts.delete', resource: 'posts', action: 'delete', title: 'Delete Posts', description: 'Delete posts' },
    { code: 'admin.categories.read', resource: 'categories', action: 'read', title: 'Read Categories', description: 'View categories' },
    { code: 'admin.categories.write', resource: 'categories', action: 'write', title: 'Write Categories', description: 'Create and update categories' },
    { code: 'admin.categories.delete', resource: 'categories', action: 'delete', title: 'Delete Categories', description: 'Delete categories' },
    { code: 'admin.payments.read', resource: 'payments', action: 'read', title: 'Read Payments', description: 'View payments' },
    { code: 'admin.subscriptions.read', resource: 'subscriptions', action: 'read', title: 'Read Subscriptions', description: 'View subscriptions' },
    { code: 'admin.credits.read', resource: 'credits', action: 'read', title: 'Read Credits', description: 'View credits' },
    { code: 'admin.credits.write', resource: 'credits', action: 'write', title: 'Write Credits', description: 'Grant or consume credits' },
    { code: 'admin.apikeys.read', resource: 'apikeys', action: 'read', title: 'Read API Keys', description: 'View API keys' },
    { code: 'admin.apikeys.write', resource: 'apikeys', action: 'write', title: 'Write API Keys', description: 'Create and update API keys' },
    { code: 'admin.apikeys.delete', resource: 'apikeys', action: 'delete', title: 'Delete API Keys', description: 'Delete API keys' },
    { code: 'admin.settings.read', resource: 'settings', action: 'read', title: 'Read Settings', description: 'View system settings' },
    { code: 'admin.settings.write', resource: 'settings', action: 'write', title: 'Write Settings', description: 'Update system settings' },
    { code: 'admin.roles.read', resource: 'roles', action: 'read', title: 'Read Roles', description: 'View roles' },
    { code: 'admin.roles.write', resource: 'roles', action: 'write', title: 'Write Roles', description: 'Create and update roles' },
    { code: 'admin.roles.delete', resource: 'roles', action: 'delete', title: 'Delete Roles', description: 'Delete roles' },
    { code: 'admin.permissions.read', resource: 'permissions', action: 'read', title: 'Read Permissions', description: 'View permissions' },
    { code: 'admin.permissions.write', resource: 'permissions', action: 'write', title: 'Write Permissions', description: 'Create and update permissions' },
    { code: 'admin.permissions.delete', resource: 'permissions', action: 'delete', title: 'Delete Permissions', description: 'Delete permissions' },
    { code: 'admin.ai-tasks.read', resource: 'ai-tasks', action: 'read', title: 'Read AI Tasks', description: 'View AI tasks' },
    { code: 'admin.ai-tasks.write', resource: 'ai-tasks', action: 'write', title: 'Write AI Tasks', description: 'Create and update AI tasks' },
    { code: 'admin.ai-tasks.delete', resource: 'ai-tasks', action: 'delete', title: 'Delete AI Tasks', description: 'Delete AI tasks' },
    { code: 'admin.tutorials.read', resource: 'tutorials', action: 'read', title: 'Read Tutorials', description: 'View tutorials' },
    { code: 'admin.tutorials.write', resource: 'tutorials', action: 'write', title: 'Write Tutorials', description: 'Create and update tutorials' },
    { code: 'admin.tutorials.delete', resource: 'tutorials', action: 'delete', title: 'Delete Tutorials', description: 'Delete tutorials' },
    { code: '*', resource: 'all', action: 'all', title: 'Super Admin', description: 'All permissions (super admin only)' },
  ];

  const permIdMap: Record<string, string> = {};
  for (const p of defaultPermissions) {
    const id = getUuid();
    await db().insert(permission).values({ id, ...p });
    permIdMap[p.code] = id;
  }

  const roleDefs = [
    { name: 'super_admin', title: 'Super Admin', description: 'Full system access', status: 'active', sort: 1, perms: ['*'] },
    { name: 'admin', title: 'Admin', description: 'Administrator', status: 'active', sort: 2, perms: Object.keys(permIdMap).filter(c => c.startsWith('admin.')) },
    { name: 'editor', title: 'Editor', description: 'Content editor', status: 'active', sort: 3, perms: ['admin.access', 'admin.posts.read', 'admin.posts.write', 'admin.categories.read', 'admin.categories.write', 'admin.tutorials.read', 'admin.tutorials.write'] },
    { name: 'viewer', title: 'Viewer', description: 'Read-only access', status: 'active', sort: 4, perms: ['admin.access', 'admin.users.read', 'admin.posts.read', 'admin.categories.read', 'admin.payments.read', 'admin.subscriptions.read', 'admin.credits.read'] },
  ];

  for (const rd of roleDefs) {
    const roleId = getUuid();
    await createRole({ id: roleId, name: rd.name, title: rd.title, description: rd.description, status: rd.status, sort: rd.sort });
    for (const pc of rd.perms) {
      const pid = permIdMap[pc];
      if (pid) {
        await db().insert(rolePermission).values({ id: getUuid(), roleId, permissionId: pid });
      }
    }
  }

  console.log('[RBAC] seeded: 4 roles, ' + defaultPermissions.length + ' permissions');
}

/**
 * 若 ADMIN_EMAIL 环境变量匹配当前用户邮箱，自动授予 super_admin 角色。
 * RBAC 表为空时会自动初始化。
 */
export async function autoGrantSuperAdmin(user: User) {
  try {
    const { envConfigs } = await import('@/config');
    const adminEmail = envConfigs.admin_email?.trim().toLowerCase();
    if (!adminEmail || adminEmail !== user.email?.toLowerCase()) {
      return;
    }

    await ensureRbacSeeded();

    const superAdminRole = await getRoleByName(ROLES.SUPER_ADMIN);
    if (!superAdminRole) {
      console.error('[RBAC] super_admin role not found even after seeding');
      return;
    }

    const alreadyHas = await hasRole(user.id, ROLES.SUPER_ADMIN);
    if (alreadyHas) {
      return;
    }

    await assignRoleToUser(user.id, superAdminRole.id);
    console.log(`[RBAC] auto-granted super_admin to ${user.email}`);
  } catch (e) {
    console.error('[RBAC] auto-grant super_admin failed', e);
  }
}

export async function grantRoleForNewUser(user: User) {
  try {
    // get configs from db
    const configs = await getAllConfigs();

    // initial role not enabled
    if (configs.initial_role_enabled !== 'true') {
      return;
    }

    const roleName = configs.initial_role_name;

    // initial role name not set
    if (!roleName) {
      return;
    }

    const role = await getRoleByName(roleName);

    // initial role not found
    if (!role) {
      return;
    }

    await assignRoleToUser(user.id, role.id, user.createdAt);
  } catch (e) {
    console.error('grant role for new user failed', e);
  }
}
