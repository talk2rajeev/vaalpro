import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import { TooltipProvider } from '@/components/core-components/tooltip';
import AdminBreadcrumb from '@/apps/portal/components/AdminBreadcrumb/AdminBreadcrumb';
import AdminPageHeader from '@/apps/portal/components/AdminPageHeader/AdminPageHeader';
import DeleteVendorEmployeeDialog from '@/apps/portal/components/VendorEmployeeManagement/DeleteVendorEmployeeDialog';
import { ErrorState, LoadingState } from '@/apps/portal/components/PageStates/PageStates';
import VendorEmployeeForm from '@/apps/portal/components/VendorEmployeeManagement/VendorEmployeeForm';
import VendorEmployeeTable from '@/apps/portal/components/VendorEmployeeManagement/VendorEmployeeTable';
import { ROUTES } from '@/core/routes/paths';
import { useGetVendorsQuery } from '@/features/vendors/api';
import { useVendorContext } from '@/features/vendors/useVendorContext';
import {
  useDeleteVendorEmployeeMutation,
  useGetVendorEmployeesQuery,
} from '@/features/vendorEmployees/api';
import type { VendorEmployee } from '@/features/vendorEmployees/types';

const pageSize = 10;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }

  return fallback;
};

const VendorEmployeeManagementPage = () => {
  const {
    vendorId,
    hasVendorContext,
    vendor: routeVendor,
    isLoading: isLoadingRouteVendor,
    isError: isRouteVendorError,
    error: routeVendorError,
  } = useVendorContext();
  const [page, setPage] = useState(0);
  const [selectedVendorSysId, setSelectedVendorSysId] = useState(vendorId ?? '');
  const [editingEmployee, setEditingEmployee] = useState<VendorEmployee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<VendorEmployee | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: vendorsData,
    isLoading: isLoadingVendors,
    isError: isVendorError,
    error: vendorError,
  } = useGetVendorsQuery(
    { page: 0, size: 100, sortBy: 'vendorName', sortDir: 'asc' },
    { skip: hasVendorContext },
  );
  const selectedVendor = useMemo(
    () => routeVendor ?? vendorsData?.content.find((vendor) => vendor.vendorSysId === selectedVendorSysId) ?? null,
    [routeVendor, selectedVendorSysId, vendorsData],
  );

  useEffect(() => {
    if (vendorId) {
      setSelectedVendorSysId(vendorId);
      return;
    }

    if (!selectedVendorSysId && vendorsData?.content.length) {
      setSelectedVendorSysId(vendorsData.content[0].vendorSysId);
    }
  }, [vendorId, selectedVendorSysId, vendorsData]);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetVendorEmployeesQuery(
    { vendorSysId: selectedVendorSysId, page, size: pageSize, sortBy: 'empSysId', sortDir: 'asc' },
    { skip: !selectedVendorSysId },
  );
  const [deleteVendorEmployee, { isLoading: isDeleting }] = useDeleteVendorEmployeeMutation();

  const handleDeleteClick = useCallback((employee: VendorEmployee) => {
    setDeleteError(null);
    setDeletingEmployee(employee);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deletingEmployee) return;
    setDeleteError(null);

    try {
      await deleteVendorEmployee({
        vendorSysId: deletingEmployee.vendorSysId,
        empSysId: deletingEmployee.empSysId,
      }).unwrap();
      setDeletingEmployee(null);
      if (data && data.content.length === 1 && page > 0) setPage((current) => current - 1);
    } catch (err: unknown) {
      setDeleteError(getErrorMessage(err, 'Failed to delete vendor employee.'));
    }
  };

  const canManageEmployees = Boolean(selectedVendorSysId);

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <section className="w-full">
          {hasVendorContext && (
            <AdminBreadcrumb
              items={[
                { label: 'Platform Admin' },
                { label: 'Vendors', to: ROUTES.systemAdmin.vendors },
                { label: selectedVendor?.vendorName ?? vendorId ?? '', to: ROUTES.systemAdmin.vendorDetail(vendorId ?? '') },
                { label: 'Employees' },
              ]}
            />
          )}

          <AdminPageHeader
            className={hasVendorContext ? 'mt-4' : ''}
            eyebrow={hasVendorContext ? 'Vendor Employees' : ''}
            title={<span>{selectedVendor?.vendorName ? <strong>{selectedVendor.vendorName} </strong> : 'Manage Vendor Employees'}</span>}
            description={<span>Manage <strong>{selectedVendor?.vendorName}</strong> employee accounts, role assignments, and access controls across the platform.</span>}
            action={(
              <Button
                size="lg"
                className="shrink-0 px-4"
                onClick={() => setIsAdding(true)}
                disabled={!canManageEmployees}
              >
                <Plus data-icon="inline-start" className="size-4" />
                Add Employee
              </Button>
            )}
          />

          {(isLoadingVendors || isLoadingRouteVendor) && <LoadingState label="Loading vendors..." />}
          {(isVendorError || isRouteVendorError) && (
            <ErrorState
              title="Failed to load vendors"
              message={getErrorMessage(vendorError ?? routeVendorError, 'Failed to load vendors.')}
            />
          )}

          {!isLoadingVendors && !isLoadingRouteVendor && !isVendorError && !isRouteVendorError && !selectedVendorSysId && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
              Select a vendor to manage employees.
            </div>
          )}

          {selectedVendorSysId && !isLoading && !isError && (
            <VendorEmployeeTable
              employees={data?.content ?? []}
              onEdit={setEditingEmployee}
              onDelete={handleDeleteClick}
            />
          )}

          {selectedVendorSysId && isLoading && <LoadingState label="Loading vendor employees..." />}
          {selectedVendorSysId && isError && (
            <ErrorState title="Failed to load vendor employees" message={getErrorMessage(error, 'Failed to load vendor employees.')} />
          )}

          {data && data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-sm text-slate-600">
                Showing page <span className="font-semibold">{data.pageNumber + 1}</span> of{' '}
                <span className="font-semibold">{data.totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                  disabled={data.pageNumber === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={data.last || data.pageNumber + 1 >= data.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </section>

        <VendorEmployeeForm
          mode="create"
          open={isAdding}
          vendor={selectedVendor}
          onOpenChange={setIsAdding}
        />
        <VendorEmployeeForm
          mode="edit"
          open={editingEmployee !== null}
          employee={editingEmployee}
          vendor={selectedVendor}
          onOpenChange={(open) => !open && setEditingEmployee(null)}
        />
        <DeleteVendorEmployeeDialog
          employee={deletingEmployee}
          deleteError={deleteError}
          isDeleting={isDeleting}
          onCancel={() => setDeletingEmployee(null)}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </TooltipProvider>
  );
};

export default VendorEmployeeManagementPage;
