import { useCallback, useMemo, useState } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AlertCircle, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/core-components/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/core-components/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/core-components/tooltip';
import VendorForm from '@/apps/portal/components/VendorForm/VendorForm';
import { useDeleteVendorMutation, useGetVendorsQuery } from '@/features/vendors/vendorApi';
import type { Vendor } from '@/features/vendors/vendorTypes';

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') return data.message;
  }
  return 'Failed to delete vendor';
};

const VendorManagementPage = () => {
  const [page, setPage] = useState(0);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deletingVendor, setDeletingVendor] = useState<Vendor | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const pageSize = 10;
  const { data, isLoading, isError, error } = useGetVendorsQuery({ page, size: pageSize, sortBy: 'vendorSysId', sortDir: 'asc' });
  const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorMutation();

  const handleDeleteClick = useCallback((vendor: Vendor) => {
    setDeleteError(null);
    setDeletingVendor(vendor);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deletingVendor) return;
    setDeleteError(null);
    try {
      await deleteVendor(deletingVendor.vendorSysId).unwrap();
      setDeletingVendor(null);
      if (data && data.content.length === 1 && page > 0) setPage((current) => current - 1);
    } catch (err: unknown) {
      setDeleteError(getErrorMessage(err));
    }
  };

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Vendor>();
    return [
      columnHelper.accessor('logoUrl', {
        header: 'Logo',
        cell: (info) => info.getValue() ? <img src={info.getValue()} alt="Logo" className="size-8 rounded-full object-cover border border-slate-200" onError={(event) => { (event.target as HTMLElement).style.display = 'none'; }} /> : <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-xs font-bold text-slate-500">V</div>,
      }),
      columnHelper.accessor('vendorCode', { header: 'Vendor Code', cell: (info) => <span className="font-mono text-xs font-bold text-slate-700">{info.getValue()}</span> }),
      columnHelper.accessor('vendorName', { header: 'Vendor Name', cell: (info) => <span className="font-semibold text-slate-800">{info.getValue()}</span> }),
      columnHelper.accessor('city', { header: 'Location', cell: (info) => <span className="text-slate-600">{info.row.original.city}, {info.row.original.state}, {info.row.original.country}</span> }),
      columnHelper.accessor('gstNumber', { header: 'GST Number', cell: (info) => <span className="font-mono text-xs text-slate-600">{info.getValue()}</span> }),
      columnHelper.accessor('panNumber', { header: 'PAN Number', cell: (info) => <span className="font-mono text-xs text-slate-600">{info.getValue()}</span> }),
      columnHelper.accessor('yearEstablished', { header: 'Est. Year', cell: (info) => <span className="text-slate-600">{info.getValue()}</span> }),
      columnHelper.display({
        id: 'actions', header: () => <div className="text-right pr-4">Actions</div>,
        cell: (info) => <div className="flex items-center justify-end gap-2 pr-2">
          <Tooltip><TooltipTrigger asChild><button onClick={() => setEditingVendor(info.row.original)} className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"><Pencil className="size-4.5" /><span className="sr-only">Edit Vendor</span></button></TooltipTrigger><TooltipContent side="right">Edit Vendor</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><button onClick={() => handleDeleteClick(info.row.original)} className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"><Trash2 className="size-4.5" /><span className="sr-only">Delete Vendor</span></button></TooltipTrigger><TooltipContent side="right">Delete Vendor</TooltipContent></Tooltip>
        </div>,
      }),
    ];
  }, [handleDeleteClick]);

  const table = useReactTable({ data: data?.content ?? [], columns, getCoreRowModel: getCoreRowModel() });

  return <TooltipProvider><main className="min-h-screen bg-slate-50 p-8 text-slate-900"><section className="w-full">
    <div className="flex items-start justify-between"><div><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">System Administration</p><h1 className="mt-2 text-3xl font-bold">Vendor Management</h1><p className="mt-3 text-slate-600">Onboard, manage, and configure details of system vendors and pharmaceutical companies.</p></div><Button className="shrink-0" onClick={() => setIsAdding(true)}><Plus data-icon="inline-start" className="size-4" />Add Vendor</Button></div>
    {!isLoading && !isError && <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"><Table><TableHeader>{table.getHeaderGroups().map((headerGroup) => <TableRow key={headerGroup.id} className="bg-slate-100/70">{headerGroup.headers.map((header) => <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>)}</TableRow>)}</TableHeader><TableBody>{table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => <TableRow key={row.id}>{row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>) : <TableRow><TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">No vendors found.</TableCell></TableRow>}</TableBody></Table></div>}
    {isLoading && <div className="mt-8 flex items-center justify-center p-12 bg-white border border-slate-200 rounded-xl shadow-sm min-h-[300px]"><Loader2 className="animate-spin text-blue-600 size-8 mr-3" /><span className="text-slate-600 font-medium text-lg">Loading vendors...</span></div>}
    {isError && <div className="mt-8 flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl"><AlertCircle className="size-5 shrink-0" /><div><p className="font-semibold">Failed to load vendors</p><p className="text-sm opacity-90">{getErrorMessage(error)}</p></div></div>}
    {data && data.totalPages > 1 && <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm"><div className="text-sm text-slate-600">Showing page <span className="font-semibold">{data.pageNumber + 1}</span> of <span className="font-semibold">{data.totalPages}</span></div><div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={data.pageNumber === 0}>Previous</Button><Button variant="outline" size="sm" onClick={() => setPage((current) => current + 1)} disabled={data.last || data.pageNumber + 1 >= data.totalPages}>Next</Button></div></div>}
  </section>
  <VendorForm mode="create" open={isAdding} onOpenChange={setIsAdding} />
  <VendorForm mode="edit" open={editingVendor !== null} vendor={editingVendor} onOpenChange={(open) => !open && setEditingVendor(null)} />
  <DeleteVendorDialog vendor={deletingVendor} deleteError={deleteError} isDeleting={isDeleting} onCancel={() => setDeletingVendor(null)} onConfirm={handleConfirmDelete} />
  </main></TooltipProvider>;
};

interface DeleteVendorDialogProps { vendor: Vendor | null; deleteError: string | null; isDeleting: boolean; onCancel: () => void; onConfirm: () => void; }
const DeleteVendorDialog = ({ vendor, deleteError, isDeleting, onCancel, onConfirm }: DeleteVendorDialogProps) => {
  return <Dialog open={vendor !== null} onOpenChange={(open: boolean) => !open && onCancel()}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Confirm Delete</DialogTitle><DialogDescription>Are you sure you want to delete <span className="font-semibold text-slate-950">{vendor?.vendorName}</span>? This action is permanent.</DialogDescription></DialogHeader>{deleteError && <div className="mt-2 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"><AlertCircle className="size-4 shrink-0" /><span>{deleteError}</span></div>}<DialogFooter className="mt-4"><Button variant="outline" onClick={onCancel} disabled={isDeleting}>Cancel</Button><Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>{isDeleting ? <><Loader2 className="animate-spin size-4 mr-2" />Deleting...</> : 'Delete'}</Button></DialogFooter></DialogContent></Dialog>;
};

export default VendorManagementPage;
