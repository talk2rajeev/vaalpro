export interface Vendor {
  vendorSysId: string;
  vendorCode: string;
  vendorName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  gstNumber: string;
  panNumber: string;
  yearEstablished: number;
  logoUrl?: string;
}

export interface VendorPage {
  content: Vendor[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface VendorListParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export type CreateVendorPayload = Omit<Vendor, 'vendorSysId'>;

export interface SearchVendorsParams {
  vendorName: string;
  page: number;
  size: number;
}
