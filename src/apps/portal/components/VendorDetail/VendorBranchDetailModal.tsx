import { useEffect, useMemo, useState } from 'react';
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
import { useGetVendorBranchByIdQuery, useUpdateVendorBranchMutation } from '@/features/vendorBranches/api';
import { getVendorBranchAddress } from '@/features/vendorBranches/helpers';
import type { UpdateVendorBranchPayload, VendorBranch } from '@/features/vendorBranches/types';

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

interface VendorBranchDetailModalProps {
  open: boolean;
  vendorSysId: string;
  branch: VendorBranch | null;
  onOpenChange: (open: boolean) => void;
}

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }

  return 'Unable to save the branch. Please try again.';
};

const getDefaultValues = (branch?: VendorBranch | null): BranchFormValues => ({
  branchName: branch?.branchName ?? '',
  addressLine1: branch?.addressLine1 ?? '',
  addressLine2: branch?.addressLine2 ?? '',
  city: branch?.city ?? '',
  state: branch?.state ?? '',
  postalCode: branch?.postalCode ?? '',
  country: branch?.country ?? '',
});

const VendorBranchDetailModal = ({
  open,
  vendorSysId,
  branch,
  onOpenChange,
}: VendorBranchDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data: fetchedBranch, isFetching } = useGetVendorBranchByIdQuery(
    { vendorSysId, branchSysId: branch?.branchSysId ?? '' },
    { skip: !open || !vendorSysId || !branch?.branchSysId },
  );
  const [updateVendorBranch, { isLoading: isUpdating }] = useUpdateVendorBranchMutation();
  const activeBranch = fetchedBranch ?? branch;
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: getDefaultValues(activeBranch),
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) {
      setIsEditing(false);
      setSaveError(null);
    }
  }, [open, branch?.branchSysId]);

  useEffect(() => {
    if (open) reset(getDefaultValues(activeBranch));
  }, [activeBranch, open, reset]);

  const branchFields = useMemo(
    () => [
      { label: 'Branch Name', value: activeBranch?.branchName },
      { label: 'Address Line 1', value: activeBranch?.addressLine1 },
      { label: 'Address Line 2', value: activeBranch?.addressLine2 },
      { label: 'City', value: activeBranch?.city },
      { label: 'State', value: activeBranch?.state },
      { label: 'Postal Code', value: activeBranch?.postalCode },
      { label: 'Country', value: activeBranch?.country },
    ],
    [activeBranch],
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setIsEditing(false);
      setSaveError(null);
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: BranchFormValues) => {
    if (!activeBranch) return;

    setSaveError(null);

    try {
      const body: UpdateVendorBranchPayload = {
        ...activeBranch,
        ...values,
      };
      await updateVendorBranch({
        vendorSysId,
        branchSysId: activeBranch.branchSysId,
        body,
      }).unwrap();
      setIsEditing(false);
    } catch (error: unknown) {
      setSaveError(getErrorMessage(error));
    }
  };

  const field = (label: string, name: keyof BranchFormValues, optional = false) => (
    <div className="space-y-1">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor={`branch-detail-${name}`}>
        {label}
        {optional ? ' (Optional)' : ''}
      </label>
      <input
        id={`branch-detail-${name}`}
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
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <DialogTitle>Branch Detail</DialogTitle>
              <DialogDescription>
                {activeBranch ? getVendorBranchAddress(activeBranch) : 'Loading branch detail...'}
              </DialogDescription>
            </div>
            {!isEditing && activeBranch && (
              <Button type="button" size="sm" onClick={() => setIsEditing(true)}>
                Edit Branch
              </Button>
            )}
          </div>
        </DialogHeader>

        {!isEditing ? (
          <div className="grid grid-cols-1 gap-5 py-4 md:grid-cols-2">
            {branchFields.map((item) => (
              <div key={item.label}>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
                <p className="mt-2 font-semibold text-slate-900">{item.value || 'Not provided'}</p>
              </div>
            ))}
            {isFetching && <p className="text-sm text-slate-500">Refreshing branch detail...</p>}
          </div>
        ) : (
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
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isUpdating}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating || !isValid}>
                {isUpdating ? 'Saving...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VendorBranchDetailModal;
