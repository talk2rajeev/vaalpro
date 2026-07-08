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
import { Plus, Pencil, Trash2 } from 'lucide-react';
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

// ── Types ──────────────────────────────────────────────────────────────
interface Subscription {
  subscriptionId: string;
  vendorId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  licensedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ── Dummy data ─────────────────────────────────────────────────────────
const DUMMY_SUBSCRIPTIONS: Subscription[] = [
  {
    subscriptionId: 'SUB-001',
    vendorId: 'VND-201',
    status: 'ACTIVE',
    licensedAt: '2026-01-10T08:00:00Z',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-06-15T10:30:00Z',
  },
  {
    subscriptionId: 'SUB-002',
    vendorId: 'VND-342',
    status: 'ACTIVE',
    licensedAt: '2026-02-15T09:00:00Z',
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-02-15T09:00:00Z',
  },
  {
    subscriptionId: 'SUB-003',
    vendorId: 'VND-115',
    status: 'EXPIRED',
    licensedAt: '2025-06-01T12:00:00Z',
    createdAt: '2025-06-01T12:00:00Z',
    updatedAt: '2026-06-01T12:00:00Z',
  },
  {
    subscriptionId: 'SUB-004',
    vendorId: 'VND-889',
    status: 'PENDING',
    licensedAt: '2026-07-01T14:00:00Z',
    createdAt: '2026-07-01T14:00:00Z',
    updatedAt: '2026-07-01T14:00:00Z',
  },
];

// ── Component ──────────────────────────────────────────────────────────
const SubscriptionManagementPage = () => {
  const [data, setData] = useState<Subscription[]>(DUMMY_SUBSCRIPTIONS);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [formVendorId, setFormVendorId] = useState('');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'EXPIRED' | 'PENDING'>('ACTIVE');
  const [formLicensedAt, setFormLicensedAt] = useState('');

  const handleEditClick = useCallback((sub: Subscription) => {
    setEditingSubscription(sub);
    setFormVendorId(sub.vendorId);
    setFormStatus(sub.status);
    setFormLicensedAt(sub.licensedAt.split('T')[0]);
  }, []);

  const handleDeleteClick = useCallback((sub: Subscription) => {
    setDeletingSubscription(sub);
  }, []);

  const handleAddClick = () => {
    setIsAdding(true);
    setFormVendorId('');
    setFormStatus('ACTIVE');
    setFormLicensedAt(new Date().toISOString().split('T')[0]);
  };

  const handleSaveEdit = () => {
    if (!editingSubscription) return;

    setData((prev) =>
      prev.map((item) =>
        item.subscriptionId === editingSubscription.subscriptionId
          ? {
              ...item,
              vendorId: formVendorId,
              status: formStatus,
              licensedAt: new Date(formLicensedAt).toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
    setEditingSubscription(null);
  };

  const handleSaveAdd = () => {
    const nextNum = data.length > 0 
      ? Math.max(...data.map(d => parseInt(d.subscriptionId.split('-')[1], 10))) + 1 
      : 1;
    const paddedNum = String(nextNum).padStart(3, '0');
    const newSub: Subscription = {
      subscriptionId: `SUB-${paddedNum}`,
      vendorId: formVendorId || `VND-${Math.floor(100 + Math.random() * 900)}`,
      status: formStatus,
      licensedAt: new Date(formLicensedAt).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setData((prev) => [...prev, newSub]);
    setIsAdding(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingSubscription) return;
    setData((prev) => prev.filter((item) => item.subscriptionId !== deletingSubscription.subscriptionId));
    setDeletingSubscription(null);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // ── Column definitions ─────────────────────────────────────────────────
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Subscription>();
    return [
      columnHelper.accessor('subscriptionId', {
        header: 'Subscription ID',
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('vendorId', {
        header: 'Vendor ID',
        cell: (info) => (
          <span className="font-semibold text-slate-800">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          let badgeClass = 'bg-slate-50 text-slate-700 border-slate-200';
          if (status === 'ACTIVE') {
            badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          } else if (status === 'EXPIRED') {
            badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
          } else if (status === 'PENDING') {
            badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
          }
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
              {status}
            </span>
          );
        },
      }),
      columnHelper.accessor('licensedAt', {
        header: 'Licensed At',
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created Date',
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Updated Date',
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right pr-4">Actions</div>,
        cell: (info) => {
          const sub = info.row.original;
          return (
            <div className="flex items-center justify-end gap-2 pr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleEditClick(sub)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <Pencil className="size-4.5" />
                    <span className="sr-only">Edit Subscription</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Edit Subscription</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleDeleteClick(sub)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <Trash2 className="size-4.5" />
                    <span className="sr-only">Delete Subscription</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Delete Subscription</TooltipContent>
              </Tooltip>
            </div>
          );
        },
      }),
    ];
  }, [handleEditClick, handleDeleteClick]);

  const table = useReactTable({
    data,
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
              <h1 className="mt-2 text-3xl font-bold">Subscription Management</h1>
              <p className="mt-3 text-slate-600">
                Manage, audit, and configure vendor licenses, active subscriptions, and renewal dates.
              </p>
            </div>

            <Button className="shrink-0" onClick={handleAddClick}>
              <Plus data-icon="inline-start" className="size-4" />
              Add Subscription
            </Button>
          </div>

          {/* Table */}
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
                      No subscriptions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Add/Edit Form Dialog */}
        <Dialog 
          open={editingSubscription !== null || isAdding} 
          onOpenChange={(open) => {
            if (!open) {
              setEditingSubscription(null);
              setIsAdding(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isAdding ? 'Add Subscription' : 'Edit Subscription'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to {isAdding ? 'create a new' : 'modify this'} subscription.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Vendor ID
                </label>
                <input
                  type="text"
                  value={formVendorId}
                  onChange={(e) => setFormVendorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                  placeholder="e.g. VND-201"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'ACTIVE' | 'EXPIRED' | 'PENDING')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="EXPIRED">EXPIRED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Licensed At
                </label>
                <input
                  type="date"
                  value={formLicensedAt}
                  onChange={(e) => setFormLicensedAt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingSubscription(null);
                  setIsAdding(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={isAdding ? handleSaveAdd : handleSaveEdit}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deletingSubscription !== null} 
          onOpenChange={(open) => !open && setDeletingSubscription(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the subscription for <span className="font-semibold text-slate-950">{deletingSubscription?.vendorId}</span>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDeletingSubscription(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </TooltipProvider>
  );
};

export default SubscriptionManagementPage;
