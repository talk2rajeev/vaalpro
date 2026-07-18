import { useMatches, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { RouteHandle } from '@/core/authorization/types';
import { createAuthEngine } from '@/core/authorization/authEngine';
import UnauthorizedAlert from '@/apps/shared/components/UnauthorizedAlert';

export const RouteGuard = () => {
  const matches = useMatches();
  const authState = useSelector((state: RootState) => state.auth);

  const engine = createAuthEngine({
    permissions: authState.permissions ?? [],
  });

  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch?.handle as RouteHandle | undefined;

  if (handle?.routeAccessPermissions && !engine.canAccessWorkspace(handle.routeAccessPermissions)) {
    return (
      <div className="w-full h-full p-6 flex items-center justify-center">
        <UnauthorizedAlert
          title="Access Denied"
          description="Your user profile is not cleared for entry into this operational workspace."
        />
      </div>
    );
  }

  return <Outlet />;
};

export default RouteGuard;
