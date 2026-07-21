import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/core-components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/core-components/dialog';
import { useCreateVendorCustomerMutation, useUpdateVendorCustomerMutation } from '@/features/vendorCustomers/api';
import type { VendorCustomer } from '@/features/vendorCustomers/types';

const customerSchema = z.object({
  vendorSysId: z.string().trim().min(1, 'Vendor ID is required.'),
  legalName: z.string().trim().min(1, 'Customer legal name is required.'),
  customerType: z.string(),
  status: z.string(),
  nameShortCode: z.string(),
  website: z.string().trim().refine((value) => !value || z.string().url().safeParse(value).success, 'Enter a valid URL.'),
  corporateEmail: z.string().trim().refine((value) => !value || z.string().email().safeParse(value).success, 'Enter a valid email.'),
  corporatePhone: z.string(),
  country: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  region: z.string(),
  panNumber: z.string(),
  gstNumber: z.string(),
  cin: z.string(),
  msmeStatus: z.string(),
  ndaRequired: z.boolean(),
  qualityAgreementRequired: z.boolean(),
  remarks: z.string(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface VendorCustomerFormProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: VendorCustomer | null;
  vendorSysId?: string;
}

const emptyCustomer: CustomerFormValues = {
  vendorSysId: '', legalName: '', customerType: '', status: '', nameShortCode: '',
  website: '', corporateEmail: '', corporatePhone: '', country: '', addressLine1: '',
  addressLine2: '', city: '', state: '', postalCode: '', region: '', panNumber: '',
  gstNumber: '', cin: '', msmeStatus: '', ndaRequired: false, qualityAgreementRequired: false,
  remarks: '',
};

const getDefaultValues = (customer?: VendorCustomer | null, vendorSysId = ''): CustomerFormValues => customer ? {
  vendorSysId: customer.vendorSysId, legalName: customer.legalName,
  customerType: customer.customerType ?? '', status: customer.status ?? '',
  nameShortCode: customer.nameShortCode ?? '', website: customer.website ?? '',
  corporateEmail: customer.corporateEmail ?? '', corporatePhone: customer.corporatePhone ?? '',
  country: customer.country ?? '', addressLine1: customer.addressLine1 ?? '',
  addressLine2: customer.addressLine2 ?? '', city: customer.city ?? '',
  state: customer.state ?? '', postalCode: customer.postalCode ?? '',
  region: customer.region ?? '', panNumber: customer.panNumber ?? '',
  gstNumber: customer.gstNumber ?? '', cin: customer.cin ?? '',
  msmeStatus: customer.msmeStatus ?? '', ndaRequired: customer.ndaRequired ?? false,
  qualityAgreementRequired: customer.qualityAgreementRequired ?? false,
  remarks: customer.remarks ?? '',
} : { ...emptyCustomer, vendorSysId };

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') return data.message;
  }
  return 'Unable to save the customer. Please try again.';
};

