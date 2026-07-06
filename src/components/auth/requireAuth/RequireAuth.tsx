import { useEffect, useRef } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useRefreshMutation, useGetUserPermissionsQuery, useGetModuleQuery } from '@/features/auth/authApi';
import { setCredentials, setPermissions, setModuleData, logout } from '@/features/auth/authSlice';
import { Loader2 } from 'lucide-react';
import { decodeJwtPayload } from '@/utils/jwt';

// ---------------------------------------------------------------------------
// RequireAuth
// ---------------------------------------------------------------------------

/**
 * Route guard that handles session hydration on page refresh.
 *
 * Flow:
 *  1. If `accessToken` is missing → call `useRefreshMutation` to restore the
 *     JWT from the httpOnly refresh-token cookie.
 *  2. Decode the (restored) token to extract `userId`.
 *  3. Dispatch `setCredentials` with the token + userId.
 *  4. Fetch permissions via `useGetUserPermissionsQuery(userId)` and commit
 *     them to the store via `setPermissions`.
 *  5. Render `<Outlet />` once everything is ready; show a loader in between;
 *     redirect to /login on any failure.
 */
const RequireAuth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken, userId, isAuthChecked, isPermissionsLoaded, isModuleLoaded, moduleData } = useSelector(
    (state: RootState) => state.auth
  );

  const [refresh, { isLoading: isRefreshing }] = useRefreshMutation();

  // Guard against double-firing in StrictMode / re-renders
  const hasAttemptedRefresh = useRef(false);

  // ------------------------------------------------------------------
  // Step 1 + 2 + 3: Restore session when token is absent
  // ------------------------------------------------------------------
  useEffect(() => {
    if (accessToken || isAuthChecked || hasAttemptedRefresh.current) return;

    hasAttemptedRefresh.current = true;

    (async () => {
      try {
        const userData = await refresh().unwrap();
        const payload = decodeJwtPayload(userData.accessToken);
        const resolvedUserId =
          typeof payload?.userId === 'number' ? payload.userId : null;

        // without a valid userId, we can't proceed to fetch permissions, so we log the user out
        if (!resolvedUserId) {
          dispatch(logout());
          return;
        }  

        dispatch(
          setCredentials({
            user: userData.user ?? null,
            accessToken: userData.accessToken,
            userId: resolvedUserId,
          })
        );
      } catch {
        dispatch(logout());
      }
    })();
  }, [accessToken, isAuthChecked, dispatch, refresh]);

  // ------------------------------------------------------------------
  // Step 4: Fetch module data once accessToken is available
  // ------------------------------------------------------------------
  const {
    data: moduleDataResponse,
    isSuccess: moduleSuccess,
    isError: moduleError,
  } = useGetModuleQuery(undefined, { skip: !accessToken || isModuleLoaded });

  // Step 5: Commit module data to the store
  useEffect(() => {
    if (moduleSuccess && moduleDataResponse) {
      dispatch(setModuleData(moduleDataResponse));
    }
  }, [moduleSuccess, moduleDataResponse, dispatch]);

  // If module data fails to load, end the session
  useEffect(() => {
    if (moduleError) {
      dispatch(logout());
    }
  }, [moduleError, dispatch]);

  // ------------------------------------------------------------------
  // Step 6: Fetch permissions once userId is available
  // ------------------------------------------------------------------
  const {
    data: permissionsData,
    isSuccess: permissionsSuccess,
    isError: permissionsError,
  } = useGetUserPermissionsQuery(userId!, { skip: !userId });

  // Step 7: Commit permissions to the store
  useEffect(() => {
    if (permissionsSuccess && permissionsData) {
      dispatch(setPermissions(permissionsData));
    }
  }, [permissionsSuccess, permissionsData, dispatch]);

  // If permissions fails to load we cant make access decisions; end the
  // session rahter than leaving hte user stuck on the loader forever.
  useEffect(() => {
    if (permissionsError) {
      dispatch(logout());
    }
  }, [permissionsError, dispatch]);

  // ------------------------------------------------------------------
  // Step 8: Redirect PLATFORM_ADMIN users to /system-admin
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!moduleData) return;
    
    const isAccessingAdminZone = location.pathname.startsWith('/system-admin');

    if (moduleData.userType === 'PLATFORM_ADMIN') {
      // Platform admins are restricted to the /system-admin ecosystem
      if (!isAccessingAdminZone) {
        navigate('/system-admin', { replace: true });
      }
    }
  }, [moduleData, location.pathname, navigate]);

  // ------------------------------------------------------------------
  // UI States
  // ------------------------------------------------------------------

  // Still waiting for the refresh call, module data, or permissions to load
  const isInitialising = !accessToken && !isAuthChecked;
  const isLoadingModule = !!accessToken && !isModuleLoaded;
  const isLoadingPermissions = !!userId && !isPermissionsLoaded;

  if (isRefreshing || isInitialising || isLoadingModule || isLoadingPermissions) {
    return <div className="flex items-center justify-center h-screen w-screen">
      <div className='bg-slate-50 rounded-xl shadow-md border border-slate-200 p-8 flex flex-col gap-4 items-center justify-center'>
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin w-8 h-8 text-slate-600" />
          <span className="text-slate-600">Loading...</span>
        </div>
      </div>
    </div>;
  }

  // Session couldn't be restored. Remember where the uwer was headed so we can return them there after successful login.
  if (!accessToken && isAuthChecked) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
