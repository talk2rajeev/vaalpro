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
interface Role {
  roleSysId: string;
  roleName: string;
  displayName: string;
  roleDesc: string;
  createdOn: string;
  updatedOn: string;
}

// ── Dummy data (local constant) ────────────────────────────────────────
const DUMMY_ROLES: Role[] = [
  {
    roleSysId: 'ROLE-001',
    roleName: 'SUPER_ADMIN',
    displayName: 'Super Administrator',
    roleDesc: 'Full system access with all permissions enabled.',
    createdOn: '2026-01-15T09:30:00Z',
    updatedOn: '2026-06-20T14:12:00Z',
  },
  {
    roleSysId: 'ROLE-002',
    roleName: 'ORG_ADMIN',
    displayName: 'Organisation Admin',
    roleDesc: 'Manages organisation-level settings, users, and billing.',
    createdOn: '2026-02-03T11:00:00Z',
    updatedOn: '2026-05-18T08:45:00Z',
  },
  {
    roleSysId: 'ROLE-003',
    roleName: 'PLANT_MANAGER',
    displayName: 'Plant Manager',
    roleDesc: 'Oversees plant operations, audit logs, and compliance.',
    createdOn: '2026-03-10T07:15:00Z',
    updatedOn: '2026-06-01T16:30:00Z',
  },
  {
    roleSysId: 'ROLE-004',
    roleName: 'AUDITOR',
    displayName: 'Auditor',
    roleDesc: 'Read-only access to audit trails and compliance reports.',
    createdOn: '2026-03-22T13:20:00Z',
    updatedOn: '2026-04-10T09:00:00Z',
  },
  {
    roleSysId: 'ROLE-005',
    roleName: 'VENDOR_COORDINATOR',
    displayName: 'Vendor Coordinator',
    roleDesc: 'Manages vendor relationships, onboarding, and evaluations.',
    createdOn: '2026-04-05T10:00:00Z',
    updatedOn: '2026-07-01T12:00:00Z',
  },
  {
    roleSysId: 'ROLE-006',
    roleName: 'VIEWER',
    displayName: 'Viewer',
    roleDesc: 'Basic read-only access across permitted modules.',
    createdOn: '2026-05-12T15:45:00Z',
    updatedOn: '2026-05-12T15:45:00Z',
  },
];

// ── Component ──────────────────────────────────────────────────────────
const RoleManagementPage = () => {
  const [data, setData] = useState<Role[]>(DUMMY_ROLES);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Edit form state
  const [editRoleName, setEditRoleName] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editRoleDesc, setEditRoleDesc] = useState('');

  const handleEditClick = useCallback((role: Role) => {
    setEditingRole(role);
    setEditRoleName(role.roleName);
    setEditDisplayName(role.displayName);
    setEditRoleDesc(role.roleDesc);
  }, []);

  const handleDeleteClick = useCallback((role: Role) => {
    console.log('Delete role action triggered:', role);
  }, []);

  const handleSave = () => {
    if (!editingRole) return;

    console.log('Save role changes:', {
      roleSysId: editingRole.roleSysId,
      roleName: editRoleName,
      displayName: editDisplayName,
      roleDesc: editRoleDesc,
    });

    setData((prev) =>
      prev.map((item) =>
        item.roleSysId === editingRole.roleSysId
          ? {
            ...item,
            roleName: editRoleName,
            displayName: editDisplayName,
            roleDesc: editRoleDesc,
            updatedOn: new Date().toISOString(),
          }
          : item
      )
    );
    setEditingRole(null);
  };

  // ── Column definitions ─────────────────────────────────────────────────
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Role>();
    return [
      columnHelper.accessor('roleSysId', {
        header: 'Role Sys ID',
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('roleName', {
        header: 'Role Name',
        cell: (info) => (
          <span className="font-semibold">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('displayName', {
        header: 'Display Name',
      }),
      columnHelper.accessor('roleDesc', {
        header: 'Description',
        cell: (info) => (
          <span className="max-w-xs truncate block" title={info.getValue()}>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('createdOn', {
        header: 'Created On',
        cell: (info) => new Date(info.getValue()).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      }),
      columnHelper.accessor('updatedOn', {
        header: 'Updated On',
        cell: (info) => new Date(info.getValue()).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right pr-4">Actions</div>,
        cell: (info) => {
          const role = info.row.original;
          return (
            <div className="flex items-center justify-end gap-2 pr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleEditClick(role)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <Pencil className="size-4.5" />
                    <span className="sr-only">Edit Role</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Edit Role</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleDeleteClick(role)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    <Trash2 className="size-4.5" />
                    <span className="sr-only">Delete Role</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Delete Role</TooltipContent>
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
              <h1 className="mt-2 text-3xl font-bold">Role Management</h1>
              <p className="mt-3 text-slate-600">
                Define and manage roles, assign permissions, and configure
                role-based access policies.
              </p>
            </div>

            <Button className="shrink-0">
              <Plus data-icon="inline-start" className="size-4" />
              Add Role
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
                            header.getContext(),
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
                            cell.getContext(),
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
                      No roles found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Edit Dialog */}
        <Dialog open={editingRole !== null} onOpenChange={(open) => !open && setEditingRole(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Make changes to this role below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Role Name
                </label>
                <input
                  type="text"
                  value={editRoleName}
                  onChange={(e) => setEditRoleName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                  placeholder="e.g. SUPER_ADMIN"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                  placeholder="e.g. Super Administrator"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={editRoleDesc}
                  onChange={(e) => setEditRoleDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium resize-none"
                  placeholder="Brief description of the role..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingRole(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </TooltipProvider>
  );
};

export default RoleManagementPage;
