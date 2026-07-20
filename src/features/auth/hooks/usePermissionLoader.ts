import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetUserPermissionsQuery } from '@/features/auth/authApi';
import { logout, setPermissions } from '@/features/auth/authSlice';

const is404 = (error: unknown): boolean =>
  !!error && typeof error === 'object' && 'status' in error && (error as { status: unknown }).status === 404;

/**
 * Loads and stores permissions for the authenticated user.
 *
 * Once a user id is available, this hook fetches permission data and commits it
 * to auth state. A 404 is treated as an MVP-safe empty permission set; other
 * permission failures end the session.
 */
export const usePermissionLoader = (userId: string | null) => {
  const dispatch = useDispatch();
  const {
    data: permissionsData,
    isSuccess: permissionsSuccess,
    isError: permissionsError,
    error: permissionsQueryError,
  } = useGetUserPermissionsQuery(userId!, { skip: !userId });

  useEffect(() => {
    if (permissionsSuccess && permissionsData) {
      dispatch(setPermissions(permissionsData));
    }
  }, [permissionsSuccess, permissionsData, dispatch]);

  useEffect(() => {
    if (!permissionsError) return;

    if (is404(permissionsQueryError)) {
      dispatch(setPermissions([]));
      return;
    }

    dispatch(logout());
  }, [permissionsError, permissionsQueryError, dispatch]);
};
