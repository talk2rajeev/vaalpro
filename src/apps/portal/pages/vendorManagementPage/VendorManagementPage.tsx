import { useMemo, useState, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/core-components/table';
import { Button } from '@/components/core-components/button';
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/core-components/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/core-components/dialog';
import {
  useGetVendorsQuery,
  useDeleteVendorMutation,
} from '@/features/vendors/vendorApi';
import type { Vendor } from '@/features/vendors/vendorTypes';

// ── Component ──────────────────────────────────────────────────────────
const VendorManagementPage = () => {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading, isError, error } = useGetVendorsQuery({
    page,
    size: pageSize,
    sortBy: 'vendorSysId',
    sortDir: 'asc',
  });

  const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorMutation();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deletingVendor, setDeletingVendor] = useState<Vendor | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states (matching curl schema)
  const [formVendorCode, setFormVendorCode] = useState('');
  const [formVendorName, setFormVendorName] = useState('');
  const [formAddressLine1, setFormAddressLine1] = useState('');
  const [formAddressLine2, setFormAddressLine2] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formPostalCode, setFormPostalCode] = useState('');
  const [formCountry, setFormCountry] = useState('');
  const [formGstNumber, setFormGstNumber] = useState('');
  const [formPanNumber, setFormPanNumber] = useState('');
  const [formYearEstablished, setFormYearEstablished] = useState<number>(2010);
  const [formLogoUrl, setFormLogoUrl] = useState('');

  const handleEditClick = useCallback((vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormVendorCode(vendor.vendorCode);
    setFormVendorName(vendor.vendorName);
    setFormAddressLine1(vendor.addressLine1);
    setFormAddressLine2(vendor.addressLine2 || '');
    setFormCity(vendor.city);
    setFormState(vendor.state);
    setFormPostalCode(vendor.postalCode);
    setFormCountry(vendor.country);
    setFormGstNumber(vendor.gstNumber);
    setFormPanNumber(vendor.panNumber);
    setFormYearEstablished(vendor.yearEstablished);
    setFormLogoUrl(vendor.logoUrl || '');
  }, []);

  const handleDeleteClick = useCallback((vendor: Vendor) => {
    setDeleteError(null);
    setDeletingVendor(vendor);
  }, []);

  const handleAddClick = () => {
    setIsAdding(true);
    setFormVendorCode('');
    setFormVendorName('');
    setFormAddressLine1('');
    setFormAddressLine2('');
    setFormCity('');
    setFormState('');
    setFormPostalCode('');
    setFormCountry('');
    setFormGstNumber('');
    setFormPanNumber('');
    setFormYearEstablished(2010);
    setFormLogoUrl('');
  };

  const handleSaveEdit = () => {
    // Stub for Phase 3
    setEditingVendor(null);
  };

  const handleSaveAdd = () => {
    // Stub for Phase 3
    setIsAdding(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingVendor) return;
    setDeleteError(null);
    try {
      await deleteVendor(deletingVendor.vendorSysId).unwrap();
      setDeletingVendor(null);

      // If we deleted the last item on the page and we're not on the first page, go back a page
      if (data && data.content.length === 1 && page > 0) {
        setPage((p) => p - 1);
      }
    } catch (err: any) {
      setDeleteError(err?.data?.message || 'Failed to delete vendor');
    }
  };

  // ── Column definitions ─────────────────────────────────────────────────
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Vendor>();
    return [
      columnHelper.accessor('logoUrl', {
        header: 'Logo',
        cell: (info) => {
          const url = info.getValue();
          return url ? (
            <img
              src={url}
              alt="Logo"
              className="size-8 rounded-full object-cover border border-slate-200"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-xs font-bold text-slate-500">
              V
            </div>
          );
        },
      }),
      columnHelper.accessor('vendorCode', {
        header: 'Vendor Code',
        cell: (info) => (
          <span className="font-mono text-xs font-bold text-slate-700">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('vendorName', {
        header: 'Vendor Name',
        cell: (info) => (
          <span className="font-semibold text-slate-800">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('city', {
        header: 'Location',
        cell: (info) => {
          const row = info.row.original;
          return (
            <span className="text-slate-600">
              {row.city}, {row.state}, {row.country}
            </span>
          );
        },
      }),
      columnHelper.accessor('gstNumber', {
        header: 'GST Number',
        cell: (info) => (
          <span className="font-mono text-xs text-slate-600">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('panNumber', {
        header: 'PAN Number',
        cell: (info) => (
          <span className="font-mono text-xs text-slate-600">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('yearEstablished', {
        header: 'Est. Year',
        cell: (info) => (
          <span className="text-slate-600">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right pr-4">Actions</div>,
        cell: (info) => {
          const vendor = info.row.original;
          return (
            <div className="flex items-center justify-end gap-2 pr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleEditClick(vendor)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <Pencil className="size-4.5" />
                    <span className="sr-only">Edit Vendor</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Edit Vendor</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleDeleteClick(vendor)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <Trash2 className="size-4.5" />
                    <span className="sr-only">Delete Vendor</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Delete Vendor</TooltipContent>
              </Tooltip>
            </div>
          );
        },
      }),
    ];
  }, [handleEditClick, handleDeleteClick]);

  const vendorsList = useMemo(() => data?.content ?? [], [data]);

  const table = useReactTable({
    data: vendorsList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <section className="w-full">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                System Administration
              </p>
              <h1 className="mt-2 text-3xl font-bold">Vendor Management</h1>
              <p className="mt-3 text-slate-600">
                Onboard, manage, and configure details of system vendors and pharmaceutical companies.
              </p>
            </div>

            <Button className="shrink-0" onClick={handleAddClick}>
              <Plus data-icon="inline-start" className="size-4" />
              Add Vendor
            </Button>
          </div>

          {/* Table Container */}
          {!isLoading && !isError && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-slate-100/70">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
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
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No vendors found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="mt-8 flex items-center justify-center p-12 bg-white border border-slate-200 rounded-xl shadow-sm min-h-[300px]">
              <Loader2 className="animate-spin text-blue-600 size-8 mr-3" />
              <span className="text-slate-600 font-medium text-lg">Loading vendors...</span>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="mt-8 flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              <AlertCircle className="size-5 shrink-0" />
              <div>
                <p className="font-semibold">Failed to load vendors</p>
                <p className="text-sm opacity-90">{(error as any)?.data?.message || 'An unexpected error occurred.'}</p>
              </div>
            </div>
          )}

          {/* Pagination Bar */}
          {data && data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="text-sm text-slate-600">
                Showing page <span className="font-semibold">{data.pageNumber + 1}</span> of <span className="font-semibold">{data.totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={data.pageNumber === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={data.last || data.pageNumber + 1 >= data.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Add/Edit Form Dialog */}
        <Dialog
          open={editingVendor !== null || isAdding}
          onOpenChange={(open) => {
            if (!open) {
              setEditingVendor(null);
              setIsAdding(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-6xl max-h-[85vh] p-0 flex flex-col">
            <div className="p-6 pb-2">
              <DialogHeader>
                <DialogTitle>
                  {isAdding ? 'Add Vendor' : 'Edit Vendor'}
                </DialogTitle>
                <DialogDescription>
                  Provide details for the {isAdding ? 'new' : 'existing'} vendor account.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 border-y border-slate-100">
              <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    value={formVendorName}
                    onChange={(e) => setFormVendorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. Acme Corporation"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Vendor Code
                  </label>
                  <input
                    type="text"
                    value={formVendorCode}
                    onChange={(e) => setFormVendorCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. VENDOR001"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Est. Year
                  </label>
                  <input
                    type="number"
                    value={formYearEstablished}
                    onChange={(e) => setFormYearEstablished(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. 2010"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={formAddressLine1}
                    onChange={(e) => setFormAddressLine1(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. 123 Main Street"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={formAddressLine2}
                    onChange={(e) => setFormAddressLine2(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. Suite 100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. New York"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    State
                  </label>
                  <input
                    type="text"
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. NY"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formPostalCode}
                    onChange={(e) => setFormPostalCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. 10001"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. USA"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={formGstNumber}
                    onChange={(e) => setFormGstNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. 29ABCDE1234F1Z5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={formPanNumber}
                    onChange={(e) => setFormPanNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. ABCDE1234F"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Logo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formLogoUrl}
                    onChange={(e) => setFormLogoUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                    placeholder="e.g. https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 pt-4">
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingVendor(null);
                    setIsAdding(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={isAdding ? handleSaveAdd : handleSaveEdit}>
                  Save
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deletingVendor !== null}
          onOpenChange={(open) => !open && setDeletingVendor(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <span className="font-semibold text-slate-950">{deletingVendor?.vendorName}</span>? This action is permanent.
              </DialogDescription>
            </DialogHeader>

            {deleteError && (
              <div className="mt-2 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                <AlertCircle className="size-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDeletingVendor(null)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin size-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </TooltipProvider>
  );
};

export default VendorManagementPage;
