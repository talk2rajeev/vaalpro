import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AlertCircle, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/core-components/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/core-components/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/core-components/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/core-components/tooltip';
import { useGetVendorByIdQuery, useGetVendorsQuery } from '@/features/vendors/vendorApi';
import type { Vendor } from '@/features/vendors/vendorTypes';
import {
  useCreateVendorEmployeeMutation,
  useDeleteVendorEmployeeMutation,
  useGetVendorEmployeesQuery,
  useUpdateVendorEmployeeMutation,
} from '@/features/vendorEmployees/vendorEmployeeApi';
import type {
  CreateVendorEmployeePayload,
  UpdateVendorEmployeePayload,
  VendorEmployee,
  VendorEmployeeStatus,
} from '@/features/vendorEmployees/vendorEmployeeTypes';

const pageSize = 10;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }

  return fallback;
};

const VendorEmployeeManagementPage = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const hasVendorContext = Boolean(vendorId);
  const [page, setPage] = useState(0);
  const [selectedVendorSysId, setSelectedVendorSysId] = useState(vendorId ?? '');
  const [editingEmployee, setEditingEmployee] = useState<VendorEmployee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<VendorEmployee | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: vendorsData,
    isLoading: isLoadingVendors,
    isError: isVendorError,
    error: vendorError,
  } = useGetVendorsQuery(
    { page: 0, size: 100, sortBy: 'vendorName', sortDir: 'asc' },
    { skip: hasVendorContext },
  );
  const {
    data: routeVendor,
    isLoading: isLoadingRouteVendor,
    isError: isRouteVendorError,
    error: routeVendorError,
  } = useGetVendorByIdQuery(vendorId ?? '', { skip: !hasVendorContext });

  const selectedVendor = useMemo(
    () => routeVendor ?? vendorsData?.content.find((vendor) => vendor.vendorSysId === selectedVendorSysId) ?? null,
    [routeVendor, selectedVendorSysId, vendorsData],
  );

  useEffect(() => {
    if (vendorId) {
      setSelectedVendorSysId(vendorId);
      return;
    }

    if (!selectedVendorSysId && vendorsData?.content.length) {
      setSelectedVendorSysId(vendorsData.content[0].vendorSysId);
    }
  }, [vendorId, selectedVendorSysId, vendorsData]);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetVendorEmployeesQuery(
    { vendorSysId: selectedVendorSysId, page, size: pageSize, sortBy: 'empSysId', sortDir: 'asc' },
    { skip: !selectedVendorSysId },
  );
  const [deleteVendorEmployee, { isLoading: isDeleting }] = useDeleteVendorEmployeeMutation();

  const handleVendorChange = (vendorSysId: string) => {
    setSelectedVendorSysId(vendorSysId);
    setPage(0);
    setEditingEmployee(null);
    setDeletingEmployee(null);
    setIsAdding(false);
    setDeleteError(null);
  };

  const handleDeleteClick = useCallback((employee: VendorEmployee) => {
    setDeleteError(null);
    setDeletingEmployee(employee);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deletingEmployee) return;
    setDeleteError(null);

    try {
      await deleteVendorEmployee({
        vendorSysId: deletingEmployee.vendorSysId,
        empSysId: deletingEmployee.empSysId,
      }).unwrap();
      setDeletingEmployee(null);
      if (data && data.content.length === 1 && page > 0) setPage((current) => current - 1);
    } catch (err: unknown) {
      setDeleteError(getErrorMessage(err, 'Failed to delete vendor employee.'));
    }
  };

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
                <button
                  onClick={() => setEditingEmployee(info.row.original)}
                  className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  <Pencil className="size-4.5" />
                  <span className="sr-only">Edit Vendor Employee</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Edit Vendor Employee</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleDeleteClick(info.row.original)}
                  className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  <Trash2 className="size-4.5" />
                  <span className="sr-only">Delete Vendor Employee</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Delete Vendor Employee</TooltipContent>
            </Tooltip>
          </div>
        ),
      }),
    ];
  }, [handleDeleteClick]);

  const table = useReactTable({ data: data?.content ?? [], columns, getCoreRowModel: getCoreRowModel() });
  const canManageEmployees = Boolean(selectedVendorSysId);

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <section className="w-full">
          {hasVendorContext && (
            <Breadcrumb>
              <BreadcrumbList className="text-xs">
                <BreadcrumbItem>Platform Admin</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/system-admin/vendors">Vendors</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/system-admin/vendors/${vendorId}/detail`}>
                      {selectedVendor?.vendorName ?? vendorId}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold text-blue-800">Employees</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}

          <div className={`flex items-start justify-between gap-6 ${hasVendorContext ? 'mt-4' : ''}`}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">System Administration</p>
              <h1 className="mt-2 text-3xl font-bold">Vendor Employee Management</h1>
              <p className="mt-3 text-slate-600">
                Manage vendor employee accounts, role assignments, and access controls across the platform.
              </p>
            </div>
            <Button className="shrink-0" onClick={() => setIsAdding(true)} disabled={!canManageEmployees}>
              <Plus data-icon="inline-start" className="size-4" />
              Add Employee
            </Button>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="vendor-employee-vendor">
              Vendor
            </label>
            <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center">
              {hasVendorContext ? (
                <span className="text-sm text-slate-500">
                  Managing employees for <span className="font-semibold text-slate-700">{selectedVendor?.vendorName ?? vendorId}</span>
                </span>
              ) : (
                <select
                  id="vendor-employee-vendor"
                  value={selectedVendorSysId}
                  onChange={(event) => handleVendorChange(event.target.value)}
                  disabled={isLoadingVendors || isVendorError || !vendorsData?.content.length}
                  className="min-h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:max-w-md"
                >
                  <option value="">Select vendor</option>
                  {vendorsData?.content.map((vendor) => (
                    <option key={vendor.vendorSysId} value={vendor.vendorSysId}>
                      {vendor.vendorName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {(isLoadingVendors || isLoadingRouteVendor) && <LoadingState label="Loading vendors..." />}
          {(isVendorError || isRouteVendorError) && (
            <ErrorState
              title="Failed to load vendors"
              message={getErrorMessage(vendorError ?? routeVendorError, 'Failed to load vendors.')}
            />
          )}

          {!isLoadingVendors && !isLoadingRouteVendor && !isVendorError && !isRouteVendorError && !selectedVendorSysId && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
              Select a vendor to manage employees.
            </div>
          )}

          {selectedVendorSysId && !isLoading && !isError && (
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
          )}

          {selectedVendorSysId && isLoading && <LoadingState label="Loading vendor employees..." />}
          {selectedVendorSysId && isError && (
            <ErrorState title="Failed to load vendor employees" message={getErrorMessage(error, 'Failed to load vendor employees.')} />
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

        <VendorEmployeeForm
          mode="create"
          open={isAdding}
          vendor={selectedVendor}
          onOpenChange={setIsAdding}
        />
        <VendorEmployeeForm
          mode="edit"
          open={editingEmployee !== null}
          employee={editingEmployee}
          vendor={selectedVendor}
          onOpenChange={(open) => !open && setEditingEmployee(null)}
        />
        <DeleteVendorEmployeeDialog
          employee={deletingEmployee}
          deleteError={deleteError}
          isDeleting={isDeleting}
          onCancel={() => setDeletingEmployee(null)}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </TooltipProvider>
  );
};

const LoadingState = ({ label }: { label: string }) => (
  <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white p-12 shadow-sm">
    <Loader2 className="mr-3 size-8 animate-spin text-blue-600" />
    <span className="text-lg font-medium text-slate-600">{label}</span>
  </div>
);

const ErrorState = ({ title, message }: { title: string; message: string }) => (
  <div className="mt-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
    <AlertCircle className="size-5 shrink-0" />
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm opacity-90">{message}</p>
    </div>
  </div>
);

const vendorEmployeeSchema = z.object({
  employeeId: z.string().trim().min(1, 'Employee ID is required.'),
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  designation: z.string().trim().min(1, 'Designation is required.'),
  department: z.string().trim().min(1, 'Department is required.'),
  contactNo: z.string().trim().min(1, 'Contact number is required.'),
  whatsappNo: z.string().trim().min(1, 'WhatsApp number is required.'),
  alternateNo: z.string(),
  emailId: z.email('Enter a valid email address.'),
  alternateEmail: z.string().trim().refine((value) => !value || z.email().safeParse(value).success, 'Enter a valid alternate email.'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  password: z.string(),
});

type VendorEmployeeFormValues = z.infer<typeof vendorEmployeeSchema>;

interface VendorEmployeeFormProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
  employee?: VendorEmployee | null;
}

const emptyEmployee: VendorEmployeeFormValues = {
  employeeId: '',
  firstName: '',
  lastName: '',
  designation: '',
  department: '',
  contactNo: '',
  whatsappNo: '',
  alternateNo: '',
  emailId: '',
  alternateEmail: '',
  status: 'ACTIVE',
  password: '',
};

const getDefaultValues = (employee?: VendorEmployee | null): VendorEmployeeFormValues =>
  employee
    ? {
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        designation: employee.designation,
        department: employee.department,
        contactNo: employee.contactNo,
        whatsappNo: employee.whatsappNo,
        alternateNo: employee.alternateNo ?? '',
        emailId: employee.emailId,
        alternateEmail: employee.alternateEmail ?? '',
        status: employee.status,
        password: '',
      }
    : emptyEmployee;

const VendorEmployeeForm = ({ mode, open, onOpenChange, vendor, employee }: VendorEmployeeFormProps) => {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [createVendorEmployee, { isLoading: isCreating }] = useCreateVendorEmployeeMutation();
  const [updateVendorEmployee, { isLoading: isUpdating }] = useUpdateVendorEmployeeMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<VendorEmployeeFormValues>({
    resolver: zodResolver(vendorEmployeeSchema),
    defaultValues: getDefaultValues(employee),
    mode: 'onChange',
  });
  const password = watch('password');
  const isEdit = mode === 'edit';
  const isSaving = isCreating || isUpdating;
  const canSubmit = isValid && (isEdit || password.trim().length > 0);

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(employee));
      setSaveError(null);
    }
  }, [open, employee, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setSaveError(null);
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: VendorEmployeeFormValues) => {
    if (!vendor) return;
    setSaveError(null);

    try {
      if (mode === 'create') {
        const body: CreateVendorEmployeePayload = {
          employeeId: values.employeeId,
          firstName: values.firstName,
          lastName: values.lastName,
          designation: values.designation,
          department: values.department,
          contactNo: values.contactNo,
          whatsappNo: values.whatsappNo,
          alternateNo: values.alternateNo,
          emailId: values.emailId,
          alternateEmail: values.alternateEmail,
          status: values.status,
          password: values.password,
        };
        await createVendorEmployee({ vendorSysId: vendor.vendorSysId, body }).unwrap();
      } else if (employee) {
        const body: UpdateVendorEmployeePayload = {
          empSysId: employee.empSysId,
          vendorSysId: employee.vendorSysId,
          employeeId: values.employeeId,
          firstName: values.firstName,
          lastName: values.lastName,
          designation: values.designation,
          department: values.department,
          contactNo: values.contactNo,
          whatsappNo: values.whatsappNo,
          alternateNo: values.alternateNo,
          emailId: values.emailId,
          alternateEmail: values.alternateEmail,
          status: values.status as VendorEmployeeStatus,
          createdOn: employee.createdOn,
          updatedOn: employee.updatedOn,
        };
        await updateVendorEmployee({ vendorSysId: employee.vendorSysId, empSysId: employee.empSysId, body }).unwrap();
      }

      handleOpenChange(false);
    } catch (error: unknown) {
      setSaveError(getErrorMessage(error, 'Unable to save the vendor employee. Please try again.'));
    }
  };

  const field = (
    label: string,
    name: keyof VendorEmployeeFormValues,
    options: { type?: 'text' | 'password' | 'email'; optional?: boolean; wide?: boolean; placeholder?: string } = {},
  ) => (
    <div className={`space-y-1 ${options.wide ? 'md:col-span-2' : ''}`}>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor={`vendor-employee-${name}`}>
        {label}
        {options.optional ? ' (Optional)' : ''}
      </label>
      <input
        id={`vendor-employee-${name}`}
        type={options.type ?? 'text'}
        {...register(name)}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        placeholder={options.placeholder}
        aria-invalid={Boolean(errors[name])}
      />
      {errors[name] && <p className="text-xs text-red-600">{errors[name].message}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-6xl max-h-[85vh] p-0 flex flex-col"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Vendor Employee' : 'Add Vendor Employee'}</DialogTitle>
            <DialogDescription>
              Provide details for the {isEdit ? 'existing' : 'new'} employee under {vendor?.vendorName ?? 'the selected vendor'}.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto border-y border-slate-100 px-6 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {field('Employee ID', 'employeeId', { placeholder: 'e.g. EMP005' })}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="vendor-employee-status">
                  Status
                </label>
                <select
                  id="vendor-employee-status"
                  {...register('status')}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              {field('First Name', 'firstName', { placeholder: 'e.g. Michael' })}
              {field('Last Name', 'lastName', { placeholder: 'e.g. Johnson' })}
              {field('Designation', 'designation', { placeholder: 'e.g. Senior validation engineer' })}
              {field('Department', 'department', { placeholder: 'e.g. Validation' })}
              {field('Contact No', 'contactNo', { placeholder: 'e.g. 5551234567' })}
              {field('WhatsApp No', 'whatsappNo', { placeholder: 'e.g. 5551234567' })}
              {field('Alternate No', 'alternateNo', { optional: true, placeholder: 'e.g. 5551234568' })}
              {field('Email', 'emailId', { type: 'email', placeholder: 'e.g. michael.johnson@example.com' })}
              {field('Alternate Email', 'alternateEmail', { type: 'email', optional: true, placeholder: 'e.g. michael.alt@example.com' })}
              {!isEdit && field('Password', 'password', { type: 'password', placeholder: 'Set initial password' })}
            </div>
          </div>
          <div className="p-6 pt-4">
            {saveError && <p className="mb-3 text-sm text-red-600">{saveError}</p>}
            {!isEdit && !password.trim() && <p className="mb-3 text-sm text-amber-600">Password is required for new employees.</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || !canSubmit}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteVendorEmployeeDialogProps {
  employee: VendorEmployee | null;
  deleteError: string | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteVendorEmployeeDialog = ({
  employee,
  deleteError,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteVendorEmployeeDialogProps) => (
  <Dialog open={employee !== null} onOpenChange={(open: boolean) => !open && onCancel()}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-950">
            {employee?.firstName} {employee?.lastName}
          </span>
          ? This action depends on backend DELETE support.
        </DialogDescription>
      </DialogHeader>
      {deleteError && (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          <span>{deleteError}</span>
        </div>
      )}
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Deleting...
            </>
          ) : (
            'Delete'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default VendorEmployeeManagementPage;
