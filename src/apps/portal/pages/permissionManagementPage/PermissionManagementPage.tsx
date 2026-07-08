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

interface Permission {
  permissionSysId: string;
  permissionGroup: PermissionGroup;
  permission: string;
  createdOn: string;
  updatedOn: string;
}

// ── Dummy permission groups (shared reference) ─────────────────────────
const PERMISSION_GROUPS: PermissionGroup[] = [
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

// ── Dummy permissions ──────────────────────────────────────────────────
const DUMMY_PERMISSIONS: Permission[] = [
  {
    permissionSysId: 'PRM-001',
    permissionGroup: PERMISSION_GROUPS[0],
    permission: 'DASHBOARD_VIEW',
    createdOn: '2026-01-10T08:00:00Z',
    updatedOn: '2026-06-15T10:30:00Z',
  },
  {
    permissionSysId: 'PRM-002',
    permissionGroup: PERMISSION_GROUPS[0],
    permission: 'DASHBOARD_EXPORT',
    createdOn: '2026-01-12T09:00:00Z',
    updatedOn: '2026-01-12T09:00:00Z',
  },
  {
    permissionSysId: 'PRM-003',
    permissionGroup: PERMISSION_GROUPS[1],
    permission: 'USER_CREATE',
    createdOn: '2026-02-15T11:00:00Z',
    updatedOn: '2026-05-20T14:00:00Z',
  },
  {
    permissionSysId: 'PRM-004',
    permissionGroup: PERMISSION_GROUPS[1],
    permission: 'USER_DELETE',
    createdOn: '2026-02-15T11:30:00Z',
    updatedOn: '2026-02-15T11:30:00Z',
  },
  {
    permissionSysId: 'PRM-005',
    permissionGroup: PERMISSION_GROUPS[2],
    permission: 'AUDIT_LOG_VIEW',
    createdOn: '2026-03-05T10:00:00Z',
    updatedOn: '2026-07-01T16:00:00Z',
  },
  {
    permissionSysId: 'PRM-006',
    permissionGroup: PERMISSION_GROUPS[3],
    permission: 'VENDOR_ONBOARD',
    createdOn: '2026-04-25T08:00:00Z',
    updatedOn: '2026-04-25T08:00:00Z',
  },
];

// ── Component ──────────────────────────────────────────────────────────
const PermissionManagementPage = () => {
  const [data, setData] = useState<Permission[]>(DUMMY_PERMISSIONS);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [formPermission, setFormPermission] = useState('');
  const [formGroupSysId, setFormGroupSysId] = useState('');

  const handleEditClick = useCallback((perm: Permission) => {
    setEditingPermission(perm);
    setFormPermission(perm.permission);
    setFormGroupSysId(perm.permissionGroup.permissionGroupSysId);
  }, []);

  const handleDeleteClick = useCallback((perm: Permission) => {
    setDeletingPermission(perm);
  }, []);

  const handleAddClick = () => {
    setIsAdding(true);
    setFormPermission('');
    setFormGroupSysId(PERMISSION_GROUPS[0]?.permissionGroupSysId ?? '');
  };

  const handleSaveEdit = () => {
    if (!editingPermission) return;

    const selectedGroup = PERMISSION_GROUPS.find(
      (g) => g.permissionGroupSysId === formGroupSysId
    );
    if (!selectedGroup) return;

    setData((prev) =>
      prev.map((item) =>
        item.permissionSysId === editingPermission.permissionSysId
          ? {
              ...item,
              permission: formPermission,
              permissionGroup: selectedGroup,
              updatedOn: new Date().toISOString(),
            }
          : item
      )
    );
    setEditingPermission(null);
  };

  const handleSaveAdd = () => {
    const selectedGroup = PERMISSION_GROUPS.find(
      (g) => g.permissionGroupSysId === formGroupSysId
    );
    if (!selectedGroup) return;

    const nextNum = data.length > 0
      ? Math.max(...data.map(d => parseInt(d.permissionSysId.split('-')[1], 10))) + 1
      : 1;
    const paddedNum = String(nextNum).padStart(3, '0');
    const newPerm: Permission = {
      permissionSysId: `PRM-${paddedNum}`,
      permissionGroup: selectedGroup,
      permission: formPermission,
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    };

    setData((prev) => [...prev, newPerm]);
    setIsAdding(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingPermission) return;
    setData((prev) => prev.filter((item) => item.permissionSysId !== deletingPermission.permissionSysId));
    setDeletingPermission(null);
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
    const columnHelper = createColumnHelper<Permission>();
    return [
      columnHelper.accessor('permissionSysId', {
        header: 'Permission ID',
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('permissionGroup', {
        header: 'Permission Group',
        cell: (info) => {
          const group = info.getValue();
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200">
              {group.permissionGroupName}
            </span>
          );
        },
      }),
      columnHelper.accessor('permission', {
        header: 'Permission',
        cell: (info) => (
          <span className="font-semibold text-slate-800">{info.getValue()}</span>
        ),
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
          const perm = info.row.original;
          return (
            <div className="flex items-center justify-end gap-2 pr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleEditClick(perm)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <Pencil className="size-4.5" />
                    <span className="sr-only">Edit Permission</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Edit Permission</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleDeleteClick(perm)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <Trash2 className="size-4.5" />
                    <span className="sr-only">Delete Permission</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Delete Permission</TooltipContent>
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
              <h1 className="mt-2 text-3xl font-bold">Permission Management</h1>
              <p className="mt-3 text-slate-600">
                Create, edit, and manage granular permissions for modules, features, and resources.
              </p>
            </div>

            <Button className="shrink-0" onClick={handleAddClick}>
              <Plus data-icon="inline-start" className="size-4" />
              Add Permission
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
                      No permissions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Add/Edit Form Dialog */}
        <Dialog
          open={editingPermission !== null || isAdding}
          onOpenChange={(open) => {
            if (!open) {
              setEditingPermission(null);
              setIsAdding(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isAdding ? 'Add Permission' : 'Edit Permission'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to {isAdding ? 'create a new' : 'modify this'} permission.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Permission Group
                </label>
                <select
                  value={formGroupSysId}
                  onChange={(e) => setFormGroupSysId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium cursor-pointer"
                >
                  {PERMISSION_GROUPS.map((group) => (
                    <option key={group.permissionGroupSysId} value={group.permissionGroupSysId}>
                      {group.permissionGroupName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Permission
                </label>
                <input
                  type="text"
                  value={formPermission}
                  onChange={(e) => setFormPermission(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                  placeholder="e.g. DASHBOARD_VIEW"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingPermission(null);
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
          open={deletingPermission !== null}
          onOpenChange={(open) => !open && setDeletingPermission(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <span className="font-semibold text-slate-950">{deletingPermission?.permission}</span>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDeletingPermission(null)}>
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

export default PermissionManagementPage;
