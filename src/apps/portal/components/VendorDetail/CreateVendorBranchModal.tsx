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
import { useCreateVendorBranchMutation } from '@/features/vendorBranches/api';
import type { CreateVendorBranchPayload } from '@/features/vendorBranches/types';

const branchSchema = z.object({
  branchName: z.string().trim().min(1, 'Branch name is required.'),
  addressLine1: z.string().trim().min(1, 'Address line 1 is required.'),
  addressLine2: z.string(),
  city: z.string().trim().min(1, 'City is required.'),
  state: z.string().trim().min(1, 'State is required.'),
  postalCode: z.string().trim().min(1, 'Postal code is required.'),
  country: z.string().trim().min(1, 'Country is required.'),
});

type BranchFormValues = z.infer<typeof branchSchema>;

interface CreateVendorBranchModalProps {
  open: boolean;
  vendorSysId: string;
  onOpenChange: (open: boolean) => void;
}

const emptyBranch: BranchFormValues = {
  branchName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }

  return 'Unable to save the branch. Please try again.';
};

const CreateVendorBranchModal = ({ open, vendorSysId, onOpenChange }: CreateVendorBranchModalProps) => {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [createVendorBranch, { isLoading: isCreating }] = useCreateVendorBranchMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: emptyBranch,
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) {
      reset(emptyBranch);
      setSaveError(null);
    }
  }, [open, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setSaveError(null);
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: BranchFormValues) => {
    setSaveError(null);

    try {
      const body: CreateVendorBranchPayload = values;
      await createVendorBranch({ vendorSysId, body }).unwrap();
      handleOpenChange(false);
    } catch (error: unknown) {
      setSaveError(getErrorMessage(error));
    }
  };

  const field = (label: string, name: keyof BranchFormValues, optional = false) => (
    <div className="space-y-1">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor={`branch-create-${name}`}>
        {label}
        {optional ? ' (Optional)' : ''}
      </label>
      <input
        id={`branch-create-${name}`}
        {...register(name)}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        aria-invalid={Boolean(errors[name])}
      />
      {errors[name] && <p className="text-xs text-red-600">{errors[name].message}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Branch</DialogTitle>
          <DialogDescription>Add a new branch for this vendor.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
            {field('Branch Name', 'branchName')}
            {field('Country', 'country')}
            {field('Address Line 1', 'addressLine1')}
            {field('Address Line 2', 'addressLine2', true)}
            {field('City', 'city')}
            {field('State', 'state')}
            {field('Postal Code', 'postalCode')}
          </div>
          {saveError && <p className="mb-3 text-sm text-red-600">{saveError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !isValid}>
              {isCreating ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVendorBranchModal;
