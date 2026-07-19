import { Link, useLocation, useParams } from 'react-router';
import { ArrowRight, Building2, Info, Map, Pencil, Users } from 'lucide-react';
import { Button } from '@/components/core-components/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/core-components/breadcrumb';
import { useGetVendorByIdQuery } from '@/features/vendors/vendorApi';
import type { Vendor } from '@/features/vendors/vendorTypes';

const complianceActivity = [
  { documentName: 'Quality Assurance Cert 2023', expiryDate: 'Dec 12, 2024', status: 'VALID' },
  { documentName: 'Safety Regulation Protocol', expiryDate: 'Jan 15, 2025', status: 'VALID' },
  { documentName: 'Logistics License Renewal', expiryDate: 'Oct 01, 2023', status: 'EXPIRED' },
];

const VendorDetailPage = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const location = useLocation();
  const stateVendor = (location.state as { vendor?: Vendor } | null)?.vendor;
  const { data: fetchedVendor, isLoading, isError } = useGetVendorByIdQuery(vendorId ?? '', { skip: !vendorId });
  const vendor = fetchedVendor ?? stateVendor;

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
            <BreadcrumbPage className="font-bold text-blue-800">{vendor.vendorName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <span className="inline-flex rounded bg-blue-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-blue-800">
            Active Vendor
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            {vendor.vendorName} <span className="font-normal text-slate-300">(Vendor Detail)</span>
          </h1>
        </div>
        <Button className="h-14 rounded-lg bg-blue-900 px-7 text-white hover:bg-blue-950">
          <Pencil data-icon="inline-start" className="size-4" />
          Edit Profile
        </Button>
      </div>

      <section className="mt-12 rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
          <Info className="size-5 text-blue-800" />
          <h2 className="text-lg font-semibold">General Information</h2>
        </div>
        <div className="grid gap-x-16 gap-y-8 pt-7 md:grid-cols-3">
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
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <ManagementCard
          icon={<Users className="size-7 text-blue-800" />}
          title="Vendor Employees"
          description="Manage and view all registered employees for this vendor. Access roles, permissions, and history."
          linkLabel="Manage Employees"
          to={`/system-admin/vendors/${vendor.vendorSysId}/employee`}
        />
        <ManagementCard
          icon={<Building2 className="size-7 text-blue-800" />}
          title="Vendor Customers"
          description="Manage and view all associated customers for this vendor. Review contracts, compliance status, and revenue."
          linkLabel="Manage Customers"
          to={`/system-admin/vendors/${vendor.vendorSysId}/customers`}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Compliance Activity</h2>
            <button className="text-sm font-semibold text-blue-800 transition-colors hover:text-blue-600 hover:underline">
              View All
            </button>
          </div>
          <div className="mt-6 overflow-hidden">
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
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          activity.status === 'VALID'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <Map className="size-5 text-blue-800" />
            <h2 className="text-lg font-semibold">Headquarters</h2>
          </div>
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
        </div>
      </section>
    </main>
  );
};

const DetailField = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-xs font-bold text-slate-500">{label}</p>
    <p className={`mt-2 text-base font-semibold ${value ? 'text-slate-900' : 'italic text-slate-300'}`}>
      {value || 'Not provided'}
    </p>
  </div>
);

const ManagementCard = ({
  icon,
  title,
  description,
  linkLabel,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkLabel: string;
  to: string;
}) => (
  <div className="flex items-start gap-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
    <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-blue-100">{icon}</div>
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
      <Link
        to={to}
        className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-800 transition-colors hover:text-blue-600 hover:underline"
      >
        {linkLabel}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  </div>
);

export default VendorDetailPage;
