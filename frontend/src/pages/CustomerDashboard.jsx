import { useNavigate } from "react-router-dom";
import {
  FaBookmark,
  FaFileInvoice,
  FaRobot,
  FaRoute,
  FaUserCircle,
} from "react-icons/fa";

import { DASHBOARD_ROUTES } from "../constants/routes";

const modules = [
  {
    title: "My Bookings",
    text: "Track requests, approvals, payment status, and expedition lifecycle.",
    icon: FaRoute,
    path: DASHBOARD_ROUTES.bookings,
  },
  {
    title: "Saved Trips",
    text: "Return to shortlisted treks and AI-generated plans.",
    icon: FaBookmark,
    path: DASHBOARD_ROUTES.saved,
  },
  {
    title: "AI Recommendations",
    text: "Get preparation, route, weather, and fit recommendations.",
    icon: FaRobot,
    path: DASHBOARD_ROUTES.aiPlanner,
  },
  {
    title: "Profile",
    text: "Manage traveler information used during booking requests.",
    icon: FaUserCircle,
    path: DASHBOARD_ROUTES.profile,
  },
];

const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="relative overflow-hidden rounded-[2rem] bg-primary-dark p-8 text-white shadow-card md:p-10">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80"
          alt="Dashboard mountains"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/88 to-primary-dark/45" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
              Customer dashboard
            </p>
            <h1 className="font-heading mt-4 text-4xl font-bold md:text-5xl">
              Manage your trekking journey
            </h1>
            <p className="mt-4 max-w-2xl text-white/72">
              Bookings, saved trips, invoices, AI recommendations, and profile
              details live here — separate from the public marketing site.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
            <p className="text-sm font-semibold text-accent">Next action</p>
            <p className="mt-2 font-heading text-2xl font-bold">
              Review booking status
            </p>
            <button
              type="button"
              onClick={() => navigate(DASHBOARD_ROUTES.bookings)}
              className="mt-5 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white"
            >
              Open tracker
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <button
            key={module.title}
            type="button"
            onClick={() => navigate(module.path)}
            className="rounded-3xl bg-white p-6 text-left shadow-soft ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-card"
          >
            <module.icon className="text-2xl text-accent" />
            <h2 className="font-heading mt-5 text-2xl font-bold text-ink">
              {module.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {module.text}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl bg-white p-7 shadow-soft ring-1 ring-slate-100">
          <h2 className="font-heading text-2xl font-bold text-ink">
            Booking tracker
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Pending → under review → approved → payment → confirmed. Your
            operator-managed lifecycle stays intact.
          </p>
          <button
            type="button"
            onClick={() => navigate(DASHBOARD_ROUTES.bookings)}
            className="mt-6 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            View all bookings
          </button>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-soft ring-1 ring-slate-100">
          <FaFileInvoice className="text-2xl text-primary" />
          <h2 className="font-heading mt-4 text-2xl font-bold text-ink">
            Payments & invoices
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Complete payment after approval and download expedition invoices.
          </p>
          <button
            type="button"
            onClick={() => navigate(DASHBOARD_ROUTES.payments)}
            className="mt-6 rounded-2xl border border-primary/20 px-5 py-3 text-sm font-semibold text-primary"
          >
            Payment center
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
