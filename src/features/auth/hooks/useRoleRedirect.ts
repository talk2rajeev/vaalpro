import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from '@/core/routes/paths';
import { getDefaultRouteFromRealmRoles } from '@/features/auth/roleRouting';

interface UseRoleRedirectParams {
  accessToken: string | null;
  realmRoles: string[];
}

/**
 * Keeps users inside the route area allowed by their MVP role.
 *
 * Platform admins are kept in the system-admin area, while vendor and customer
 * users are redirected away from system-admin into the caaldoc dashboard.
 */
export const useRoleRedirect = ({ accessToken, realmRoles }: UseRoleRedirectParams) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken || !realmRoles.length) return;

    const isAccessingAdminZone = location.pathname.startsWith(ROUTES.systemAdmin.root);
    const defaultRoute = getDefaultRouteFromRealmRoles(realmRoles);
    const isPlatformAdmin = realmRoles.includes('PLATFORM_ADMIN');
    const isCustomerOrVendor = realmRoles.includes('CUSTOMER_USER') || realmRoles.includes('VENDOR_USER');

    if (isPlatformAdmin && !isAccessingAdminZone) {
      navigate(defaultRoute, { replace: true });
      return;
    }

    if (isCustomerOrVendor && isAccessingAdminZone) {
      navigate(defaultRoute, { replace: true });
    }
  }, [accessToken, realmRoles, location.pathname, navigate]);
};
