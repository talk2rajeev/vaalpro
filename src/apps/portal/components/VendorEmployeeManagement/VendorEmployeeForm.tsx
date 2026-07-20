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
import type { Vendor } from '@/features/vendors/types';
import {
  useCreateVendorEmployeeMutation,
  useUpdateVendorEmployeeMutation,
} from '@/features/vendorEmployees/api';
import type {
  CreateVendorEmployeePayload,
  UpdateVendorEmployeePayload,
  VendorEmployee,
  VendorEmployeeStatus,
} from '@/features/vendorEmployees/types';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }

  return fallback;
};

const vendorEmployeeSchema = z.object({
  employeeId: z.string().trim().min(1, 'Employee ID is required.'),
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  designation: z.string().trim().min(1, 'Designation is required.'),
  department: z.string().trim().min(1, 'Department is required.'),
  contactNo: z.string().trim().min(1, 'Contact number is required.'),
  whatsappNo: z.string().trim().min(1, 'WhatsApp number is required.'),
  alternateNo: z.string(),
  emailId: z.email('Enter a valid email address.'),
  alternateEmail: z.string().trim().refine((value) => !value || z.email().safeParse(value).success, 'Enter a valid alternate email.'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  password: z.string(),
});

type VendorEmployeeFormValues = z.infer<typeof vendorEmployeeSchema>;

interface VendorEmployeeFormProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
  employee?: VendorEmployee | null;
}

const emptyEmployee: VendorEmployeeFormValues = {
  employeeId: '',
  firstName: '',
  lastName: '',
  designation: '',
  department: '',
  contactNo: '',
  whatsappNo: '',
  alternateNo: '',
  emailId: '',
  alternateEmail: '',
  status: 'ACTIVE',
  password: '',
};

const getDefaultValues = (employee?: VendorEmployee | null): VendorEmployeeFormValues =>
  employee
    ? {
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        designation: employee.designation,
        department: employee.department,
        contactNo: employee.contactNo,
        whatsappNo: employee.whatsappNo,
        alternateNo: employee.alternateNo ?? '',
        emailId: employee.emailId,
        alternateEmail: employee.alternateEmail ?? '',
        status: employee.status,
        password: '',
      }
    : emptyEmployee;

const VendorEmployeeForm = ({ mode, open, onOpenChange, vendor, employee }: VendorEmployeeFormProps) => {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [createVendorEmployee, { isLoading: isCreating }] = useCreateVendorEmployeeMutation();
  const [updateVendorEmployee, { isLoading: isUpdating }] = useUpdateVendorEmployeeMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<VendorEmployeeFormValues>({
    resolver: zodResolver(vendorEmployeeSchema),
    defaultValues: getDefaultValues(employee),
    mode: 'onChange',
  });
  const password = watch('password');
  const isEdit = mode === 'edit';
  const isSaving = isCreating || isUpdating;
  const canSubmit = isValid && (isEdit || password.trim().length > 0);

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(employee));
      setSaveError(null);
    }
  }, [open, employee, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setSaveError(null);
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: VendorEmployeeFormValues) => {
    if (!vendor) return;
    setSaveError(null);

    try {
      if (mode === 'create') {
        const body: CreateVendorEmployeePayload = {
          employeeId: values.employeeId,
          firstName: values.firstName,
          lastName: values.lastName,
          designation: values.designation,
          department: values.department,
          contactNo: values.contactNo,
          whatsappNo: values.whatsappNo,
          alternateNo: values.alternateNo,
          emailId: values.emailId,
          alternateEmail: values.alternateEmail,
          status: values.status,
          password: values.password,
        };
        await createVendorEmployee({ vendorSysId: vendor.vendorSysId, body }).unwrap();
      } else if (employee) {
        const body: UpdateVendorEmployeePayload = {
          empSysId: employee.empSysId,
          vendorSysId: employee.vendorSysId,
          employeeId: values.employeeId,
          firstName: values.firstName,
          lastName: values.lastName,
          designation: values.designation,
          department: values.department,
          contactNo: values.contactNo,
          whatsappNo: values.whatsappNo,
          alternateNo: values.alternateNo,
          emailId: values.emailId,
          alternateEmail: values.alternateEmail,
          status: values.status as VendorEmployeeStatus,
          createdOn: employee.createdOn,
          updatedOn: employee.updatedOn,
        };
        await updateVendorEmployee({ vendorSysId: employee.vendorSysId, empSysId: employee.empSysId, body }).unwrap();
      }

      handleOpenChange(false);
    } catch (error: unknown) {
      setSaveError(getErrorMessage(error, 'Unable to save the vendor employee. Please try again.'));
    }
  };

  const field = (
    label: string,
    name: keyof VendorEmployeeFormValues,
    options: { type?: 'text' | 'password' | 'email'; optional?: boolean; wide?: boolean; placeholder?: string } = {},
  ) => (
    <div className={`space-y-1 ${options.wide ? 'md:col-span-2' : ''}`}>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor={`vendor-employee-${name}`}>
        {label}
        {options.optional ? ' (Optional)' : ''}
      </label>
      <input
        id={`vendor-employee-${name}`}
        type={options.type ?? 'text'}
        {...register(name)}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        placeholder={options.placeholder}
        aria-invalid={Boolean(errors[name])}
      />
      {errors[name] && <p className="text-xs text-red-600">{errors[name].message}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-6xl max-h-[85vh] p-0 flex flex-col"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Vendor Employee' : 'Add Vendor Employee'}</DialogTitle>
            <DialogDescription>
              Provide details for the {isEdit ? 'existing' : 'new'} employee under {vendor?.vendorName ?? 'the selected vendor'}.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto border-y border-slate-100 px-6 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {field('Employee ID', 'employeeId', { placeholder: 'e.g. EMP005' })}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="vendor-employee-status">
                  Status
                </label>
                <select
                  id="vendor-employee-status"
                  {...register('status')}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              {field('First Name', 'firstName', { placeholder: 'e.g. Michael' })}
              {field('Last Name', 'lastName', { placeholder: 'e.g. Johnson' })}
              {field('Designation', 'designation', { placeholder: 'e.g. Senior validation engineer' })}
              {field('Department', 'department', { placeholder: 'e.g. Validation' })}
              {field('Contact No', 'contactNo', { placeholder: 'e.g. 5551234567' })}
              {field('WhatsApp No', 'whatsappNo', { placeholder: 'e.g. 5551234567' })}
              {field('Alternate No', 'alternateNo', { optional: true, placeholder: 'e.g. 5551234568' })}
              {field('Email', 'emailId', { type: 'email', placeholder: 'e.g. michael.johnson@example.com' })}
              {field('Alternate Email', 'alternateEmail', { type: 'email', optional: true, placeholder: 'e.g. michael.alt@example.com' })}
              {!isEdit && field('Password', 'password', { type: 'password', placeholder: 'Set initial password' })}
            </div>
          </div>
          <div className="p-6 pt-4">
            {saveError && <p className="mb-3 text-sm text-red-600">{saveError}</p>}
            {!isEdit && !password.trim() && <p className="mb-3 text-sm text-amber-600">Password is required for new employees.</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || !canSubmit}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VendorEmployeeForm;
