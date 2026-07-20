import { useMemo } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/core-components/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/core-components/tooltip';
import type { VendorEmployee } from '@/features/vendorEmployees/types';

interface VendorEmployeeTableProps {
  employees: VendorEmployee[];
  onEdit: (employee: VendorEmployee) => void;
  onDelete: (employee: VendorEmployee) => void;
}

const VendorEmployeeTable = ({ employees, onEdit, onDelete }: VendorEmployeeTableProps) => {
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<VendorEmployee>();

    return [
      columnHelper.accessor('employeeId', {
        header: 'Employee ID',
        cell: (info) => <span className="font-mono text-xs font-bold text-slate-700">{info.getValue()}</span>,
      }),
      columnHelper.accessor('firstName', {
        header: 'Name',
        cell: (info) => (
          <div>
            <p className="font-semibold text-slate-800">
              {info.row.original.firstName} {info.row.original.lastName}
            </p>
            <p className="text-xs text-slate-500">{info.row.original.emailId}</p>
          </div>
        ),
      }),
      columnHelper.accessor('designation', {
        header: 'Designation',
        cell: (info) => <span className="text-slate-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor('department', {
        header: 'Department',
        cell: (info) => <span className="text-slate-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor('contactNo', {
        header: 'Contact',
        cell: (info) => <span className="font-mono text-xs text-slate-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const isActive = info.getValue() === 'ACTIVE';
          return (
            <span className={`rounded-full px-2 py-1 text-xs font-bold ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {info.getValue()}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right pr-4">Actions</div>,
        cell: (info) => (
          <div className="flex items-center justify-end gap-2 pr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(info.row.original)}
                  className="text-slate-500 hover:text-blue-600"
                >
                  <Pencil className="size-4.5" />
                  <span className="sr-only">Edit Vendor Employee</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Edit Vendor Employee</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(info.row.original)}
                  className="text-slate-500 hover:text-red-600"
                >
                  <Trash2 className="size-4.5" />
                  <span className="sr-only">Delete Vendor Employee</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Delete Vendor Employee</TooltipContent>
            </Tooltip>
          </div>
        ),
      }),
    ];
  }, [onDelete, onEdit]);

  const table = useReactTable({ data: employees, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
                No vendor employees found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VendorEmployeeTable;
