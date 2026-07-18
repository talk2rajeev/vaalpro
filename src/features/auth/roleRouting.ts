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
    ? '/system-admin'
    : '/caaldoc/dashboard';
};
