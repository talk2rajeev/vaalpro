import { useLocation, useParams } from 'react-router';
import { useGetVendorByIdQuery } from '@/features/vendors/api';
import type { Vendor } from '@/features/vendors/types';

interface VendorRouteState {
  vendor?: Vendor;
}

export const useVendorContext = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const location = useLocation();
  const stateVendor = (location.state as VendorRouteState | null)?.vendor;
  const query = useGetVendorByIdQuery(vendorId ?? '', { skip: !vendorId });
  const vendor =
    query.data ?? (stateVendor?.vendorSysId === vendorId ? stateVendor : undefined);

  return {
    vendorId,
    hasVendorContext: Boolean(vendorId),
    vendor,
    ...query,
  };
};
