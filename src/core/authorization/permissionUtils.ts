import type { PermissionCode } from './permissions';

interface UserPermissionObj {
  permission_code?: string | null;
}

/**
 * Checks if a user possesses a specific permission.
 */
export const hasPermission = (
  userPermissions: UserPermissionObj[],
  requiredPermission: PermissionCode
): boolean => {
  return userPermissions.some(p => p.permission_code === requiredPermission);
};

/**
 * Checks if a user has AT LEAST ONE of the listed permissions.
 */
export const hasAnyPermission = (
  userPermissions: UserPermissionObj[],
  permissionCodes: PermissionCode[]
): boolean => {
  if (permissionCodes.length === 0) return true;
  return permissionCodes.some(permissionCode => hasPermission(userPermissions, permissionCode));
};

/**
 * Checks if a user possesses ALL of the listed permissions.
 */
export const hasAllPermissions = (
  userPermissions: UserPermissionObj[],
  permissionCodes: PermissionCode[]
): boolean => {
  return permissionCodes.every(permissionCode => hasPermission(userPermissions, permissionCode));
};
