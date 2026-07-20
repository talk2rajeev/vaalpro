import type { VendorBranch } from '@/features/vendorBranches/types';

export const getVendorBranchAddress = (branch: VendorBranch) =>
  [
    branch.addressLine1,
    branch.addressLine2,
    branch.city,
    branch.state,
    branch.postalCode,
    branch.country,
  ]
    .filter(Boolean)
    .join(', ');
