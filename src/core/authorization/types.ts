import type { PermissionCode } from './permissions';

export interface RouteHandle {
  /** The baseline entry checkpoint required to step into this application workspace */
  routeAccessPermissions?: PermissionCode;
}
