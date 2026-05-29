import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  ShieldAlert,
  Store,
  XCircle,
} from "lucide-react";

import { vendorService } from "../../services/vendorService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/ui/Button";
import { resolveImageUrl } from "../../utils/imageUrl";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
  suspended: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await vendorService.adminList();
      setVendors(res.data?.vendors || []);
    } catch (err) {
      setError(err.message || "Vendor applications could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    return vendors.reduce(
      (acc, vendor) => {
        const status = vendor.verification_status || "pending";
        acc[status] = (acc[status] || 0) + 1;
        acc.total += 1;
        return acc;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0, suspended: 0 }
    );
  }, [vendors]);

  const handleStatus = async (vendor, status) => {
    let rejectionReason = "";
    if (status === "rejected") {
      rejectionReason = window.prompt("Reason for rejection") || "";
      if (!rejectionReason.trim()) {
        setError("Rejection reason is required.");
        return;
      }
    }

    const actionKey = `${vendor.vendor_id}-${status}`;
    setActionLoading(actionKey);
    setError("");

    try {
      await vendorService.verify(vendor.vendor_id, {
        verification_status: status,
        is_active: status === "approved",
        rejection_reason: rejectionReason,
      });
      await load();
    } catch (err) {
      setError(err.message || "Vendor status could not be updated.");
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner text="Loading vendor applications..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            Marketplace moderation
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Vendor Approval Center
          </h1>
          <p className="mt-2 text-slate-500">
            Review applications, verify documents, and control marketplace access.
          </p>
        </div>
        <Button variant="outline" onClick={load}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {["total", "pending", "approved", "rejected", "suspended"].map((key) => (
          <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {key}
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {counts[key] || 0}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-5">
        {vendors.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            No vendor applications yet.
          </div>
        ) : (
          vendors.map((vendor) => {
            const status = vendor.verification_status || "pending";
            const logo = resolveImageUrl(vendor.logo, "/favicon.svg");

            return (
              <article
                key={vendor.vendor_id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      {vendor.logo ? (
                        <img
                          src={logo}
                          alt={vendor.business_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Store className="text-slate-400" size={26} />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-black text-slate-900">
                          {vendor.business_name}
                        </h2>
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${STATUS_STYLES[status]}`}>
                          {status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {vendor.owner_name} · {vendor.contact_email} · {vendor.phone || "No phone"}
                      </p>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                        {vendor.description || "No business overview submitted."}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {status !== "approved" && (
                      <Button
                        size="sm"
                        loading={actionLoading === `${vendor.vendor_id}-approved`}
                        icon={<CheckCircle2 size={16} />}
                        onClick={() => handleStatus(vendor, "approved")}
                      >
                        Approve
                      </Button>
                    )}
                    {status !== "rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        loading={actionLoading === `${vendor.vendor_id}-rejected`}
                        icon={<XCircle size={16} />}
                        onClick={() => handleStatus(vendor, "rejected")}
                      >
                        Reject
                      </Button>
                    )}
                    {status === "approved" && (
                      <Button
                        size="sm"
                        variant="danger"
                        loading={actionLoading === `${vendor.vendor_id}-suspended`}
                        icon={<Ban size={16} />}
                        onClick={() => handleStatus(vendor, "suspended")}
                      >
                        Suspend
                      </Button>
                    )}
                    {status === "suspended" && (
                      <Button
                        size="sm"
                        variant="success"
                        loading={actionLoading === `${vendor.vendor_id}-approved`}
                        icon={<RotateCcw size={16} />}
                        onClick={() => handleStatus(vendor, "approved")}
                      >
                        Reactivate
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Info label="GST" value={vendor.gst_number || "Not provided"} />
                  <Info label="Experience" value={`${vendor.years_experience || 0} years`} />
                  <Info label="Address" value={vendor.business_address || "Not provided"} />
                  <Info
                    label="Categories"
                    value={
                      Array.isArray(vendor.categories)
                        ? vendor.categories.join(", ")
                        : "Not provided"
                    }
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  {vendor.website_url && (
                    <a
                      href={vendor.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-semibold text-slate-700"
                    >
                      Website <ExternalLink size={14} />
                    </a>
                  )}
                  {vendor.government_id_path && (
                    <a
                      href={resolveImageUrl(vendor.government_id_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 font-semibold text-orange-700"
                    >
                      Government ID <ShieldAlert size={14} />
                    </a>
                  )}
                  {vendor.rejection_reason && (
                    <span className="rounded-full bg-red-50 px-4 py-2 font-semibold text-red-700">
                      Reason: {vendor.rejection_reason}
                    </span>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}
