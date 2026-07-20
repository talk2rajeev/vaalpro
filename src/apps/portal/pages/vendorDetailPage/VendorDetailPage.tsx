import { useState } from 'react';
import { Building2, Info, Pencil, Users } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import AdminBreadcrumb from '@/apps/portal/components/AdminBreadcrumb/AdminBreadcrumb';
import AdminPageHeader from '@/apps/portal/components/AdminPageHeader/AdminPageHeader';
import InfoCard from '@/apps/portal/components/InfoCard/InfoCard';
import StatusBadge from '@/apps/portal/components/StatusBadge/StatusBadge';
import BranchesSection from '@/apps/portal/components/VendorDetail/BranchesSection';
import DetailField from '@/apps/portal/components/VendorDetail/DetailField';
import ManagementCard from '@/apps/portal/components/VendorDetail/ManagementCard';
import VendorForm from '@/apps/portal/components/VendorForm/VendorForm';
import { ROUTES } from '@/core/routes/paths';
import { useVendorContext } from '@/features/vendors/useVendorContext';

const VendorDetailPage = () => {
  const { vendor, isLoading, isError } = useVendorContext();
  const [isEditingVendor, setIsEditingVendor] = useState(false);

  if (isLoading && !vendor) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
          Loading vendor details...
        </div>
      </main>
    );
  }

  if ((isError && !vendor) || !vendor) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load vendor details.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <AdminBreadcrumb
        items={[
          { label: 'Platform Admin' },
          { label: 'Vendors', to: ROUTES.systemAdmin.vendors },
          { label: vendor.vendorName },
        ]}
      />

      <AdminPageHeader
        className="mt-5"
        badge={<StatusBadge tone="active" className="bg-blue-100 uppercase tracking-wide text-blue-800">Active Vendor</StatusBadge>}
        title={vendor.vendorName}
        action={(
          <Button size="lg" className="px-4" onClick={() => setIsEditingVendor(true)}>
            <Pencil data-icon="inline-start" className="size-4" />
            Edit Profile
          </Button>
        )}
      />

      <InfoCard title="General Information" icon={<Info className="size-5 text-blue-800" />} className="mt-12">
        <div className="grid gap-x-16 gap-y-8 md:grid-cols-3">
          <DetailField label="Vendor Name" value={vendor.vendorName} />
          <DetailField label="Vendor Code" value={vendor.vendorCode} />
          <DetailField label="Est. Year" value={String(vendor.yearEstablished)} />
          <DetailField label="Address Line 1" value={vendor.addressLine1} />
          <DetailField label="Address Line 2 (Optional)" value={vendor.addressLine2} />
          <DetailField label="City" value={vendor.city} />
          <DetailField label="State" value={vendor.state} />
          <DetailField label="Postal Code" value={vendor.postalCode} />
          <DetailField label="Country" value={vendor.country} />
          <DetailField label="GST Number" value={vendor.gstNumber} />
          <DetailField label="PAN Number" value={vendor.panNumber} />
          <DetailField label="Logo URL (Optional)" value={vendor.logoUrl} />
        </div>
      </InfoCard>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <ManagementCard
          icon={<Users className="size-7 text-blue-800" />}
          title="Vendor Employees"
          description="Manage and view all registered employees for this vendor. Access roles, permissions, and history."
          linkLabel="Manage Employees"
          to={ROUTES.systemAdmin.vendorEmployees(vendor.vendorSysId)}
        />
        <ManagementCard
          icon={<Building2 className="size-7 text-blue-800" />}
          title="Vendor Customers"
          description="Manage and view all associated customers for this vendor. Review contracts, compliance status, and revenue."
          linkLabel="Manage Customers"
          to={ROUTES.systemAdmin.vendorCustomers(vendor.vendorSysId)}
        />
      </section>

      <BranchesSection vendorSysId={vendor.vendorSysId} />
      <VendorForm
        mode="edit"
        open={isEditingVendor}
        vendor={vendor}
        onOpenChange={setIsEditingVendor}
      />
    </main>
  );
};

export default VendorDetailPage;
