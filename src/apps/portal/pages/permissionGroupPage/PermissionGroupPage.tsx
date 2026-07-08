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
interface PermissionGroup {
  permissionGroupSysId: string;
  permissionGroupName: string;
  permissionGroupDesc: string;
  createdOn: string;
  updatedOn: string;
}

// ── Dummy data ─────────────────────────────────────────────────────────
const DUMMY_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    permissionGroupSysId: 'PG-001',
    permissionGroupName: 'Dashboard Access',
    permissionGroupDesc: 'Grants read-only access to all dashboard views and analytics.',
    createdOn: '2026-01-05T08:00:00Z',
    updatedOn: '2026-06-20T14:30:00Z',
  },
  {
    permissionGroupSysId: 'PG-002',
    permissionGroupName: 'User Management',
    permissionGroupDesc: 'Full CRUD permissions for managing system users.',
    createdOn: '2026-02-10T10:15:00Z',
    updatedOn: '2026-05-18T09:45:00Z',
  },
  {
    permissionGroupSysId: 'PG-003',
    permissionGroupName: 'Audit & Compliance',
    permissionGroupDesc: 'Access to audit logs, compliance reports, and regulatory settings.',
    createdOn: '2026-03-01T12:00:00Z',
    updatedOn: '2026-07-01T16:00:00Z',
  },
  {
    permissionGroupSysId: 'PG-004',
    permissionGroupName: 'Vendor Operations',
    permissionGroupDesc: '',
    createdOn: '2026-04-22T07:30:00Z',
    updatedOn: '2026-04-22T07:30:00Z',
  },
];

// ── Component ──────────────────────────────────────────────────────────
const PermissionGroupPage = () => {
  const [data, setData] = useState<PermissionGroup[]>(DUMMY_PERMISSION_GROUPS);
  const [editingGroup, setEditingGroup] = useState<PermissionGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<PermissionGroup | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const handleEditClick = useCallback((group: PermissionGroup) => {
    setEditingGroup(group);
    setFormName(group.permissionGroupName);
    setFormDesc(group.permissionGroupDesc);
  }, []);

  const handleDeleteClick = useCallback((group: PermissionGroup) => {
    setDeletingGroup(group);
  }, []);

  const handleAddClick = () => {
    setIsAdding(true);
    setFormName('');
    setFormDesc('');
  };

  const handleSaveEdit = () => {
    if (!editingGroup) return;

    setData((prev) =>
      prev.map((item) =>
        item.permissionGroupSysId === editingGroup.permissionGroupSysId
          ? {
              ...item,
              permissionGroupName: formName,
              permissionGroupDesc: formDesc,
              updatedOn: new Date().toISOString(),
            }
          : item
      )
    );
    setEditingGroup(null);
  };

  const handleSaveAdd = () => {
    const nextNum = data.length > 0
      ? Math.max(...data.map(d => parseInt(d.permissionGroupSysId.split('-')[1], 10))) + 1
      : 1;
    const paddedNum = String(nextNum).padStart(3, '0');
    const newGroup: PermissionGroup = {
      permissionGroupSysId: `PG-${paddedNum}`,
      permissionGroupName: formName,
      permissionGroupDesc: formDesc,
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    };

    setData((prev) => [...prev, newGroup]);
    setIsAdding(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingGroup) return;
    setData((prev) => prev.filter((item) => item.permissionGroupSysId !== deletingGroup.permissionGroupSysId));
    setDeletingGroup(null);
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
    const columnHelper = createColumnHelper<PermissionGroup>();
    return [
      columnHelper.accessor('permissionGroupSysId', {
        header: 'Group ID',
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('permissionGroupName', {
        header: 'Group Name',
        cell: (info) => (
          <span className="font-semibold text-slate-800">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('permissionGroupDesc', {
        header: 'Description',
        cell: (info) => {
          const value = info.getValue();
          return (
            <span className="text-slate-500 text-sm">
              {value || <span className="italic text-slate-400">—</span>}
            </span>
          );
        },
      }),
      columnHelper.accessor('createdOn', {
        header: 'Created On',
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor('updatedOn', {
        header: 'Updated On',
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right pr-4">Actions</div>,
        cell: (info) => {
          const group = info.row.original;
          return (
            <div className="flex items-center justify-end gap-2 pr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleEditClick(group)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <Pencil className="size-4.5" />
                    <span className="sr-only">Edit Permission Group</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Edit Permission Group</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleDeleteClick(group)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <Trash2 className="size-4.5" />
                    <span className="sr-only">Delete Permission Group</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Delete Permission Group</TooltipContent>
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
              <h1 className="mt-2 text-3xl font-bold">Permission Groups</h1>
              <p className="mt-3 text-slate-600">
                Create, organise, and manage permission groups to bundle related permissions together.
              </p>
            </div>

            <Button className="shrink-0" onClick={handleAddClick}>
              <Plus data-icon="inline-start" className="size-4" />
              Add Group
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
                      No permission groups found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Add/Edit Form Dialog */}
        <Dialog
          open={editingGroup !== null || isAdding}
          onOpenChange={(open) => {
            if (!open) {
              setEditingGroup(null);
              setIsAdding(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isAdding ? 'Add Permission Group' : 'Edit Permission Group'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to {isAdding ? 'create a new' : 'modify this'} permission group.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Group Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                  placeholder="e.g. Dashboard Access"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Description <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium resize-none"
                  placeholder="Briefly describe what this permission group controls"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingGroup(null);
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
          open={deletingGroup !== null}
          onOpenChange={(open) => !open && setDeletingGroup(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <span className="font-semibold text-slate-950">{deletingGroup?.permissionGroupName}</span>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDeletingGroup(null)}>
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

export default PermissionGroupPage;
