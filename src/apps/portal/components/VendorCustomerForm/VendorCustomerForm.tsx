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
import { useCreateCustomerMutation, useUpdateCustomerMutation } from '@/features/customers/customerApi';
import type { Customer } from '@/features/customers/customerTypes';

const customerSchema = z.object({
  vendorSysId: z.string().trim().min(1, 'Vendor ID is required.'),
  customerLegalName: z.string().trim().min(1, 'Customer legal name is required.'),
  customerType: z.string(),
  customerStatus: z.string(),
  corporateNameCodeShort: z.string(),
  website: z.string().trim().refine((value) => !value || z.string().url().safeParse(value).success, 'Enter a valid URL.'),
  corporateEmail: z.string().trim().refine((value) => !value || z.string().email().safeParse(value).success, 'Enter a valid email.'),
  corporatePhone: z.string(),
  country: z.string(),
  registeredAddress: z.string(),
  corporateCity: z.string(),
  corporateState: z.string(),
  corporatePin: z.string(),
  region: z.string(),
  pan: z.string(),
  gstinIfCentral: z.string(),
  cin: z.string(),
  msmeStatus: z.string(),
  ndaRequired: z.boolean(),
  qualityAgreementRequired: z.boolean(),
  createdBy: z.string(),
  remarks: z.string(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface VendorCustomerFormProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
}

const emptyCustomer: CustomerFormValues = {
  vendorSysId: '', customerLegalName: '', customerType: '', customerStatus: '', corporateNameCodeShort: '',
  website: '', corporateEmail: '', corporatePhone: '', country: '', registeredAddress: '',
  corporateCity: '', corporateState: '', corporatePin: '', region: '', pan: '',
  gstinIfCentral: '', cin: '', msmeStatus: '', ndaRequired: false, qualityAgreementRequired: false,
  createdBy: '', remarks: '',
};

const getDefaultValues = (customer?: Customer | null): CustomerFormValues => customer ? {
  vendorSysId: customer.vendorSysId, customerLegalName: customer.customerLegalName,
  customerType: customer.customerType ?? '', customerStatus: customer.customerStatus ?? '',
  corporateNameCodeShort: customer.corporateNameCodeShort ?? '', website: customer.website ?? '',
  corporateEmail: customer.corporateEmail ?? '', corporatePhone: customer.corporatePhone ?? '',
  country: customer.country ?? '', registeredAddress: customer.registeredAddress ?? '',
  corporateCity: customer.corporateCity ?? '', corporateState: customer.corporateState ?? '',
  corporatePin: customer.corporatePin ?? '', region: customer.region ?? '',
  pan: customer.pan ?? '', gstinIfCentral: customer.gstinIfCentral ?? '',
  cin: customer.cin ?? '', msmeStatus: customer.msmeStatus ?? '',
  ndaRequired: customer.ndaRequired ?? false, qualityAgreementRequired: customer.qualityAgreementRequired ?? false,
  createdBy: customer.createdBy ?? '', remarks: customer.remarks ?? '',
} : emptyCustomer;

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') return data.message;
  }
  return 'Unable to save the customer. Please try again.';
};

const VendorCustomerForm = ({ mode, open, onOpenChange, customer }: VendorCustomerFormProps) => {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: getDefaultValues(customer),
    mode: 'onChange',
  });
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(customer));
    }
  }, [open, customer, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setSaveError(null);
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: CustomerFormValues) => {
    setSaveError(null);
    try {
      if (mode === 'create') await createCustomer(values).unwrap();
      else if (customer) await updateCustomer({ customerSysId: customer.customerSysId, body: values }).unwrap();
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
          {field('Customer Legal Name', 'customerLegalName', { wide: true, placeholder: 'e.g. Acme Industries Ltd' })}
          {field('Customer Type', 'customerType', { optional: true, placeholder: 'e.g. Corporate' })}
          {field('Status', 'customerStatus', { optional: true, placeholder: 'e.g. Active' })}
          {field('Corporate Code', 'corporateNameCodeShort', { optional: true, placeholder: 'e.g. ACME' })}
          {field('Website', 'website', { optional: true, placeholder: 'e.g. https://acme.com' })}
          {field('Corporate Email', 'corporateEmail', { optional: true, placeholder: 'e.g. contact@acme.com' })}
          {field('Corporate Phone', 'corporatePhone', { optional: true, placeholder: 'e.g. +1234567890' })}
          {field('Registered Address', 'registeredAddress', { wide: true, optional: true, placeholder: 'e.g. 123 Business Park, Suite 500' })}
          {field('City', 'corporateCity', { optional: true, placeholder: 'e.g. New York' })}
          {field('State', 'corporateState', { optional: true, placeholder: 'e.g. NY' })}
          {field('PIN Code', 'corporatePin', { optional: true, placeholder: 'e.g. 10001' })}
          {field('Country', 'country', { optional: true, placeholder: 'e.g. USA' })}
          {field('Region', 'region', { optional: true, placeholder: 'e.g. North America' })}
          {field('PAN', 'pan', { optional: true, placeholder: 'e.g. ABCDE1234F' })}
          {field('GSTIN (Central)', 'gstinIfCentral', { optional: true, placeholder: 'e.g. 29ABCDE1234F1Z5' })}
          {field('CIN', 'cin', { optional: true, placeholder: 'e.g. L12345MH2023PTC123456' })}
          {field('MSME Status', 'msmeStatus', { optional: true, placeholder: 'e.g. Registered' })}
          {field('Created By', 'createdBy', { optional: true, placeholder: 'e.g. admin' })}
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
