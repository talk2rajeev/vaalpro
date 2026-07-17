export interface Customer {
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

export interface CustomerPage {
  content: Customer[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface CustomerListParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export type CreateCustomerPayload = Omit<Customer, 'customerSysId'>;

export interface SearchCustomersParams {
  customerLegalName: string;
  page: number;
  size: number;
}

export interface CustomersByVendorParams {
  vendorSysId: string;
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
