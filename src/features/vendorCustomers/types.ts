export interface VendorCustomer {
  customerSysId: string;
  vendorSysId: string;
  legalName: string;
  customerType?: string;
  status?: string;
  nameShortCode?: string;
  website?: string;
  corporateEmail?: string;
  corporatePhone?: string;
  country?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  region?: string;
  panNumber?: string;
  gstNumber?: string;
  cin?: string;
  msmeStatus?: string;
  ndaRequired?: boolean;
  qualityAgreementRequired?: boolean;
  remarks?: string;
  createdOn?: string;
  updatedOn?: string;
}

export interface VendorCustomerPage {
  content: VendorCustomer[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface VendorCustomerListParams {
  vendorSysId?: string;
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export type CreateVendorCustomerPayload = Omit<VendorCustomer, 'customerSysId' | 'createdOn' | 'updatedOn'>;

export interface SearchVendorCustomersParams {
  customerLegalName: string;
  page: number;
  size: number;
}
