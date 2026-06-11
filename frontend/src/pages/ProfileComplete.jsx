import { useEffect, useState } from "react";
import { FaCompass, FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import { useJwtAuth } from "../hooks/useJwtAuth";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { apiRequest } from "../services/httpClient";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:bg-white";

export default function ProfileComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, authReady } = useJwtAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authReady || user) {
      return;
    }

    navigate(
      location.pathname.startsWith("/vendor")
        ? "/vendor/login"
        : "/login",
      { replace: true }
    );
  }, [authReady, user, navigate, location.pathname]);

  useEffect(() => {
    if (!authReady || !user?.id) return;

    apiRequest("/profile/me", {
      skipAuthRedirect: true,
    })
      .then((data) => {
        const profile = data.profile || {};
        setFullName(profile.full_name || "");
        setPhone(profile.phone || "");
        setCity(profile.city || "");
        setCountry(profile.country || "");
        setEmergencyContact(profile.emergency_contact || "");
        setProfileImage(profile.profile_image || "");
        setPreferences(profile.preferences || "");
      })
      .catch(() => {});
  }, [authReady, user?.id]);

  const fields = [fullName, phone, city, country, emergencyContact, preferences];
  const completion = Math.round(
    (fields.filter(Boolean).length / fields.length) * 100
  );

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await apiRequest("/profile/save", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          phone,
          emergency_contact: emergencyContact,
          city,
          country,
          preferences,
          travel_preferences: preferences
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          profile_image: profileImage,
        }),
      });

      alert(data.message || "Profile saved successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (!authReady) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PageContainer className="py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card hover={false} className="relative overflow-hidden p-0">
          <img
            src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80"
            alt="Profile"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
          <div className="relative flex min-h-[360px] flex-col justify-end p-8 text-white">
            <FaCompass className="text-3xl text-orange-400" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
              Traveler profile
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Personalize your travel workspace
            </h1>
          </div>
        </Card>

        <Card hover={false} padding="lg">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-xl text-orange-500">
              <FaUserCircle />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Complete your profile
              </h2>
            </div>
          </div>

          <div className="mb-8 rounded-2xl bg-slate-50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Completion</h3>
              <span className="text-lg font-bold text-orange-500">
                {completion}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white">
              <div
                style={{ width: `${completion}%` }}
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name" value={fullName} onChange={setFullName} />
            <Field label="Phone" value={phone} onChange={setPhone} />
            <Field
              label="Emergency Contact"
              value={emergencyContact}
              onChange={setEmergencyContact}
            />
            <Field label="City" value={city} onChange={setCity} />
            <Field label="Country" value={country} onChange={setCountry} />
            <Field
              label="Profile Image URL"
              value={profileImage}
              onChange={setProfileImage}
            />
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Travel preferences
            </span>
            <textarea
              rows={4}
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </label>

          <Button
            onClick={handleSave}
            disabled={loading}
            fullWidth
            className="mt-8"
          >
            {loading ? "Saving..." : "Save profile"}
          </Button>
        </Card>
      </div>
    </PageContainer>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}
