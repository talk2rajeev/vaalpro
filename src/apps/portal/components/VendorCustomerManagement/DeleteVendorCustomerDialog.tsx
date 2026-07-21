import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/core-components/dialog';
import type { VendorCustomer } from '@/features/vendorCustomers/types';

interface DeleteVendorCustomerDialogProps {
  customer: VendorCustomer | null;
  deleteError: string | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteVendorCustomerDialog = ({
  customer,
  deleteError,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteVendorCustomerDialogProps) => (
  <Dialog open={customer !== null} onOpenChange={(open: boolean) => !open && onCancel()}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-950">{customer?.legalName}</span>? This action is
          permanent.
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
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Deleting...
            </>
          ) : (
            'Delete'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteVendorCustomerDialog;