const VendorCustomerForm = ({ mode, open, onOpenChange, customer, vendorSysId }: VendorCustomerFormProps) => {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [createVendorCustomer, { isLoading: isCreating }] = useCreateVendorCustomerMutation();
  const [updateVendorCustomer, { isLoading: isUpdating }] = useUpdateVendorCustomerMutation();
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: getDefaultValues(customer, vendorSysId),
    mode: 'onChange',
  });
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(customer, vendorSysId));
    }
  }, [open, customer, vendorSysId, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setSaveError(null);
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: CustomerFormValues) => {
    setSaveError(null);
    try {
      if (mode === 'create') await createVendorCustomer(values).unwrap();
      else if (customer) await updateVendorCustomer({
        customerSysId: customer.customerSysId,
        body: {
          ...values,
          customerSysId: customer.customerSysId,
          createdOn: customer.createdOn,
          updatedOn: customer.updatedOn,
        },
      }).unwrap();
      handleOpenChange(false);
    } catch (error: unknown) {
      setSaveError(getErrorMessage(error));
    }
  };

  const field = (label: string, name: keyof CustomerFormValues, options: { type?: 'text' | 'number'; optional?: boolean; wide?: boolean; placeholder?: string } = {}) => (
    <div className={`space-y-1 ${options.wide ? 'md:col-span-2' : ''}`}>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor={`customer-${name}`}>{label}{options.optional ? ' (Optional)' : ''}</label>
      <input id={`customer-${name}`} type={options.type ?? 'text'} {...register(name)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder={options.placeholder} aria-invalid={Boolean(errors[name])} />
      {errors[name] && <p className="text-xs text-red-600">{errors[name].message}</p>}
    </div>
  );

  const checkbox = (label: string, name: keyof CustomerFormValues) => (
    <div className="flex items-center gap-3 py-1">
      <input id={`customer-${name}`} type="checkbox" {...register(name)} className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor={`customer-${name}`}>{label}</label>
    </div>
  );

  const isEdit = mode === 'edit';
  return <Dialog open={open} onOpenChange={handleOpenChange}>
    <DialogContent className="sm:max-w-6xl max-h-[85vh] p-0 flex flex-col" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
      <div className="p-6 pb-2"><DialogHeader><DialogTitle>{isEdit ? 'Edit Customer' : 'Add Customer'}</DialogTitle><DialogDescription>Provide details for the {isEdit ? 'existing' : 'new'} vendor customer account.</DialogDescription></DialogHeader></div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto border-y border-slate-100 px-6 py-4"><div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {field('Vendor ID', 'vendorSysId', { placeholder: 'e.g. vendor-sys-id' })}
          {field('Legal Name', 'legalName', { wide: true, placeholder: 'e.g. Acme Industries Ltd' })}
          {field('Customer Type', 'customerType', { optional: true, placeholder: 'e.g. Corporate' })}
          {field('Status', 'status', { optional: true, placeholder: 'e.g. Active' })}
          {field('Name Short Code', 'nameShortCode', { optional: true, placeholder: 'e.g. ACME' })}
          {field('Website', 'website', { optional: true, placeholder: 'e.g. https://acme.com' })}
          {field('Corporate Email', 'corporateEmail', { optional: true, placeholder: 'e.g. contact@acme.com' })}
          {field('Corporate Phone', 'corporatePhone', { optional: true, placeholder: 'e.g. +1234567890' })}
          {field('Address Line 1', 'addressLine1', { wide: true, optional: true, placeholder: 'e.g. 123 Main St' })}
          {field('Address Line 2', 'addressLine2', { wide: true, optional: true, placeholder: 'e.g. Suite 100' })}
          {field('City', 'city', { optional: true, placeholder: 'e.g. New York' })}
          {field('State', 'state', { optional: true, placeholder: 'e.g. NY' })}
          {field('Postal Code', 'postalCode', { optional: true, placeholder: 'e.g. 10001' })}
          {field('Country', 'country', { optional: true, placeholder: 'e.g. USA' })}
          {field('Region', 'region', { optional: true, placeholder: 'e.g. North America' })}
          {field('PAN Number', 'panNumber', { optional: true, placeholder: 'e.g. ABCDE1234F' })}
          {field('GST Number', 'gstNumber', { optional: true, placeholder: 'e.g. 29ABCDE1234F1Z5' })}
          {field('CIN', 'cin', { optional: true, placeholder: 'e.g. L12345MH2023PTC123456' })}
          {field('MSME Status', 'msmeStatus', { optional: true, placeholder: 'e.g. Registered' })}
          {field('Remarks', 'remarks', { wide: true, optional: true, placeholder: 'e.g. Initial customer setup' })}
          <div className="md:col-span-2 flex gap-8">
            {checkbox('NDA Required', 'ndaRequired')}
            {checkbox('Quality Agreement Required', 'qualityAgreementRequired')}
          </div>
        </div></div>
        <div className="p-6 pt-4">{saveError && <p className="mb-3 text-sm text-red-600">{saveError}</p>}<DialogFooter><Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>Cancel</Button><Button type="submit" disabled={isSaving || !isValid}>{isSaving ? 'Saving...' : 'Save'}</Button></DialogFooter></div>
      </form>
    </DialogContent>
  </Dialog>;
};

export default VendorCustomerForm;
