import { useCallback, useMemo, useState } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/core-components/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/core-components/tooltip';
import AdminBreadcrumb from '@/apps/portal/components/AdminBreadcrumb/AdminBreadcrumb';
import AdminPageHeader from '@/apps/portal/components/AdminPageHeader/AdminPageHeader';
import AdminTableShell from '@/apps/portal/components/AdminTableShell/AdminTableShell';
import { ErrorState, LoadingState } from '@/apps/portal/components/PageStates/PageStates';
import StatusBadge from '@/apps/portal/components/StatusBadge/StatusBadge';
import DeleteVendorCustomerDialog from '@/apps/portal/components/VendorCustomerManagement/DeleteVendorCustomerDialog';
import VendorCustomerDetailModal from '@/apps/portal/components/VendorCustomerManagement/VendorCustomerDetailModal';
import VendorCustomerForm from '@/apps/portal/components/VendorCustomerForm/VendorCustomerForm';
import { ROUTES } from '@/core/routes/paths';
import { useVendorContext } from '@/features/vendors/useVendorContext';
import {
  useDeleteVendorCustomerMutation,
  useGetVendorCustomersQuery,
} from '@/features/vendorCustomers/api';
import type { VendorCustomer } from '@/features/vendorCustomers/types';

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') return data.message;
  }
  return 'Failed to delete customer';
};

const VendorCustomerManagementPage = () => {
  const { vendorId, hasVendorContext, vendor } = useVendorContext();
  const [page, setPage] = useState(0);
  const [viewingCustomer, setViewingCustomer] = useState<VendorCustomer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<VendorCustomer | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const pageSize = 10;
  const { data, isLoading, isError, error } = useGetVendorCustomersQuery({
    ...(hasVendorContext && vendorId ? { vendorSysId: vendorId } : {}),
    page,
    size: pageSize,
    sortBy: 'customerSysId',
    sortDir: 'asc',
  });
  const [deleteVendorCustomer, { isLoading: isDeleting }] = useDeleteVendorCustomerMutation();

  const handleDeleteClick = useCallback((customer: VendorCustomer) => {
    setDeleteError(null);
    setDeletingCustomer(customer);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deletingCustomer) return;
    setDeleteError(null);
    try {
      await deleteVendorCustomer(deletingCustomer.customerSysId).unwrap();
      setDeletingCustomer(null);
      if (data && data.content.length === 1 && page > 0) setPage((current) => current - 1);
    } catch (err: unknown) {
      setDeleteError(getErrorMessage(err));
    }
  };

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<VendorCustomer>();
    return [
      columnHelper.accessor('legalName', { header: 'Customer Name', cell: (info) => <span className="font-semibold text-slate-800">{info.getValue()}</span> }),
      columnHelper.accessor('customerType', { header: 'Type', cell: (info) => <span className="text-slate-600">{info.getValue() ?? '—'}</span> }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusBadge tone={info.getValue() === 'Active' ? 'active' : 'neutral'}>{info.getValue() ?? '—'}</StatusBadge>,
      }),
      columnHelper.accessor('nameShortCode', { header: 'Code', cell: (info) => <span className="font-mono text-xs font-bold text-slate-700">{info.getValue() ?? '—'}</span> }),
      columnHelper.accessor('city', { header: 'Location', cell: (info) => <span className="text-slate-600">{[info.row.original.city, info.row.original.state, info.row.original.country].filter(Boolean).join(', ') || '—'}</span> }),
      columnHelper.accessor('corporateEmail', { header: 'Email', cell: (info) => <span className="text-slate-600 text-sm">{info.getValue() ?? '—'}</span> }),
      columnHelper.accessor('corporatePhone', { header: 'Phone', cell: (info) => <span className="font-mono text-xs text-slate-600">{info.getValue() ?? '—'}</span> }),
      columnHelper.display({
        id: 'actions', header: () => <div className="text-right pr-4">Actions</div>,
        cell: (info) => <div className="flex items-center justify-end gap-2 pr-2">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" onClick={() => setViewingCustomer(info.row.original)} className="text-slate-500 hover:text-blue-600"><Pencil className="size-4.5" /><span className="sr-only">View/Edit Customer</span></Button></TooltipTrigger><TooltipContent side="right">View/Edit Customer</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" onClick={() => handleDeleteClick(info.row.original)} className="text-slate-500 hover:text-red-600"><Trash2 className="size-4.5" /><span className="sr-only">Delete Customer</span></Button></TooltipTrigger><TooltipContent side="right">Delete Customer</TooltipContent></Tooltip>
        </div>,
      }),
    ];
  }, [handleDeleteClick]);

  const table = useReactTable({ data: data?.content ?? [], columns, getCoreRowModel: getCoreRowModel() });

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <section className="w-full">
          {hasVendorContext && (
            <AdminBreadcrumb
              items={[
                { label: 'Platform Admin' },
                { label: 'Vendors', to: ROUTES.systemAdmin.vendors },
                { label: vendor?.vendorName ?? vendorId ?? '', to: ROUTES.systemAdmin.vendorDetail(vendorId ?? '') },
                { label: 'Customers' },
              ]}
            />
          )}

          <AdminPageHeader
            className={hasVendorContext ? 'mt-4' : ''}
            eyebrow={hasVendorContext ? 'Vendor Customers' : ""}
            title={<span>{vendor?.vendorName ? <strong>{vendor.vendorName} </strong> : 'Manage Vendor Customer'}</span>}
            description={<span>Onboard, manage, and configure details of {vendor?.vendorName ? <strong>{vendor.vendorName} customers</strong> : 'vendor customers and corporate entities'}.</span>}
            action={(
              <Button size="lg" className="shrink-0 px-4" onClick={() => setIsAdding(true)}>
                <Plus data-icon="inline-start" className="size-4" />
                Add Customer
              </Button>
            )}
          />

          {!isLoading && !isError && (
            <AdminTableShell className="mt-8">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-slate-100/70">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                        No customers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </AdminTableShell>
          )}

          {isLoading && <LoadingState label="Loading customers..." />}
          {isError && <ErrorState title="Failed to load customers" message={getErrorMessage(error)} />}

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

        <VendorCustomerForm mode="create" open={isAdding} vendorSysId={vendorId} onOpenChange={setIsAdding} />
        <VendorCustomerDetailModal
          open={viewingCustomer !== null}
          customer={viewingCustomer}
          onOpenChange={(open) => !open && setViewingCustomer(null)}
        />
        <DeleteVendorCustomerDialog
          customer={deletingCustomer}
          deleteError={deleteError}
          isDeleting={isDeleting}
          onCancel={() => setDeletingCustomer(null)}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </TooltipProvider>
  );
};

export default VendorCustomerManagementPage;
