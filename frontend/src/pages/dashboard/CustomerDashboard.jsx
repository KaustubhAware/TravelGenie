/* ===================================================== */
/* CUSTOMER DASHBOARD */
/* ===================================================== */

import { useNavigate } from "react-router-dom";

import {
  FaBookmark,
  FaRobot,
  FaRoute,
  FaUserCircle,
  FaMapMarkedAlt,
  FaMountain,
  FaHotel,
  FaPlaneDeparture,
  FaArrowRight,
  FaStar,
  FaCompass,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  DASHBOARD_ROUTES,
} from "../../constants/routesPath";

/* ===================================================== */
/* QUICK MODULES */
/* ===================================================== */

const modules = [

  {
    title: "My Bookings",
    text:
      "Track trek approvals, payment status, and complete expedition lifecycle.",
    icon: FaRoute,
    path: DASHBOARD_ROUTES.bookings,
    color: "bg-orange-50 text-orange-500",
  },

  {
    title: "Saved Trips",
    text:
      "Access AI-generated itineraries and shortlisted destinations.",
    icon: FaBookmark,
    path: DASHBOARD_ROUTES.saved,
    color: "bg-blue-50 text-blue-500",
  },

  {
    title: "AI Planner",
    text:
      "Generate intelligent trekking itineraries with AI assistance.",
    icon: FaRobot,
    path: DASHBOARD_ROUTES.aiPlanner,
    color: "bg-emerald-50 text-emerald-500",
  },

  {
    title: "AI Chat Assistant",
    text:
      "Ask natural language questions about trips, budgets, and destinations.",
    icon: FaRobot,
    path: DASHBOARD_ROUTES.aiChat,
    color: "bg-cyan-50 text-cyan-600",
  },

  {
    title: "Vendor Portal",
    text:
      "Register your travel agency and manage marketplace packages.",
    icon: FaCompass,
    path: DASHBOARD_ROUTES.vendor,
    color: "bg-amber-50 text-amber-600",
  },

  {
    title: "Profile",
    text:
      "Manage traveler details, preferences, and account settings.",
    icon: FaUserCircle,
    path: DASHBOARD_ROUTES.profile,
    color: "bg-purple-50 text-purple-500",
  },

];

