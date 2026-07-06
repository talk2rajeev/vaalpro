import { useMatches, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { RouteHandle } from '@/core/authorization/types';
import { createAuthEngine } from '@/core/authorization/authEngine';
import UnauthorizedAlert from '@/apps/shared/components/UnauthorizedAlert';

export const ModuleGuard = () => {
  const matches = useMatches();
  const authState = useSelector((state: RootState) => state.auth);

  const engine = createAuthEngine({
    permissions: authState.permissions ?? [],
    subscribedApps: authState.moduleData?.subscribed_apps ?? [],
    userType: authState.moduleData?.userType ?? 'USER',
  });

  for (const match of matches) {
    const handle = match.handle as RouteHandle | undefined;

    if (handle?.requiredModule && !engine.hasModuleAccess(handle.requiredModule)) {
      return (
        <div className="flex flex-col min-h-screen w-full p-6">
          <UnauthorizedAlert
            title="Subscription Required"
            description="Your tenant profile does not possess an active license subscription for this product module."
          />
        </div>
      );
    }
  }

  return <Outlet />;
};
export default ModuleGuard;
