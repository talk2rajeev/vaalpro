import { ROUTES } from '@/core/routes/paths';

export type MvpUserType = 'PLATFORM_ADMIN' | 'CUSTOMER_USER' | 'VENDOR_USER';

export const getUserTypeFromRealmRoles = (realmRoles: string[]): MvpUserType => {
  if (realmRoles.includes('PLATFORM_ADMIN')) {
    return 'PLATFORM_ADMIN';
  }

  if (realmRoles.includes('CUSTOMER_USER')) {
    return 'CUSTOMER_USER';
  }

  return 'VENDOR_USER';
};

export const getDefaultRouteFromRealmRoles = (realmRoles: string[]) => {
  return getUserTypeFromRealmRoles(realmRoles) === 'PLATFORM_ADMIN'
    ? ROUTES.systemAdmin.root
    : ROUTES.caaldoc.dashboard;
};
