export type VendorEmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface VendorEmployee {
  empSysId: string;
  vendorSysId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  contactNo: string;
  whatsappNo: string;
  alternateNo?: string;
  emailId: string;
  alternateEmail?: string;
  status: VendorEmployeeStatus;
  createdOn?: string;
  updatedOn?: string;
}

export interface VendorEmployeePage {
  content: VendorEmployee[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface VendorEmployeeListParams {
  vendorSysId: string;
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface VendorEmployeeByIdParams {
  vendorSysId: string;
  empSysId: string;
}

export type CreateVendorEmployeePayload = Omit<
  VendorEmployee,
  'empSysId' | 'vendorSysId' | 'createdOn' | 'updatedOn'
> & {
  password: string;
};

export type UpdateVendorEmployeePayload = VendorEmployee;
