import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AlertCircle, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/core-components/breadcrumb/breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/core-components/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/core-components/tooltip';
import DeleteVendorCustomerDialog from '@/apps/portal/components/VendorCustomerManagement/DeleteVendorCustomerDialog';
import VendorCustomerForm from '@/apps/portal/components/VendorCustomerForm/VendorCustomerForm';
import { ROUTES } from '@/core/routes/paths';
import { useVendorContext } from '@/features/vendors/useVendorContext';
import {
  useDeleteVendorCustomerMutation,
  useGetVendorCustomersByVendorQuery,
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
  const [editingCustomer, setEditingCustomer] = useState<VendorCustomer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<VendorCustomer | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const pageSize = 10;
  const customersQuery = useGetVendorCustomersQuery(
    { page, size: pageSize, sortBy: 'customerSysId', sortDir: 'asc' },
    { skip: hasVendorContext },
  );
  const vendorCustomersQuery = useGetVendorCustomersByVendorQuery(
    { vendorSysId: vendorId ?? '', page, size: pageSize, sortBy: 'customerSysId', sortDir: 'asc' },
    { skip: !hasVendorContext },
  );
  const { data, isLoading, isError, error } = hasVendorContext ? vendorCustomersQuery : customersQuery;
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
      columnHelper.accessor('customerLegalName', { header: 'Customer Name', cell: (info) => <span className="font-semibold text-slate-800">{info.getValue()}</span> }),
      columnHelper.accessor('customerType', { header: 'Type', cell: (info) => <span className="text-slate-600">{info.getValue() ?? '—'}</span> }),
      columnHelper.accessor('customerStatus', { header: 'Status', cell: (info) => <span className="text-slate-600">{info.getValue() ?? '—'}</span> }),
      columnHelper.accessor('corporateNameCodeShort', { header: 'Code', cell: (info) => <span className="font-mono text-xs font-bold text-slate-700">{info.getValue() ?? '—'}</span> }),
      columnHelper.accessor('corporateCity', { header: 'Location', cell: (info) => <span className="text-slate-600">{[info.row.original.corporateCity, info.row.original.corporateState, info.row.original.country].filter(Boolean).join(', ') || '—'}</span> }),
      columnHelper.accessor('corporateEmail', { header: 'Email', cell: (info) => <span className="text-slate-600 text-sm">{info.getValue() ?? '—'}</span> }),
      columnHelper.accessor('corporatePhone', { header: 'Phone', cell: (info) => <span className="font-mono text-xs text-slate-600">{info.getValue() ?? '—'}</span> }),
      columnHelper.display({
        id: 'actions', header: () => <div className="text-right pr-4">Actions</div>,
        cell: (info) => <div className="flex items-center justify-end gap-2 pr-2">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" onClick={() => setEditingCustomer(info.row.original)} className="text-slate-500 hover:text-blue-600"><Pencil className="size-4.5" /><span className="sr-only">Edit Customer</span></Button></TooltipTrigger><TooltipContent side="right">Edit Customer</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" onClick={() => handleDeleteClick(info.row.original)} className="text-slate-500 hover:text-red-600"><Trash2 className="size-4.5" /><span className="sr-only">Delete Customer</span></Button></TooltipTrigger><TooltipContent side="right">Delete Customer</TooltipContent></Tooltip>
        </div>,
      }),
    ];
  }, [handleDeleteClick]);

  const table = useReactTable({ data: data?.content ?? [], columns, getCoreRowModel: getCoreRowModel() });

  return <TooltipProvider><main className="min-h-screen bg-slate-50 p-8 text-slate-900"><section className="w-full">
    {hasVendorContext && <Breadcrumb><BreadcrumbList className="text-xs"><BreadcrumbItem>Platform Admin</BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink asChild><Link to={ROUTES.systemAdmin.vendors}>Vendors</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink asChild><Link to={ROUTES.systemAdmin.vendorDetail(vendorId ?? '')}>{vendor?.vendorName ?? vendorId}</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage className="font-bold text-blue-800">Customers</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>}
    <div className="flex items-start justify-between"><div><p className={`text-sm font-semibold uppercase tracking-wide text-blue-600 ${hasVendorContext ? 'mt-4' : ''}`}>System Administration</p><h1 className="mt-2 text-3xl font-bold">Manage Vendor Customer</h1><p className="mt-3 text-slate-600">Onboard, manage, and configure details of {vendor?.vendorName ? `${vendor.vendorName} customers` : 'vendor customers and corporate entities'}.</p></div><Button size="lg" className="shrink-0 px-4" onClick={() => setIsAdding(true)}><Plus data-icon="inline-start" className="size-4" />Add Customer</Button></div>
    {!isLoading && !isError && <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"><Table><TableHeader>{table.getHeaderGroups().map((headerGroup) => <TableRow key={headerGroup.id} className="bg-slate-100/70">{headerGroup.headers.map((header) => <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>)}</TableRow>)}</TableHeader><TableBody>{table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => <TableRow key={row.id}>{row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>) : <TableRow><TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">No customers found.</TableCell></TableRow>}</TableBody></Table></div>}
    {isLoading && <div className="mt-8 flex items-center justify-center p-12 bg-white border border-slate-200 rounded-xl shadow-sm min-h-[300px]"><Loader2 className="animate-spin text-blue-600 size-8 mr-3" /><span className="text-slate-600 font-medium text-lg">Loading customers...</span></div>}
    {isError && <div className="mt-8 flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl"><AlertCircle className="size-5 shrink-0" /><div><p className="font-semibold">Failed to load customers</p><p className="text-sm opacity-90">{getErrorMessage(error)}</p></div></div>}
    {data && data.totalPages > 1 && <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm"><div className="text-sm text-slate-600">Showing page <span className="font-semibold">{data.pageNumber + 1}</span> of <span className="font-semibold">{data.totalPages}</span></div><div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={data.pageNumber === 0}>Previous</Button><Button variant="outline" size="sm" onClick={() => setPage((current) => current + 1)} disabled={data.last || data.pageNumber + 1 >= data.totalPages}>Next</Button></div></div>}
  </section>
    <VendorCustomerForm mode="create" open={isAdding} vendorSysId={vendorId} onOpenChange={setIsAdding} />
    <VendorCustomerForm mode="edit" open={editingCustomer !== null} customer={editingCustomer} vendorSysId={vendorId} onOpenChange={(open) => !open && setEditingCustomer(null)} />
    <DeleteVendorCustomerDialog customer={deletingCustomer} deleteError={deleteError} isDeleting={isDeleting} onCancel={() => setDeletingCustomer(null)} onConfirm={handleConfirmDelete} />
  </main></TooltipProvider>;
};

export default VendorCustomerManagementPage;
