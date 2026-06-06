import { FaArrowRight, FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../components/ui/PageContainer";
import LandingSectionTitle from "../../components/landing/LandingSectionTitle";

export default function VendorOnboardingSection() {
  const navigate = useNavigate();

  return (
    <section className="landing-section">
      <PageContainer>
        <div className="landing-card overflow-hidden rounded-[32px] bg-gradient-to-br from-white via-[#fffbf7] to-white p-8 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="landing-eyebrow">For Trek Operators</p>
              <LandingSectionTitle
                size="compact"
                lead="Grow Your Business On"
                accent="TravelGenie"
              />
              <p className="landing-body mt-4 max-w-xl text-sm leading-relaxed md:text-base">
                Register as a vendor, get verified by admin, publish real packages
                with images, and manage bookings from a dedicated portal.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/vendor/register")}
                  className="tg-button-primary px-6 py-3 text-sm"
                >
                  <FaStore />
                  Vendor Register
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/vendor/login")}
                  className="tg-button-secondary px-6 py-3 text-sm"
                >
                  Vendor Login
                  <FaArrowRight />
                </button>
              </div>
            </div>
            <div className="rounded-[28px] border border-orange-100 bg-white/80 p-6 backdrop-blur">
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                  Submit business documents for verification
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                  Upload JPG, PNG, or WebP package media
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                  Track bookings, analytics, and payouts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