/* ===================================================== */
/* SERVICES */
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

  const navigate =
    useNavigate();

  return (

    <div className="space-y-8">

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-black min-h-[520px]">

        {/* IMAGE */}

        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80"
          alt="TravelGenie"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAY */}

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

        {/* CONTENT */}

        <div className="relative z-10 p-8 md:p-12 lg:p-16 h-full flex flex-col justify-between">

          {/* TOP */}

          <div className="max-w-4xl">

            <p className="uppercase tracking-[0.3em] text-orange-400 text-sm font-semibold mb-5">

              Customer Dashboard

            </p>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">

              Explore your next
              trekking adventure

            </h1>

            <p className="mt-6 text-lg leading-relaxed text-white/80 max-w-3xl">

              Manage bookings,
              discover destinations,
              generate AI itineraries,
              and organize your complete trekking journey.

            </p>

            {/* BUTTONS */}

            <div className="flex flex-wrap gap-4 mt-8">

              <button
                onClick={() =>
                  navigate(
                    DASHBOARD_ROUTES.aiPlanner
                  )
                }
                className="bg-orange-500 hover:bg-orange-600 transition text-white px-6 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-sm"
              >

                Start AI Planning

                <FaArrowRight />

              </button>

              <button
                onClick={() =>
                  navigate(
                    "/dashboard/packages"
                  )
                }
                className="bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm transition text-white px-6 py-4 rounded-xl font-semibold"
              >

                Explore Treks

              </button>

            </div>

          </div>

          {/* SEARCH BAR */}

          <div className="mt-12 bg-white rounded-2xl p-4 shadow-2xl grid lg:grid-cols-[1.5fr_1fr_1fr_220px] gap-4">

            {/* DESTINATION */}

            <div>

              <p className="text-sm font-semibold text-slate-500 mb-2">

                Destination

              </p>

              <input
                type="text"
                placeholder="Search destinations"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 outline-none focus:border-orange-500 focus:bg-white transition"
              />

            </div>

            {/* DATE */}

            <div>

              <p className="text-sm font-semibold text-slate-500 mb-2">

                Travel Date

              </p>

              <input
                type="date"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 outline-none focus:border-orange-500 focus:bg-white transition"
              />

            </div>

            {/* DURATION */}

            <div>

              <p className="text-sm font-semibold text-slate-500 mb-2">

                Duration

              </p>

              <select className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 outline-none focus:border-orange-500 focus:bg-white transition">

                <option>

                  3 - 5 Days

                </option>

                <option>

                  5 - 7 Days

                </option>

                <option>

                  7 - 10 Days

                </option>

              </select>

            </div>

            {/* BUTTON */}

            <button className="bg-slate-900 hover:bg-black transition text-white rounded-xl font-semibold flex items-center justify-center gap-3">

              <FaCompass />

              Search Treks

            </button>

          </div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* SERVICES */}
      {/* ===================================================== */}

      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">

        {services.map((service) => (

          <div
            key={service.title}
            className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all duration-300"
          >

            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">

              <service.icon className="text-2xl text-orange-500" />

            </div>

            <p className="mt-4 font-semibold text-slate-900">

              {service.title}

            </p>

          </div>

        ))}

      </section>

      {/* ===================================================== */}
      {/* MODULES */}
      {/* ===================================================== */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {modules.map((module) => (

          <button
            key={module.title}
            type="button"
            onClick={() =>
              navigate(module.path)
            }
            className="bg-white border border-slate-200 rounded-2xl p-7 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >

            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${module.color}`}>

              <module.icon className="text-2xl" />

            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-900">

              {module.title}

            </h2>

            <p className="mt-4 text-slate-500 leading-relaxed">

              {module.text}

            </p>

          </button>

        ))}

      </section>

      {/* ===================================================== */}
      {/* POPULAR DESTINATIONS */}
      {/* ===================================================== */}

      <section>

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">

          <div>

            <p className="uppercase tracking-[0.25em] text-orange-500 text-sm font-semibold">

              Destinations

            </p>

            <h2 className="text-4xl font-black text-slate-900 mt-3">

              Popular Adventures

            </h2>

          </div>

          <button className="text-orange-500 font-semibold flex items-center gap-2">

            View All

            <FaArrowRight />

          </button>

        </div>

        {/* GRID */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {destinations.map((item) => (

            <div
              key={item.name}
              className="group overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500"
            >

              {/* IMAGE */}

              <div className="relative h-[280px] overflow-hidden">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">

                  <h3 className="text-3xl font-black text-white">

                    {item.name}

                  </h3>

                  <p className="text-white/80 mt-2">

                    Starting from {item.price}

                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ===================================================== */}
      {/* PACKAGES */}
      {/* ===================================================== */}

      <section>

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">

          <div>

            <p className="uppercase tracking-[0.25em] text-orange-500 text-sm font-semibold">

              Trek Packages

            </p>

            <h2 className="text-4xl font-black text-slate-900 mt-3">

              Trending Expeditions

            </h2>

          </div>

          <button
            onClick={() =>
              navigate("/dashboard/packages")
            }
            className="text-orange-500 font-semibold flex items-center gap-2"
          >

            Explore More

            <FaArrowRight />

          </button>

        </div>

        {/* GRID */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {packages.map((item) => (

            <div
              key={item.title}
              className="overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500"
            >

              {/* IMAGE */}

              <div className="relative h-[260px]">

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-5 right-5 bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">

                  <FaStar className="text-orange-400" />

                  <span className="font-semibold text-slate-900">

                    {item.rating}

                  </span>

                </div>

              </div>

              {/* CONTENT */}

              <div className="p-6">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h3 className="text-2xl font-black text-slate-900">

                      {item.title}

                    </h3>

                    <p className="text-slate-500 mt-2">

                      {item.days} • {item.difficulty}

                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm text-slate-500">

                      Starting From

                    </p>

                    <h4 className="text-2xl font-black text-orange-500 mt-1">

                      {item.price}

                    </h4>

                  </div>

                </div>

                {/* BUTTON */}

                <button className="w-full mt-6 bg-slate-900 hover:bg-black transition text-white py-4 rounded-xl font-semibold">

                  View Package

                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>

  );

};

export default CustomerDashboard;