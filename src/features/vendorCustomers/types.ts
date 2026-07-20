export interface VendorCustomer {
  customerSysId: string;
  vendorSysId: string;
  customerLegalName: string;
  customerType?: string;
  customerStatus?: string;
  corporateNameCodeShort?: string;
  website?: string;
  corporateEmail?: string;
  corporatePhone?: string;
  country?: string;
  registeredAddress?: string;
  corporateCity?: string;
  corporateState?: string;
  corporatePin?: string;
  region?: string;
  pan?: string;
  gstinIfCentral?: string;
  cin?: string;
  msmeStatus?: string;
  ndaRequired?: boolean;
  qualityAgreementRequired?: boolean;
  createdBy?: string;
  remarks?: string;
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
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export type CreateVendorCustomerPayload = Omit<VendorCustomer, 'customerSysId'>;

export interface SearchVendorCustomersParams {
  customerLegalName: string;
  page: number;
  size: number;
}

export interface VendorCustomersByVendorParams {
  vendorSysId: string;
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
