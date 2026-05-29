import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  FileBadge,
  Globe2,
  Image,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { vendorService } from "../../services/vendorService";
import logo from "../../assets/logo.svg";

const CATEGORY_OPTIONS = [
  "Trekking",
  "Camping",
  "Adventure",
  "Family Tours",
  "Corporate Trips",
  "Monsoon Treks",
];

const initialForm = {
  business_name: "",
  owner_name: "",
  email: "",
  password: "",
  phone: "",
  gst_number: "",
  business_address: "",
  website_url: "",
  social_links: "",
  years_experience: "",
  categories: [],
  description: "",
  government_id: null,
  business_logo: null,
};

export default function VendorRegister() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleCategory = (category) => {
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.government_id) {
      setError("Government ID upload is required for vendor verification.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "categories") {
        payload.append(key, JSON.stringify(value));
      } else if (value !== null) {
        payload.append(key, value);
      }
    });

    try {
      setLoading(true);
      await vendorService.apply(payload);
      setSubmitted(true);
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
    } catch (err) {
      setError(err.message || "Vendor application could not be submitted.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f7f8f5] px-5 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <ShieldCheck size={30} />
            </div>
            <h1 className="mt-6 text-3xl font-black text-slate-900">
              Application under review
            </h1>
            <p className="mt-3 text-slate-500">
              Your vendor account is currently under review by TravelGenie
              administration. We will notify you after verification.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button onClick={() => navigate("/vendor/login")}>
                Go to vendor login
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Back home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f5] px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="TravelGenie" className="h-11 w-11" />
            <span className="text-2xl font-black text-slate-900">
              Travel<span className="text-orange-500">Genie</span>
            </span>
          </Link>
          <Link
            to="/vendor/login"
            className="text-sm font-semibold text-orange-600"
          >
            Vendor login
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-3xl bg-slate-950 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">
              Marketplace onboarding
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight">
              Apply to become a verified TravelGenie partner.
            </h1>
            <p className="mt-5 leading-relaxed text-slate-300">
              Vendors are reviewed before gaining access to package creation,
              batch management, bookings, and marketplace analytics.
            </p>
            <div className="mt-8 space-y-4 text-sm text-slate-200">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 text-orange-300" size={18} />
                Admin approval is mandatory before vendor dashboard access.
              </div>
              <div className="flex gap-3">
                <FileBadge className="mt-0.5 text-orange-300" size={18} />
                Government ID and business details are required.
              </div>
              <div className="flex gap-3">
                <Building2 className="mt-0.5 text-orange-300" size={18} />
                Approved vendors can manage packages, batches, bookings, and reviews.
              </div>
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Business name" required value={form.business_name} onChange={(e) => updateField("business_name", e.target.value)} />
              <Input label="Owner name" required value={form.owner_name} onChange={(e) => updateField("owner_name", e.target.value)} />
              <Input label="Email" type="email" required value={form.email} onChange={(e) => updateField("email", e.target.value)} />
              <Input label="Password" type="password" required value={form.password} onChange={(e) => updateField("password", e.target.value)} />
              <Input label="Phone" required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
              <Input label="GST number" value={form.gst_number} onChange={(e) => updateField("gst_number", e.target.value)} />
              <Input label="Website or social page" value={form.website_url} onChange={(e) => updateField("website_url", e.target.value)} />
              <Input label="Years of experience" type="number" min="0" value={form.years_experience} onChange={(e) => updateField("years_experience", e.target.value)} />
            </div>

            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Business address
            </label>
            <textarea
              required
              rows={3}
              value={form.business_address}
              onChange={(e) => updateField("business_address", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />

            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Trekking/travel categories
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    form.categories.includes(category)
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-orange-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Business overview
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-5 text-sm font-semibold text-orange-700">
                <FileBadge className="mb-2" size={20} />
                Government ID
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="mt-3 block w-full text-xs text-slate-600"
                  onChange={(e) => updateField("government_id", e.target.files?.[0] || null)}
                />
              </label>
              <label className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-700">
                <Image className="mb-2" size={20} />
                Business logo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="mt-3 block w-full text-xs text-slate-600"
                  onChange={(e) => updateField("business_logo", e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div className="mt-5 grid gap-3 text-xs text-slate-500 md:grid-cols-3">
              <span className="flex items-center gap-2"><Mail size={14} /> Email verified after approval</span>
              <span className="flex items-center gap-2"><Phone size={14} /> Phone shown to admins</span>
              <span className="flex items-center gap-2"><Globe2 size={14} /> Website/social optional</span>
              <span className="flex items-center gap-2"><User size={14} /> Owner profile retained</span>
            </div>

            {error && (
              <p className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} fullWidth className="mt-6">
              Submit vendor application
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
