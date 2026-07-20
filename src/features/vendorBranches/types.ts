export interface VendorBranch {
  branchSysId: string;
  vendorSysId: string;
  branchName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdOn: string;
  updatedOn: string;
}

export interface VendorBranchListParams {
  vendorSysId: string;
}

export interface VendorBranchByIdParams {
  vendorSysId: string;
  branchSysId: string;
}

export type CreateVendorBranchPayload = Pick<
  VendorBranch,
  'branchName' | 'addressLine1' | 'addressLine2' | 'city' | 'state' | 'postalCode' | 'country'
>;

export type UpdateVendorBranchPayload = VendorBranch;
