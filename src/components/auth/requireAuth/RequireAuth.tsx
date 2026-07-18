import { useEffect, useRef } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useRefreshMutation, useValidateTokenMutation, useGetUserPermissionsQuery } from '@/features/auth/authApi';
import { setCredentials, setPermissions, logout } from '@/features/auth/authSlice';
import { Loader2 } from 'lucide-react';
import { getDefaultRouteFromRealmRoles } from '@/features/auth/roleRouting';

// Checks whether an RTK Query error is an HTTP 404
const is404 = (error: unknown): boolean =>
  !!error && typeof error === 'object' && 'status' in error && (error as { status: unknown }).status === 404;

// ---------------------------------------------------------------------------
// RequireAuth
// ---------------------------------------------------------------------------

/**
 * Route guard that handles session hydration on page refresh.
 *
 * Flow:
 *  1. If `accessToken` is missing → call `useRefreshMutation` to restore the
 *     JWT from the httpOnly refresh-token cookie.
 *  2. Call `/iam/validate-token` to decode the token and extract userId,
 *     email, realmRoles.
 *  3. Dispatch `setCredentials` with the token + validated identity.
 *  4. Fetch permissions via `useGetUserPermissionsQuery(userId)`, committing
 *     them to the store.
 *  5. Render `<Outlet />` once everything is ready; show a loader in between;
 *     redirect to /login on any failure.
 */
const RequireAuth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken, userId, realmRoles, exp, isAuthChecked, isPermissionsLoaded } = useSelector(
    (state: RootState) => state.auth
  );

  const [refresh, { isLoading: isRefreshing }] = useRefreshMutation();
  const [validateToken] = useValidateTokenMutation();

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
        // Step 1: Refresh — get a new access token from the httpOnly cookie
        const userData = await refresh().unwrap();

        // Step 2: Validate — decode the token server-side
        const validated = await validateToken(userData.accessToken).unwrap();

        if (!validated.active || !validated.userId) {
          dispatch(logout());
          return;
        }

        // Step 3: Store credentials
        dispatch(
          setCredentials({
            user: validated.email ?? null,
            accessToken: userData.accessToken,
            userId: validated.userId,
            email: validated.email,
            refreshToken: userData.refreshToken,
            realmRoles: validated.realmRoles,
            exp: validated.exp,
          })
        );
      } catch {
        dispatch(logout());
      }
    })();
  }, [accessToken, isAuthChecked, dispatch, refresh, validateToken]);

  // ------------------------------------------------------------------
  // Auto-refresh token before expiration
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!accessToken || !exp) return;

    // Refresh 30 seconds before expiration
    const refreshBufferSeconds = 30;
    const timeUntilRefreshSeconds = exp - Math.floor(Date.now() / 1000) - refreshBufferSeconds;
    const delayMs = Math.max(timeUntilRefreshSeconds, 0) * 1000;

    const timeoutId = setTimeout(async () => {
      try {
        const userData = await refresh().unwrap();
        const validated = await validateToken(userData.accessToken).unwrap();

        if (validated.active && validated.userId) {
          dispatch(
            setCredentials({
              user: validated.email ?? null,
              accessToken: userData.accessToken,
              userId: validated.userId,
              email: validated.email,
              refreshToken: userData.refreshToken,
              realmRoles: validated.realmRoles,
              exp: validated.exp,
            })
          );
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      }
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [accessToken, exp, refresh, validateToken, dispatch]);

  // ------------------------------------------------------------------
  // Step 4: Fetch permissions once userId is available
  // ------------------------------------------------------------------
  const {
    data: permissionsData,
    isSuccess: permissionsSuccess,
    isError: permissionsError,
    error: permissionsQueryError,
  } = useGetUserPermissionsQuery(userId!, { skip: !userId });

  // Step 5: Commit permissions to the store
  useEffect(() => {
    if (permissionsSuccess && permissionsData) {
      dispatch(setPermissions(permissionsData));
    }
  }, [permissionsSuccess, permissionsData, dispatch]);

  // If permissions fail to load:
  //  - 404 → backend not available yet; fall back to empty permissions
  //  - other errors → end the session
  useEffect(() => {
    if (!permissionsError) return;

    if (is404(permissionsQueryError)) {
      dispatch(setPermissions([]));
      return;
    }

    dispatch(logout());
  }, [permissionsError, permissionsQueryError, dispatch]);

  // ------------------------------------------------------------------
  // Step 6: Redirect users by role
  // Role is read from realmRoles (set at login from validate-token).
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!accessToken || !realmRoles.length) return;

    const isAccessingAdminZone = location.pathname.startsWith('/system-admin');
    const defaultRoute = getDefaultRouteFromRealmRoles(realmRoles);
    const isPlatformAdmin = realmRoles.includes('PLATFORM_ADMIN');
    const isCustomerOrVendor =
      realmRoles.includes('CUSTOMER_USER') ||
      realmRoles.includes('VENDOR_USER');

    if (isPlatformAdmin) {
      // Platform admins are restricted to the /system-admin ecosystem
      if (!isAccessingAdminZone) {
        navigate(defaultRoute, { replace: true });
      }
    } else if (isCustomerOrVendor) {
      // Customer and vendor users are restricted from the platform admin zone
      if (isAccessingAdminZone) {
        navigate(defaultRoute, { replace: true });
      }
    }
  }, [accessToken, realmRoles, location.pathname, navigate]);

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

  // Session couldn't be restored. Remember where the uwer was headed so we can return them there after successful login.
  if (!accessToken && isAuthChecked) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
