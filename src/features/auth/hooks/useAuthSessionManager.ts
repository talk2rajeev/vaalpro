import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRefreshMutation, useValidateTokenMutation } from '@/features/auth/authApi';
import { logout, setCredentials } from '@/features/auth/authSlice';

interface UseAuthSessionManagerParams {
  accessToken: string | null;
  exp: number | null;
  isAuthChecked: boolean;
}

/**
 * Restores and maintains the authenticated session.
 *
 * If the app loads without an access token, this hook attempts to refresh the
 * session, validates the returned token, and stores the authenticated identity.
 * When a token is already present, it schedules a refresh shortly before expiry.
 */
export const useAuthSessionManager = ({
  accessToken,
  exp,
  isAuthChecked,
}: UseAuthSessionManagerParams) => {
  const dispatch = useDispatch();
  const [refresh, { isLoading: isRefreshing }] = useRefreshMutation();
  const [validateToken] = useValidateTokenMutation();
  const hasAttemptedRefresh = useRef(false);

  useEffect(() => {
    if (accessToken || isAuthChecked || hasAttemptedRefresh.current) return;

    hasAttemptedRefresh.current = true;

    (async () => {
      try {
        const userData = await refresh().unwrap();
        const validated = await validateToken(userData.accessToken).unwrap();

        if (!validated.active || !validated.userId) {
          dispatch(logout());
          return;
        }

        dispatch(
          setCredentials({
            user: validated.email ?? null,
            accessToken: userData.accessToken,
            userId: validated.userId,
            email: validated.email,
            refreshToken: userData.refreshToken,
            realmRoles: validated.realmRoles,
            exp: validated.exp,
          }),
        );
      } catch {
        dispatch(logout());
      }
    })();
  }, [accessToken, isAuthChecked, dispatch, refresh, validateToken]);

  useEffect(() => {
    if (!accessToken || !exp) return;

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
            }),
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

  return { isRefreshing };
};
