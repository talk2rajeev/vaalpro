import type { PermissionCode } from './permissions';
import type { ModuleName } from './modules';

export interface RouteHandle {
  /** The baseline entry checkpoint required to step into this application workspace */
  routeAccessPermissions?: PermissionCode;
  /** The product/licensing module boundary this route belongs to */
  requiredModule?: ModuleName;
}
