import { useCallback, useEffect, useMemo, useState } from 'react';
import { Info, Map, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/core-components/tooltip';
import CreateVendorBranchModal from '@/apps/portal/components/VendorDetail/CreateVendorBranchModal';
import DeleteVendorBranchDialog from '@/apps/portal/components/VendorDetail/DeleteVendorBranchDialog';
import VendorBranchDetailModal from '@/apps/portal/components/VendorDetail/VendorBranchDetailModal';
import { useDeleteVendorBranchMutation, useGetVendorBranchesQuery } from '@/features/vendorBranches/api';
import { getVendorBranchAddress } from '@/features/vendorBranches/helpers';
import type { VendorBranch } from '@/features/vendorBranches/types';

interface BranchesSectionProps {
  vendorSysId: string;
}

const emitBranchNameClick = (branch: VendorBranch) => {
  window.dispatchEvent(new CustomEvent('vendor-branch-name-click', { detail: { branch } }));
};

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }

  return 'Unable to delete the branch. Please try again.';
};

const BranchesSection = ({ vendorSysId }: BranchesSectionProps) => {
  const [selectedBranchSysId, setSelectedBranchSysId] = useState<string | null>(null);
  const [viewingBranch, setViewingBranch] = useState<VendorBranch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<VendorBranch | null>(null);
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetVendorBranchesQuery({ vendorSysId }, { skip: !vendorSysId });
  const [deleteVendorBranch, { isLoading: isDeleting }] = useDeleteVendorBranchMutation();
  const branches = data ?? [];
  const selectedBranch = useMemo(
    () => branches.find((branch) => branch.branchSysId === selectedBranchSysId) ?? null,
    [branches, selectedBranchSysId],
  );

  useEffect(() => {
    if (selectedBranchSysId && !selectedBranch) {
      setSelectedBranchSysId(null);
    }
  }, [selectedBranch, selectedBranchSysId]);

  const handleDeleteClick = useCallback((branch: VendorBranch) => {
    setDeleteError(null);
    setDeletingBranch(branch);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deletingBranch) return;
    setDeleteError(null);

    try {
      await deleteVendorBranch({
        vendorSysId,
        branchSysId: deletingBranch.branchSysId,
      }).unwrap();
      if (selectedBranchSysId === deletingBranch.branchSysId) {
        setSelectedBranchSysId(null);
      }
      setDeletingBranch(null);
    } catch (err: unknown) {
      setDeleteError(getErrorMessage(err));
    }
  };

  return (
    <TooltipProvider>
      <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Branches</h2>
            <Button size="lg" className="px-4" onClick={() => setIsCreatingBranch(true)}>
              <Plus data-icon="inline-start" className="size-4" />
              Create Branch
            </Button>
          </div>

          <p className="mt-8 text-xs italic text-slate-600">
            * Select a branch to view/update its detail.
          </p>

          <div className="mt-5 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-xs font-bold text-slate-600">
                <tr>
                  <th className="px-5 py-5">
                    <span className="inline-flex items-center gap-2">
                      Branch Name
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="size-3.5 text-slate-500" />
                        </TooltipTrigger>
                        <TooltipContent>Click the branch name to view/update the branch detail</TooltipContent>
                      </Tooltip>
                    </span>
                  </th>
                  <th className="px-5 py-5">Location</th>
                  <th className="px-5 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={3} className="px-5 py-10 text-center text-slate-500">
                      Loading branches...
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td colSpan={3} className="px-5 py-10 text-center text-red-600">
                      {getErrorMessage(error)}
                    </td>
                  </tr>
                )}
                {!isLoading && !isError && branches.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-10 text-center text-slate-500">
                      No branches found.
                    </td>
                  </tr>
                )}
                {!isLoading && !isError && branches.map((branch, index) => {
                  const isSelected = branch.branchSysId === selectedBranchSysId;

                  return (
                    <tr
                      key={branch.branchSysId}
                      className={index % 2 === 1 ? 'bg-slate-100/80' : 'bg-white'}
                    >
                      <td className="px-5 py-5">
                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => setSelectedBranchSysId(branch.branchSysId)}
                            className={`rounded-md p-1 transition-colors hover:bg-slate-100 ${isSelected ? 'text-red-600' : 'text-blue-800'
                              }`}
                            aria-label={`Show ${branch.branchName} location`}
                          >
                            <MapPin className="size-6" />
                          </button>
                          <button
                            type="button"
                            onClick={() => emitBranchNameClick(branch)}
                            className="font-semibold text-blue-800 transition-colors hover:text-blue-700 hover:underline"
                          >
                            {branch.branchName}
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-5 text-slate-600">{getVendorBranchAddress(branch)}</td>
                      <td className="px-5 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-slate-500 hover:text-blue-600"
                                onClick={() => setViewingBranch(branch)}
                              >
                                <Pencil className="size-4.5" />
                                <span className="sr-only">View or edit branch</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">View/Edit Branch</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-slate-500 hover:text-red-600"
                                onClick={() => handleDeleteClick(branch)}
                              >
                                <Trash2 className="size-4.5" />
                                <span className="sr-only">Delete branch</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Delete Branch</TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="p-7">
            <div className="flex items-center gap-3">
              <Map className="size-5 text-blue-800" />
              <h2 className="text-xl font-semibold">Branch Location</h2>
            </div>
            {selectedBranch && (
              <div className="mt-4">
                <p className="font-bold text-slate-900">{selectedBranch.branchName}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{getVendorBranchAddress(selectedBranch)}</p>
              </div>
            )}
          </div>
          <div className="flex h-72 items-center justify-center bg-slate-200 text-slate-400">
            {selectedBranch ? (
              <div className="text-center">
                <MapPin className="mx-auto size-10 text-red-600" />
                <p className="mt-4 font-semibold text-slate-500">{selectedBranch.branchName}</p>
              </div>
            ) : (
              <div className="text-center">
                <Map className="mx-auto size-10 text-slate-300" />
                <p className="mt-4 text-sm text-slate-400">Map View Placeholder</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <CreateVendorBranchModal
        open={isCreatingBranch}
        vendorSysId={vendorSysId}
        onOpenChange={setIsCreatingBranch}
      />
      <VendorBranchDetailModal
        open={viewingBranch !== null}
        vendorSysId={vendorSysId}
        branch={viewingBranch}
        onOpenChange={(open) => !open && setViewingBranch(null)}
      />
      <DeleteVendorBranchDialog
        branch={deletingBranch}
        deleteError={deleteError}
        isDeleting={isDeleting}
        onCancel={() => setDeletingBranch(null)}
        onConfirm={handleConfirmDelete}
      />
    </TooltipProvider>
  );
};

export default BranchesSection;
