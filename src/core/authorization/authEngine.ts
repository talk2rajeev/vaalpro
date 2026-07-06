import { MODULES } from './modules';
import type { ModuleName } from './modules';
import type { PermissionCode } from './permissions';

interface AuthPermission {
  permission_code?: string | null;
}

interface AuthStateContext {
  permissions: AuthPermission[];
  subscribedApps: string[];
  userType: string;
}

const moduleMap: Record<ModuleName, string> = {
  [MODULES.PORTAL]: 'PORTAL',
  [MODULES.CAALDOC]: 'CAALDOC',
  [MODULES.VAALDOC]: 'VAALDOC',
  [MODULES.OVERALL]: 'OVERALL',
};

export const createAuthEngine = (context: AuthStateContext) => {
  const { permissions, subscribedApps, userType } = context;

  return {
    /** High-level license verification (Subscription Boundary) */
    hasModuleAccess(moduleName: ModuleName): boolean {
      if (subscribedApps.includes('OVERALL') || userType === 'PLATFORM_ADMIN') {
        return true;
      }

      if (moduleName === MODULES.PORTAL) {
        return subscribedApps.includes('CAALDOC') || subscribedApps.includes('VAALDOC');
      }

      return subscribedApps.includes(moduleMap[moduleName]);
    },

    /** Perimeter validation for workspace environments (Workspace Entry Check) */
    canAccessWorkspace(routeAccessPermissions?: PermissionCode): boolean {
      if (!routeAccessPermissions) return true;
      return permissions.some(p => p.permission_code === routeAccessPermissions);
    },

    /** Atomic feature capability evaluation */
    canPerformAction(actionPermission: PermissionCode): boolean {
      return permissions.some(p => p.permission_code === actionPermission);
    },
  };
};
