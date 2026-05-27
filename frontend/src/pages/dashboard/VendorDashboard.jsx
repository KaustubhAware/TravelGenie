import { useCallback, useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaMoneyBillWave,
  FaStore,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";

import { vendorService } from "../../services/vendorService";
import { useJwtAuth } from "../../hooks/useJwtAuth";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import StatCard from "../../components/ui/StatCard";

const MH_DESTINATIONS = [
  "Lonavala",
  "Kalsubai",
  "Rajmachi",
  "Harishchandragad",
  "Matheran",
  "Alibaug",
  "Mahabaleshwar",
  "Bhandardara",
];

export default function VendorDashboard() {
  const { user, authReady } = useJwtAuth();
  const [profile, setProfile] = useState(null);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [batches, setBatches] = useState([]);
  const [stats, setStats] = useState({
    packages: 0,
    total_bookings: 0,
    completed_bookings: 0,
    pending_bookings: 0,
    revenue: 0,
    upcoming_batches: 0,
    occupancy: 0,
  });
  const [loading, setLoading] = useState(true);
  const [savingPackage, setSavingPackage] = useState(false);
  const [formError, setFormError] = useState("");
  const [registerForm, setRegisterForm] = useState({
    business_name: "",
    owner_name: "",
    contact_email: "",
    phone: "",
    description: "",
  });
  const [packageForm, setPackageForm] = useState({
    title: "",
    location: "",
    pricing: "",
    itinerary: "",
  });
  const [batchForm, setBatchForm] = useState({
    package_id: "",
    start_date: "",
    end_date: "",
    booking_deadline: "",
    max_seats: "20",
    booked_seats: "0",
    pickup_location: "Pune",
    guide_name: "",
  });

  const loadVendorData = useCallback(async () => {
    setLoading(true);
    try {
      const profileRes = await vendorService.getProfile();
      setProfile(profileRes.data);

      if (profileRes.data?.verification_status === "approved") {
        const [pkgRes, analyticsRes] = await Promise.all([
          vendorService.getPackages(),
          vendorService.getAnalytics(),
        ]);
        const batchRes = await vendorService.getBatches().catch(() => ({ data: { batches: [] } }));
        setPackages(pkgRes.data?.packages || []);
        setStats(
          analyticsRes.data?.stats || {
            packages: 0,
            total_bookings: 0,
            completed_bookings: 0,
            pending_bookings: 0,
            revenue: 0,
          }
        );
        setBookings(analyticsRes.data?.bookings || []);
        setBatches(batchRes.data?.batches || []);
      }
    } catch {
      setProfile(null);
      setPackages([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authReady || !user) return;
    loadVendorData();
  }, [authReady, user, loadVendorData]);

  const handleRegister = async (e) => {
    e.preventDefault();
    await vendorService.register(registerForm);
    await loadVendorData();
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();

    const title = packageForm.title.trim();
    const location = packageForm.location.trim();
    const pricing = Number(packageForm.pricing);

    if (title.length < 3) {
      setFormError("Package title must be at least 3 characters.");
      return;
    }

    if (!location) {
      setFormError("Select a Maharashtra destination.");
      return;
    }

    if (!Number.isFinite(pricing) || pricing <= 0) {
      setFormError("Enter a valid package price greater than 0.");
      return;
    }

    try {
      setSavingPackage(true);
      setFormError("");
      await vendorService.createPackage({
        title,
        location,
        pricing,
        itinerary: packageForm.itinerary.trim(),
      });
      setPackageForm({ title: "", location: "", pricing: "", itinerary: "" });
      await loadVendorData();
    } catch (err) {
      setFormError(err.message || "Package could not be created.");
    } finally {
      setSavingPackage(false);
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    const packageId = Number(batchForm.package_id);
    if (!packageId || !batchForm.start_date || !batchForm.end_date || !batchForm.booking_deadline) {
      setFormError("Select a package and complete all batch dates.");
      return;
    }

    try {
      setSavingPackage(true);
      setFormError("");
      await vendorService.createBatch({
        ...batchForm,
        package_id: packageId,
        max_seats: Number(batchForm.max_seats || 0),
        booked_seats: Number(batchForm.booked_seats || 0),
      });
      setBatchForm({
        package_id: "",
        start_date: "",
        end_date: "",
        booking_deadline: "",
        max_seats: "20",
        booked_seats: "0",
        pickup_location: "Pune",
        guide_name: "",
      });
      await loadVendorData();
    } catch (err) {
      setFormError(err.message || "Batch could not be created.");
    } finally {
      setSavingPackage(false);
    }
  };

  if (!authReady || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner text="Loading vendor portal..." />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 text-orange-500">
          <FaStore className="text-2xl" />
          <h1 className="text-2xl font-bold text-slate-900">
            Maharashtra Vendor Registration
          </h1>
        </div>
        <p className="mt-3 text-slate-500">
          List Sahyadri treks, Konkan tours, and camping experiences for
          TravelGenie travelers.
        </p>
        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <Input
            placeholder="Business name"
            value={registerForm.business_name}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, business_name: e.target.value })
            }
          />
          <Input
            placeholder="Owner name"
            value={registerForm.owner_name}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, owner_name: e.target.value })
            }
          />
          <Input
            placeholder="Contact email"
            type="email"
            value={registerForm.contact_email}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, contact_email: e.target.value })
            }
          />
          <Input
            placeholder="Phone"
            value={registerForm.phone}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, phone: e.target.value })
            }
          />
          <textarea
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Describe your Maharashtra trek operations..."
            rows={4}
            value={registerForm.description}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, description: e.target.value })
            }
          />
          <Button type="submit">Submit for approval</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Vendor portal
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {profile.business_name}
        </h1>
        <p className="mt-2 text-slate-500">
          Status:{" "}
          <span className="font-semibold capitalize text-slate-800">
            {profile.verification_status}
          </span>
        </p>
      </div>

      {profile.verification_status === "approved" && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Packages"
              value={stats.packages}
              icon={<FaBoxOpen className="text-blue-600 text-xl" />}
              bgColor="bg-blue-50"
            />
            <StatCard
              title="Bookings"
              value={stats.total_bookings}
              icon={<FaClipboardList className="text-orange-600 text-xl" />}
              bgColor="bg-orange-50"
            />
            <StatCard
              title="Pending"
              value={stats.pending_bookings}
              icon={<FaClipboardList className="text-amber-600 text-xl" />}
              bgColor="bg-amber-50"
            />
            <StatCard
              title="Revenue"
              value={`₹${Number(stats.revenue).toLocaleString("en-IN")}`}
              icon={<FaMoneyBillWave className="text-emerald-600 text-xl" />}
              bgColor="bg-emerald-50"
            />
            <StatCard
              title="Occupancy"
              value={`${Number(stats.occupancy || 0)}%`}
              icon={<FaChartLine className="text-cyan-600 text-xl" />}
              bgColor="bg-cyan-50"
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <form
              onSubmit={handleCreatePackage}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
            >
              <h2 className="text-xl font-bold text-slate-900">
                Add Maharashtra package
              </h2>
              <Input
                placeholder="Package title"
                value={packageForm.title}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, title: e.target.value })
                }
              />
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                value={packageForm.location}
                onChange={(e) =>
                  setPackageForm({
                    ...packageForm,
                    location: e.target.value,
                  })
                }
              >
                <option value="">Select destination</option>
                {MH_DESTINATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Price (₹)"
                type="number"
                value={packageForm.pricing}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, pricing: e.target.value })
                }
              />
              <textarea
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                placeholder="Itinerary outline"
                rows={4}
                value={packageForm.itinerary}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, itinerary: e.target.value })
                }
              />
              {formError && (
                <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </p>
              )}
              <Button type="submit" loading={savingPackage}>
                {savingPackage ? "Creating..." : "Create package"}
              </Button>
            </form>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Your packages
              </h2>
              {packages.length === 0 ? (
                <p className="text-sm text-slate-500">No packages yet.</p>
              ) : (
                <ul className="space-y-3 max-h-[320px] overflow-y-auto">
                  {packages.map((pkg) => (
                    <li
                      key={pkg.id}
                      className="rounded-xl border border-slate-100 p-4"
                    >
                      <p className="font-semibold text-slate-900">{pkg.title}</p>
                      <p className="text-sm text-slate-500">
                        {pkg.location || pkg.destination} · ₹{pkg.pricing}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <form
              onSubmit={handleCreateBatch}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
            >
              <h2 className="text-xl font-bold text-slate-900">
                Create trek batch
              </h2>
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                value={batchForm.package_id}
                onChange={(e) => setBatchForm({ ...batchForm, package_id: e.target.value })}
              >
                <option value="">Select package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.package_id || pkg.id}>
                    {pkg.title}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <Input type="date" value={batchForm.start_date} onChange={(e) => setBatchForm({ ...batchForm, start_date: e.target.value })} />
                <Input type="date" value={batchForm.end_date} onChange={(e) => setBatchForm({ ...batchForm, end_date: e.target.value })} />
                <Input type="date" value={batchForm.booking_deadline} onChange={(e) => setBatchForm({ ...batchForm, booking_deadline: e.target.value })} />
                <Input type="number" placeholder="Max seats" value={batchForm.max_seats} onChange={(e) => setBatchForm({ ...batchForm, max_seats: e.target.value })} />
                <Input placeholder="Pickup location" value={batchForm.pickup_location} onChange={(e) => setBatchForm({ ...batchForm, pickup_location: e.target.value })} />
                <Input placeholder="Guide name" value={batchForm.guide_name} onChange={(e) => setBatchForm({ ...batchForm, guide_name: e.target.value })} />
              </div>
              <Button type="submit" loading={savingPackage}>
                Create batch
              </Button>
            </form>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Upcoming batches
              </h2>
              {batches.length === 0 ? (
                <p className="text-sm text-slate-500">No batches scheduled yet.</p>
              ) : (
                <ul className="space-y-3 max-h-[360px] overflow-y-auto">
                  {batches.map((batch) => (
                    <li key={batch.id} className="rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900">{batch.package_title}</p>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          {batch.seats_left} left
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        <FaCalendarAlt className="inline mr-2" />
                        {batch.start_date} to {batch.end_date} · {batch.pickup_location}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-xl font-bold text-slate-900">
                Your bookings
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Package</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        No bookings for your packages yet.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.booking_id} className="border-t border-slate-100">
                        <td className="px-6 py-4">{b.booking_id}</td>
                        <td className="px-6 py-4">{b.name}</td>
                        <td className="px-6 py-4">
                          {b.package_title || b.destination}
                        </td>
                        <td className="px-6 py-4 capitalize">{b.status}</td>
                        <td className="px-6 py-4 font-medium">
                          ₹{b.total_cost}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
