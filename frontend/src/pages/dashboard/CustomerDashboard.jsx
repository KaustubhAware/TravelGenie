import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBell,
  FaBookmark,
  FaCalendarAlt,
  FaChartLine,
  FaMapMarkerAlt,
  FaRobot,
  FaRoute,
} from "react-icons/fa";

import { dashboardService } from "../../services/dashboardService";
import { DASHBOARD_ROUTES } from "../../constants/routesPath";
import { useAutoRefresh } from "../../hooks/useAutoRefresh";
import { resolveImageUrl } from "../../utils/imageUrl";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchData = async () => {
    const [packageRes, bookingRes, tripRes, notificationRes] =
      await Promise.all([
        dashboardService.getTrendingPackages(),
        dashboardService.getUserBookings(),
        dashboardService.getSavedTrips(),
        dashboardService.getNotifications(),
      ]);

    setPackages(packageRes.data || []);
    setBookings(bookingRes.data || []);
    setSavedTrips(tripRes.data || []);
    setNotifications(notificationRes.data || []);
    setUnreadCount(notificationRes.unreadCount || 0);
  };

  const { loading } = useAutoRefresh(fetchData, {
    intervalMs: 25000,
    immediate: true,
  });

  const upcomingBookings = bookings.filter((item) =>
    ["pending", "under_review", "payment_pending", "paid", "confirmed"].includes(
      item.status
    )
  );
  const confirmedCount = bookings.filter((item) =>
    ["paid", "completed", "confirmed"].includes(item.status)
  ).length;
  const pendingCount = bookings.filter((item) =>
    ["pending", "under_review", "payment_pending"].includes(item.status)
  ).length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-8 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-500">
              Maharashtra AI Travel
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-slate-900">
              Explore smarter adventures with AI
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
              Your live travel workspace for bookings, saved AI itineraries,
              trek recommendations, and important trip alerts.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => navigate(DASHBOARD_ROUTES.aiChat)}
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Plan with AI
              </button>
              <button
                onClick={() => navigate(DASHBOARD_ROUTES.packages)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Explore Treks
              </button>
            </div>
          </div>

          <div className="relative flex justify-center">
            <img
              src="/maharashtra-map.png"
              alt="Maharashtra"
              className="h-[220px] object-contain"
              loading="lazy"
            />
          </div>
        </div>

        <div className="grid border-t border-slate-100 md:grid-cols-3">
          <MiniInsight label="Upcoming trips" value={upcomingBookings.length} />
          <MiniInsight label="Saved itineraries" value={savedTrips.length} />
          <MiniInsight label="Unread alerts" value={unreadCount} />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Bookings" value={bookings.length} icon={<FaCalendarAlt />} />
        <StatTile label="Confirmed" value={confirmedCount} icon={<FaBookmark />} />
        <StatTile label="AI Plans" value={savedTrips.length} icon={<FaRobot />} />
        <StatTile label="Pending" value={pendingCount} icon={<FaBookmark />} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel
          title="Upcoming Trips"
          subtitle="Auto-synced from your latest bookings."
          icon={<FaRoute />}
        >
          <div className="space-y-3">
            {upcomingBookings.slice(0, 4).map((booking) => (
              <div
                key={booking.booking_id || booking.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900">
                    {booking.package_title || booking.destination}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {booking.travel_date ||
                      booking.departure_date ||
                      "Date pending"}{" "}
                    · {booking.persons || booking.travelers || 1} traveler(s)
                  </p>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold capitalize text-orange-700">
                  {booking.status}
                </span>
              </div>
            ))}
            {!loading && upcomingBookings.length === 0 && (
              <EmptyLine text="No upcoming trips yet. Explore treks and create your next booking." />
            )}
          </div>
        </Panel>

        <Panel
          title="Notifications"
          subtitle="Booking, payment, and itinerary updates."
          icon={<FaBell />}
        >
          <div className="space-y-3">
            {notifications.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-4 ${
                  item.is_read
                    ? "border-slate-100 bg-slate-50"
                    : "border-orange-100 bg-orange-50"
                }`}
              >
                <p className="font-bold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {item.message}
                </p>
              </div>
            ))}
            {!loading && notifications.length === 0 && (
              <EmptyLine text="No notifications yet." />
            )}
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Panel title="Saved AI Itineraries" icon={<FaChartLine />}>
          <div className="grid gap-3">
            {savedTrips.slice(0, 3).map((trip) => (
              <div
                key={trip.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="font-bold text-slate-900">{trip.destination}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {trip.days || 1} day(s) · Rs.{" "}
                  {Number(trip.budget || 0).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
            {!loading && savedTrips.length === 0 && (
              <EmptyLine text="Saved AI trips will appear here after you save a plan." />
            )}
          </div>
        </Panel>

        <Panel title="Travel Inspiration">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Monsoon fort treks",
              "Lakeside camping",
              "Sunrise summits",
              "Konkan weekends",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-orange-100 bg-orange-50 p-4"
              >
                <p className="font-bold text-slate-900">{item}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Explore curated Maharashtra experiences matched to your travel
                  style.
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Recommended Treks
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Popular destinations this week
            </p>
          </div>
          <button
            onClick={() => navigate(DASHBOARD_ROUTES.packages)}
            className="flex items-center gap-2 text-sm font-semibold text-orange-500"
          >
            View All
            <FaArrowRight />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packages?.slice(0, 3)?.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={resolveImageUrl(item.featured_image || item.image)}
                onError={(event) => {
                  event.currentTarget.src = "/maharashtra-map.png";
                }}
                alt={item.title}
                className="h-44 w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <FaMapMarkerAlt />
                  {item.location}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Starting From</p>
                    <h4 className="text-2xl font-black text-orange-500">
                      Rs. {Number(item.price || 0).toLocaleString("en-IN")}
                    </h4>
                  </div>
                  <button
                    onClick={() => navigate(`/dashboard/packages/${item.slug}`)}
                    className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MiniInsight({ label, value }) {
  return (
    <div className="border-slate-100 px-6 py-4 md:border-r last:border-r-0">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function StatTile({ label, value, icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">{value}</h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, icon, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {icon && <div className="text-orange-500">{icon}</div>}
      </div>
      {children}
    </div>
  );
}

function EmptyLine({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}
