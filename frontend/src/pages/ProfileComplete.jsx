import { useState } from "react";
import { FaCompass, FaUserCircle } from "react-icons/fa";

import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/ui/PageContainer";
import SectionContainer from "../components/ui/SectionContainer";
import GlassCard from "../components/ui/GlassCard";
import GradientButton from "../components/ui/GradientButton";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-surface px-5 py-4 text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

export default function ProfileComplete() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);

  const fields = [fullName, phone, city, country, preferences];
  const completion = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  const handleSave = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const res = await fetch("http://127.0.0.1:8000/api/profile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          city,
          country,
          preferences,
        }),
      });

      const data = await res.json();
      alert(data.message || "Profile saved successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <SectionContainer className="py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
          <GlassCard dark className="relative overflow-hidden p-8 md:p-10">
            <img
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80"
              alt="Profile trekking"
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/70 to-primary-dark/20" />
            <div className="relative flex h-full min-h-[420px] flex-col justify-end">
              <FaCompass className="text-4xl text-accent" />
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.24em] text-accent">
                Trekker profile
              </p>
              <h1 className="font-heading mt-4 text-4xl font-bold md:text-5xl">
                Personalize your expedition workspace
              </h1>
              <p className="mt-4 text-white/72">
                Your profile helps operators review booking requests and helps AI tailor preparation notes.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
                <FaUserCircle />
              </div>
              <div>
                <h2 className="font-heading text-3xl font-bold text-ink">
                  Complete your profile
                </h2>
                <p className="mt-1 text-ink-muted">
                  Add traveler details used across bookings and planning.
                </p>
              </div>
            </div>

            <div className="mb-8 rounded-3xl bg-primary/10 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-ink">Profile completion</h3>
                <span className="text-lg font-bold text-primary">{completion}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white">
                <div
                  style={{ width: `${completion}%` }}
                  className="h-full rounded-full bg-accent transition-all duration-500"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full Name" value={fullName} onChange={setFullName} placeholder="Enter full name" />
              <Field label="Phone" value={phone} onChange={setPhone} placeholder="Enter phone" />
              <Field label="City" value={city} onChange={setCity} placeholder="Enter city" />
              <Field label="Country" value={country} onChange={setCountry} placeholder="Enter country" />
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-ink">
                Trek Preferences
              </span>
              <textarea
                rows="5"
                value={preferences}
                onChange={(event) => setPreferences(event.target.value)}
                placeholder="Snow treks, summit routes, meadow camps, food preferences..."
                className={`${inputClass} resize-none`}
              />
            </label>

            <GradientButton
              onClick={handleSave}
              disabled={loading}
              className="mt-8 w-full"
            >
              {loading ? "Saving..." : "Save Profile"}
            </GradientButton>
          </GlassCard>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}

const Field = ({ label, value, onChange, placeholder }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  </label>
);
