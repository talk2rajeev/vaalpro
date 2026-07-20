import { Outlet, Navigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Loader2 } from 'lucide-react';
import { ROUTES } from '@/core/routes/paths';
import { useAuthSessionManager } from '@/features/auth/hooks/useAuthSessionManager';
import { usePermissionLoader } from '@/features/auth/hooks/usePermissionLoader';
import { useRoleRedirect } from '@/features/auth/hooks/useRoleRedirect';

// ---------------------------------------------------------------------------
// RequireAuth
// ---------------------------------------------------------------------------

/**
 * Route boundary that coordinates the auth hooks and renders protected content.
 *
 * Session restore/refresh, permission loading, and role-based redirects are
 * intentionally split into feature hooks so each concern can evolve separately.
 */
const RequireAuth = () => {
  const location = useLocation();
  const { accessToken, userId, realmRoles, exp, isAuthChecked, isPermissionsLoaded } = useSelector(
    (state: RootState) => state.auth
  );
  const { isRefreshing } = useAuthSessionManager({ accessToken, exp, isAuthChecked });

  usePermissionLoader(userId);
  useRoleRedirect({ accessToken, realmRoles });

  // ------------------------------------------------------------------
  // UI States
  // ------------------------------------------------------------------

  // Still waiting for the refresh call or permissions to load
  const isInitialising = !accessToken && !isAuthChecked;
  const isLoadingPermissions = !!userId && !isPermissionsLoaded;

  if (isRefreshing || isInitialising || isLoadingPermissions) {
    return <div className="flex items-center justify-center h-screen w-screen">
      <div className='bg-slate-50 rounded-xl shadow-md border border-slate-200 p-8 flex flex-col gap-4 items-center justify-center'>
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin w-8 h-8 text-slate-600" />
          <span className="text-slate-600">Loading...</span>
        </div>
      </div>
    </div>;
  }

  // Session couldn't be restored. Remember where the user was headed so we can return them there after successful login.
  if (!accessToken && isAuthChecked) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
