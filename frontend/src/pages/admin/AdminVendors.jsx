import { useCallback, useEffect, useState } from "react";
import { vendorService } from "../../services/vendorService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/ui/Button";

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vendorService.adminList();
      setVendors(res.data?.vendors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleVerify = async (vendorId, status) => {
    await vendorService.verify(vendorId, {
      verification_status: status,
      is_active: status === "approved",
    });
    await load();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Vendor Marketplace</h1>
        <p className="mt-2 text-slate-500">
          Approve or reject travel agency registrations.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4">Business</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.vendor_id} className="border-t border-slate-100">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {vendor.business_name}
                </td>
                <td className="px-6 py-4">{vendor.owner_name}</td>
                <td className="px-6 py-4">{vendor.contact_email}</td>
                <td className="px-6 py-4 capitalize">
                  {vendor.verification_status}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        handleVerify(vendor.vendor_id, "approved")
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleVerify(vendor.vendor_id, "rejected")
                      }
                    >
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
