import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/core-components/table';
import AdminBreadcrumb from '@/apps/portal/components/AdminBreadcrumb/AdminBreadcrumb';
import AdminPageHeader from '@/apps/portal/components/AdminPageHeader/AdminPageHeader';
import AdminTableShell from '@/apps/portal/components/AdminTableShell/AdminTableShell';
import { ErrorState, LoadingState } from '@/apps/portal/components/PageStates/PageStates';
import StatusBadge from '@/apps/portal/components/StatusBadge/StatusBadge';
import VendorForm from '@/apps/portal/components/VendorForm/VendorForm';
import { ROUTES } from '@/core/routes/paths';
import { useGetVendorsQuery, useSearchVendorsQuery } from '@/features/vendors/api';
import type { Vendor } from '@/features/vendors/types';

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') return data.message;
  }
  return 'Failed to load vendors';
};

const VendorManagementPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 10;
  const normalizedSearch = searchQuery.trim();
  const isSearching = normalizedSearch.length > 0;
  const vendorsQuery = useGetVendorsQuery(
    { page, size: pageSize, sortBy: 'vendorSysId', sortDir: 'asc' },
    { skip: isSearching },
  );
  const searchQueryResult = useSearchVendorsQuery(
    { vendorName: normalizedSearch, page, size: pageSize },
    { skip: !isSearching },
  );

  const activeQuery = isSearching ? searchQueryResult : vendorsQuery;
  const { data, isLoading, isError, error } = activeQuery;

  useEffect(() => {
    setPage(0);
  }, [normalizedSearch]);

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Vendor>();
    return [
      columnHelper.accessor('logoUrl', {
        header: 'LOGO',
        cell: (info) => {
          const vendorName = info.row.original.vendorName;
          const initials = vendorName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase();

          return info.getValue() ? (
            <img
              src={info.getValue()}
              alt={`${vendorName} logo`}
              className="size-7 rounded-md border border-slate-200 object-cover"
              onError={(event) => {
                (event.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex size-7 items-center justify-center rounded-md bg-blue-100 text-[10px] font-bold text-blue-700">
              {initials || 'V'}
            </div>
          );
        },
      }),
      columnHelper.accessor('vendorName', {
        header: 'VENDOR NAME',
        cell: (info) => {
          const vendor = info.row.original;
          const detailPath = ROUTES.systemAdmin.vendorDetail(vendor.vendorSysId);

          return (
            <a
              href={detailPath}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                navigate(detailPath, { state: { vendor } });
              }}
              className="font-semibold text-blue-800 hover:text-blue-700 hover:underline"
            >
              {info.getValue()}
            </a>
          );
        },
      }),
      columnHelper.accessor('vendorCode', {
        header: 'CODE',
        cell: (info) => <span className="font-mono text-xs text-slate-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor('city', {
        header: 'LOCATION',
        cell: (info) => (
          <span className="text-slate-700">
            {[info.row.original.city, info.row.original.country].filter(Boolean).join(', ') || '-'}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'status',
        header: 'STATUS',
        cell: () => <StatusBadge tone="active">Active</StatusBadge>,
      }),
    ];
  }, [navigate]);

  const table = useReactTable({ data: data?.content ?? [], columns, getCoreRowModel: getCoreRowModel() });

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <section className="w-full">
        <AdminBreadcrumb items={[{ label: 'Platform Admin' }, { label: 'Vendors' }]} />

        <AdminPageHeader
          className="mt-3"
          title="Vendors Hub"
          description="Onboard, manage, and configure details of system vendors."
          action={(
            <Button size="lg" className="shrink-0 px-4" onClick={() => setIsAdding(true)}>
            <Plus data-icon="inline-start" className="size-4" />
            Add New Vendor
            </Button>
          )}
        />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-bold text-slate-900">Select Vendor</h2>
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Search vendors..."
              aria-label="Search vendors"
            />
          </div>
        </div>

        {!isLoading && !isError && (
          <AdminTableShell className="mt-4 border-slate-300">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-slate-100/80 hover:bg-slate-100/80">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="h-12 px-7 text-xs font-bold text-slate-500">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-slate-50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-7 py-3 text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      No vendors found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </AdminTableShell>
        )}

        {isLoading && <LoadingState label="Loading vendors..." />}

        {isError && (
          <ErrorState title="Failed to load vendors" message={getErrorMessage(error)} />
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

      <VendorForm mode="create" open={isAdding} onOpenChange={setIsAdding} />
    </main>
  );
};

export default VendorManagementPage;
