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
import { useCreateVendorMutation, useUpdateVendorMutation } from '@/features/vendors/vendorApi';
import type { Vendor } from '@/features/vendors/vendorTypes';

const vendorSchema = z.object({
  vendorCode: z.string().trim().min(1, 'Vendor code is required.'),
  vendorName: z.string().trim().min(1, 'Vendor name is required.'),
  addressLine1: z.string().trim().min(1, 'Address line 1 is required.'),
  addressLine2: z.string(),
  city: z.string().trim().min(1, 'City is required.'),
  state: z.string().trim().min(1, 'State is required.'),
  postalCode: z.string().trim().min(1, 'Postal code is required.'),
  country: z.string().trim().min(1, 'Country is required.'),
  gstNumber: z.string().trim().min(1, 'GST number is required.'),
  panNumber: z.string().trim().min(1, 'PAN number is required.'),
  yearEstablished: z.number().int().min(1800, 'Enter a valid establishment year.').max(new Date().getFullYear(), 'Establishment year cannot be in the future.'),
  logoUrl: z.string().trim().refine((value) => !value || z.url().safeParse(value).success, 'Enter a valid URL.'),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

interface VendorFormProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: Vendor | null;
}

const emptyVendor: VendorFormValues = {
  vendorCode: '', vendorName: '', addressLine1: '', addressLine2: '', city: '', state: '',
  postalCode: '', country: '', gstNumber: '', panNumber: '', yearEstablished: 2010, logoUrl: '',
};

const getDefaultValues = (vendor?: Vendor | null): VendorFormValues => vendor ? {
  vendorCode: vendor.vendorCode, vendorName: vendor.vendorName, addressLine1: vendor.addressLine1,
  addressLine2: vendor.addressLine2 ?? '', city: vendor.city, state: vendor.state,
  postalCode: vendor.postalCode, country: vendor.country, gstNumber: vendor.gstNumber,
  panNumber: vendor.panNumber, yearEstablished: vendor.yearEstablished, logoUrl: vendor.logoUrl ?? '',
} : emptyVendor;

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') return data.message;
  }
  return 'Unable to save the vendor. Please try again.';
};

const VendorForm = ({ mode, open, onOpenChange, vendor }: VendorFormProps) => {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [createVendor, { isLoading: isCreating }] = useCreateVendorMutation();
  const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: getDefaultValues(vendor),
  });
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(vendor));
    }
  }, [open, vendor, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setSaveError(null);
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: VendorFormValues) => {
    setSaveError(null);
    try {
      if (mode === 'create') await createVendor(values).unwrap();
      else if (vendor) await updateVendor({ vendorSysId: vendor.vendorSysId, body: values }).unwrap();
      handleOpenChange(false);
    } catch (error: unknown) {
      setSaveError(getErrorMessage(error));
    }
  };

  const field = (label: string, name: keyof VendorFormValues, options: { type?: 'text' | 'number'; optional?: boolean; wide?: boolean; placeholder?: string } = {}) => (
    <div className={`space-y-1 ${options.wide ? 'md:col-span-2' : ''}`}>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor={`vendor-${name}`}>{label}{options.optional ? ' (Optional)' : ''}</label>
      <input id={`vendor-${name}`} type={options.type ?? 'text'} {...register(name, options.type === 'number' ? { valueAsNumber: true } : undefined)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder={options.placeholder} aria-invalid={Boolean(errors[name])} />
      {errors[name] && <p className="text-xs text-red-600">{errors[name].message}</p>}
    </div>
  );

  const isEdit = mode === 'edit';
  return <Dialog open={open} onOpenChange={handleOpenChange}>
    <DialogContent className="sm:max-w-6xl max-h-[85vh] p-0 flex flex-col">
      <div className="p-6 pb-2"><DialogHeader><DialogTitle>{isEdit ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle><DialogDescription>Provide details for the {isEdit ? 'existing' : 'new'} vendor account.</DialogDescription></DialogHeader></div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto border-y border-slate-100 px-6 py-4"><div className="grid grid-cols-1 gap-4 space-y-4 md:grid-cols-2">
          {field('Vendor Name', 'vendorName', { wide: true, placeholder: 'e.g. Acme Corporation' })}
          {field('Vendor Code', 'vendorCode', { placeholder: 'e.g. VENDOR001' })}
          {field('Est. Year', 'yearEstablished', { type: 'number', placeholder: 'e.g. 2010' })}
          {field('Address Line 1', 'addressLine1', { wide: true, placeholder: 'e.g. 123 Main Street' })}
          {field('Address Line 2', 'addressLine2', { wide: true, optional: true, placeholder: 'e.g. Suite 100' })}
          {field('City', 'city', { placeholder: 'e.g. New York' })}
          {field('State', 'state', { placeholder: 'e.g. NY' })}
          {field('Postal Code', 'postalCode', { placeholder: 'e.g. 10001' })}
          {field('Country', 'country', { placeholder: 'e.g. USA' })}
          {field('GST Number', 'gstNumber', { placeholder: 'e.g. 29ABCDE1234F1Z5' })}
          {field('PAN Number', 'panNumber', { placeholder: 'e.g. ABCDE1234F' })}
          {field('Logo URL', 'logoUrl', { wide: true, optional: true, placeholder: 'e.g. https://example.com/logo.png' })}
        </div></div>
        <div className="p-6 pt-4">{saveError && <p className="mb-3 text-sm text-red-600">{saveError}</p>}<DialogFooter><Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button></DialogFooter></div>
      </form>
    </DialogContent>
  </Dialog>;
};

export default VendorForm;
