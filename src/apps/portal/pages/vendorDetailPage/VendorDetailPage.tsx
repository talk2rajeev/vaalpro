import { useState } from 'react';
import { Building2, Info, Map, Pencil, Users } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import AdminBreadcrumb from '@/apps/portal/components/AdminBreadcrumb/AdminBreadcrumb';
import AdminPageHeader from '@/apps/portal/components/AdminPageHeader/AdminPageHeader';
import InfoCard from '@/apps/portal/components/InfoCard/InfoCard';
import StatusBadge from '@/apps/portal/components/StatusBadge/StatusBadge';
import DetailField from '@/apps/portal/components/VendorDetail/DetailField';
import ManagementCard from '@/apps/portal/components/VendorDetail/ManagementCard';
import VendorForm from '@/apps/portal/components/VendorForm/VendorForm';
import { ROUTES } from '@/core/routes/paths';
import { useVendorContext } from '@/features/vendors/useVendorContext';

const complianceActivity = [
  { documentName: 'Quality Assurance Cert 2023', expiryDate: 'Dec 12, 2024', status: 'VALID' },
  { documentName: 'Safety Regulation Protocol', expiryDate: 'Jan 15, 2025', status: 'VALID' },
  { documentName: 'Logistics License Renewal', expiryDate: 'Oct 01, 2023', status: 'EXPIRED' },
];

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
        title={(
          <>
            {vendor.vendorName} <span className="font-normal text-slate-300">(Vendor Detail)</span>
          </>
        )}
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

      <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <InfoCard
          title="Recent Compliance Activity"
          action={(
            <Button type="button" variant="link" className="h-auto p-0 font-semibold text-blue-800 hover:text-blue-600">
              View All
            </Button>
          )}
        >
          <div className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-xs font-bold text-slate-500">
                <tr>
                  <th className="px-5 py-4">Document Name</th>
                  <th className="px-5 py-4">Expiry Date</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {complianceActivity.map((activity) => (
                  <tr key={activity.documentName} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-5 py-4 font-medium">{activity.documentName}</td>
                    <td className="px-5 py-4 text-slate-600">{activity.expiryDate}</td>
                    <td className="px-5 py-4">
                      <StatusBadge tone={activity.status === 'VALID' ? 'valid' : 'expired'} className="rounded-full">
                        {activity.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InfoCard>

        <InfoCard title="Headquarters" icon={<Map className="size-5 text-blue-800" />}>
          <div className="relative h-56 overflow-hidden rounded-lg border border-slate-200 bg-blue-50">
            <div className="absolute inset-0 bg-[linear-gradient(30deg,rgba(30,64,175,0.18)_12%,transparent_12%,transparent_50%,rgba(30,64,175,0.18)_50%,rgba(30,64,175,0.18)_62%,transparent_62%),linear-gradient(120deg,rgba(15,23,42,0.12)_10%,transparent_10%,transparent_46%,rgba(15,23,42,0.12)_46%,rgba(15,23,42,0.12)_54%,transparent_54%)] bg-[length:72px_72px]" />
            <div className="absolute left-8 top-10 h-28 w-48 rotate-[-12deg] rounded-full border-2 border-blue-900/40" />
            <div className="absolute right-6 top-4 h-40 w-16 bg-sky-200/80" />
            <div className="absolute bottom-8 left-16 rounded-lg bg-white/90 p-4 shadow-lg backdrop-blur">
              <p className="font-bold text-slate-800">{vendor.addressLine1 || 'Headquarters'}</p>
              <p className="mt-1 text-sm text-slate-500">
                {[vendor.city, vendor.postalCode].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        </InfoCard>
      </section>
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
