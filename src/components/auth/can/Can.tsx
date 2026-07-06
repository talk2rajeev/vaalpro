import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { PermissionCode } from '@/core/authorization/permissions';
import { createAuthEngine } from '@/core/authorization/authEngine';

interface CanProps {
  perform: PermissionCode | PermissionCode[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const Can = ({
  perform,
  children,
  fallback = null,
}: CanProps) => {
  const authState = useSelector((state: RootState) => state.auth);

  const engine = createAuthEngine({
    permissions: authState.permissions ?? [],
    subscribedApps: authState.moduleData?.subscribed_apps ?? [],
    userType: authState.moduleData?.userType ?? 'USER',
  });

  const required = Array.isArray(perform) ? perform : [perform];
  const isAllowed = required.some(permission => engine.canPerformAction(permission));

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
