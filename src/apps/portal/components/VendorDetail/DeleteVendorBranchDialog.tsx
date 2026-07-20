import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/core-components/dialog';
import type { VendorBranch } from '@/features/vendorBranches/types';

interface DeleteVendorBranchDialogProps {
  branch: VendorBranch | null;
  deleteError: string | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteVendorBranchDialog = ({
  branch,
  deleteError,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteVendorBranchDialogProps) => (
  <Dialog open={branch !== null} onOpenChange={(open: boolean) => !open && onCancel()}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-950">{branch?.branchName}</span>? This action is permanent.
        </DialogDescription>
      </DialogHeader>
      {deleteError && (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          <span>{deleteError}</span>
        </div>
      )}
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteVendorBranchDialog;
