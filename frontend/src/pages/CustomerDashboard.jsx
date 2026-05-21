/* ===================================================== */
/* CUSTOMER DASHBOARD */
/* ===================================================== */

import { useNavigate } from "react-router-dom";

import {
  FaBookmark,
  FaFileInvoice,
  FaRobot,
  FaRoute,
  FaUserCircle,
  FaMapMarkedAlt,
  FaMountain,
  FaHotel,
  FaPlaneDeparture,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

import { DASHBOARD_ROUTES } from "../constants/routes";

/* ===================================================== */
/* QUICK MODULES */
/* ===================================================== */

const modules = [
  {
    title: "My Bookings",
    text: "Track trek approvals, payment status, and expedition lifecycle.",
    icon: FaRoute,
    path: DASHBOARD_ROUTES.bookings,
  },

  {
    title: "Saved Trips",
    text: "Access shortlisted treks and saved AI-generated plans.",
    icon: FaBookmark,
    path: DASHBOARD_ROUTES.saved,
  },

  {
    title: "AI Recommendations",
    text: "Get route suggestions, weather insights, and trek preparation tips.",
    icon: FaRobot,
    path: DASHBOARD_ROUTES.aiPlanner,
  },

  {
    title: "Profile",
    text: "Manage traveler details and expedition preferences.",
    icon: FaUserCircle,
    path: DASHBOARD_ROUTES.profile,
  },
];

/* ===================================================== */
/* QUICK SERVICES */
/* ===================================================== */

const services = [
  {
    title: "AI Planner",
    icon: FaRobot,
  },

  {
    title: "Treks",
    icon: FaMountain,
  },

  {
    title: "Hotels",
    icon: FaHotel,
  },

  {
    title: "Transport",
    icon: FaPlaneDeparture,
  },

  {
    title: "Destinations",
    icon: FaMapMarkedAlt,
  },
];

/* ===================================================== */
/* DESTINATIONS */
/* ===================================================== */

const destinations = [
  {
    name: "Kashmir",
    price: "₹14,999",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  },

  {
    name: "Ladakh",
    price: "₹24,999",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
  },

  {
    name: "Himachal",
    price: "₹18,499",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },

  {
    name: "Bali",
    price: "₹39,999",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  },
];

/* ===================================================== */
/* TREK PACKAGES */
/* ===================================================== */

const packages = [
  {
    title: "Kedarnath Trek",
    days: "5D / 4N",
    difficulty: "Moderate",
    price: "₹14,999",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  },

  {
    title: "Ladakh Expedition",
    days: "7D / 6N",
    difficulty: "Difficult",
    price: "₹24,999",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  },

  {
    title: "Himachal Backpacking",
    days: "6D / 5N",
    difficulty: "Easy",
    price: "₹18,999",
    rating: "4.6",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  },
];

/* ===================================================== */
/* COMPONENT */
/* ===================================================== */

const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">

      {/* ===================================================== */}
      {/* HERO SECTION */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden rounded-[2rem] bg-primary-dark shadow-card">

        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
          alt="TravelGenie"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/40" />

        <div className="relative p-8 md:p-12">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
              Customer Dashboard
            </p>

            <h1 className="font-heading mt-4 text-4xl font-bold text-white md:text-6xl">
              Explore Your Next Trekking Adventure
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75">
              Manage bookings, discover destinations, access AI-powered trek
              planning, and organize your complete expedition journey.
            </p>

          </div>

          {/* SEARCH BAR */}

          <div className="mt-8 grid gap-4 rounded-3xl bg-white p-4 shadow-2xl lg:grid-cols-[1.4fr_1fr_1fr_220px]">

            <div>

              <p className="mb-2 text-sm font-semibold text-slate-500">
                Destination
              </p>

              <input
                type="text"
                placeholder="Search destinations"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              />

            </div>

            <div>

              <p className="mb-2 text-sm font-semibold text-slate-500">
                Check In
              </p>

              <input
                type="date"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
              />

            </div>

            <div>

              <p className="mb-2 text-sm font-semibold text-slate-500">
                Duration
              </p>

              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary">

                <option>3 - 5 Days</option>
                <option>5 - 7 Days</option>
                <option>7 - 10 Days</option>

              </select>

            </div>

            <button className="rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark">
              Search Treks
            </button>

          </div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* QUICK SERVICES */}
      {/* ===================================================== */}

      <section className="grid gap-4 rounded-[2rem] bg-white p-5 shadow-soft ring-1 ring-slate-100 md:grid-cols-5">

        {services.map((service) => (
          <div
            key={service.title}
            className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 p-5 transition hover:bg-slate-50"
          >

            <service.icon className="text-3xl text-primary" />

            <p className="mt-3 text-sm font-semibold text-ink">
              {service.title}
            </p>

          </div>
        ))}

      </section>

      {/* ===================================================== */}
      {/* MODULE CARDS */}
      {/* ===================================================== */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {modules.map((module) => (
          <button
            key={module.title}
            type="button"
            onClick={() => navigate(module.path)}
            className="rounded-[2rem] bg-white p-6 text-left shadow-soft ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-card"
          >

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">

              <module.icon className="text-2xl text-primary" />

            </div>

            <h2 className="font-heading mt-5 text-2xl font-bold text-ink">
              {module.title}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {module.text}
            </p>

          </button>
        ))}

      </section>

    </div>
  );
};

export default CustomerDashboard;