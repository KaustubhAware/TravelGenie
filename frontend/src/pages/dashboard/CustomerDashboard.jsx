import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBell,
  FaBookmark,
  FaCalendarAlt,
  FaCompass,
  FaMapMarkerAlt,
  FaRobot,
  FaRoute,
  FaWallet,
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

  const destinationHighlights = useMemo(() => {
    const seen = new Set();
    const highlights = [];

    for (const pkg of packages) {
      const location = String(pkg.location || pkg.region || "").trim();
      if (!location || seen.has(location.toLowerCase())) continue;
      seen.add(location.toLowerCase());
      highlights.push({
        id: `${pkg.id}-${location}`,
        title: location,
        subtitle: pkg.title,
        image: pkg.featured_image || pkg.image,
        slug: pkg.slug,
      });
      if (highlights.length >= 4) break;
    }

    return highlights;
  }, [packages]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-orange-100 bg-gradient-to-br from-white via-orange-50 to-white shadow-[0_24px_60px_rgba(249,115,22,0.12)]">
        <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-orange-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="relative grid gap-8 p-7 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
              Maharashtra AI Travel
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight text-[#08112b] md:text-5xl">
              Your premium travel command center
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              Track bookings, saved AI itineraries, trek inspiration, and live
              alerts — all synced automatically every few seconds.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(DASHBOARD_ROUTES.aiChat)}
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Plan with AI
              </button>
              <button
                type="button"
                onClick={() => navigate(DASHBOARD_ROUTES.savedTrips)}
                className="rounded-2xl border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-[#08112b] transition hover:bg-orange-50"
              >
                Saved Trips
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/packages")}
                className="rounded-2xl border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                Explore Treks
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-[28px] bg-orange-50/80 backdrop-blur-sm" />
            <img
              src="/maharashtra-map.png"
              alt="Maharashtra travel map"
              className="relative z-10 h-[220px] object-contain drop-shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>

        <div className="relative grid border-t border-orange-100 md:grid-cols-3">
          <HeroMetric label="Upcoming trips" value={upcomingBookings.length} />
          <HeroMetric label="Saved itineraries" value={savedTrips.length} />
          <HeroMetric label="Unread alerts" value={unreadCount} highlight />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Total bookings"
          value={bookings.length}
          hint="All-time reservations"
          icon={<FaCalendarAlt />}
          tone="soft"
        />
        <StatTile
          label="Confirmed"
          value={confirmedCount}
          hint="Paid or completed"
          icon={<FaBookmark />}
          tone="medium"
        />
        <StatTile
          label="AI plans saved"
          value={savedTrips.length}
          hint="Synced itineraries"
          icon={<FaRobot />}
          tone="bold"
        />
        <StatTile
          label="Pending action"
          value={pendingCount}
          hint="Needs payment or review"
          icon={<FaWallet />}
          tone="warm"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel
          title="Upcoming Trips"
          subtitle="Auto-synced from your latest bookings."
          icon={<FaRoute />}
          action={
            <button
              type="button"
              onClick={() => navigate(DASHBOARD_ROUTES.bookings)}
              className="text-sm font-semibold text-orange-500"
            >
              View all
            </button>
          }
        >
          <div className="space-y-3">
            {upcomingBookings.slice(0, 4).map((booking) => (
              <button
                key={booking.booking_id || booking.id}
                type="button"
                onClick={() =>
                  navigate(
                    DASHBOARD_ROUTES.bookingDetail(
                      booking.booking_id || booking.id
                    )
                  )
                }
                className="flex w-full flex-col gap-3 rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white p-4 text-left transition hover:border-orange-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
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
                <span className="w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-bold capitalize text-orange-700">
                  {booking.status}
                </span>
              </button>
            ))}
            {!loading && upcomingBookings.length === 0 && (
              <EmptyLine text="No upcoming trips yet. Explore treks and create your next booking." />
            )}
          </div>
        </Panel>

        <Panel
          title="Notifications"
          subtitle={`${unreadCount} unread · booking, payment, and itinerary updates`}
          icon={<FaBell />}
        >
          <div className="space-y-3">
            {notifications.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-4 ${
                  item.is_read
                    ? "border-slate-100 bg-slate-50"
                    : "border-orange-200 bg-gradient-to-r from-orange-50 to-white shadow-sm"
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

      <section className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Saved AI Itineraries"
          subtitle="Count matches your saved trip records."
          icon={<FaCompass />}
          action={
            <button
              type="button"
              onClick={() => navigate(DASHBOARD_ROUTES.savedTrips)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500"
            >
              Manage
              <FaArrowRight />
            </button>
          }
        >
          <div className="grid gap-3">
            {savedTrips.slice(0, 3).map((trip) => (
              <button
                key={trip.id}
                type="button"
                onClick={() => navigate(DASHBOARD_ROUTES.savedTrips)}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-orange-200 hover:bg-white"
              >
                <p className="font-bold text-slate-900">
                  {trip.title || trip.destination}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {trip.days || 1} day(s) · Rs.{" "}
                  {Number(trip.budget || 0).toLocaleString("en-IN")}
                </p>
              </button>
            ))}
            {!loading && savedTrips.length === 0 && (
              <EmptyLine text="Saved AI trips will appear here after you save a plan." />
            )}
          </div>
        </Panel>

        <Panel title="Destination Highlights" icon={<FaMapMarkerAlt />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {destinationHighlights.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  navigate(
                    item.slug
                      ? `/dashboard/packages/${item.slug}`
                      : "/dashboard/packages"
                  )
                }
                className="overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white text-left transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <img
                  src={resolveImageUrl(item.image)}
                  alt={item.title}
                  className="h-28 w-full object-cover"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = "/maharashtra-map.png";
                  }}
                />
                <div className="p-4">
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.subtitle}</p>
                </div>
              </button>
            ))}
            {!loading && destinationHighlights.length === 0 && (
              <div className="sm:col-span-2">
                <EmptyLine text="Destination highlights appear once packages are available." />
              </div>
            )}
          </div>
        </Panel>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Curated for you
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Recommended Treks
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Popular active packages from the platform
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/packages")}
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
          >
            View all packages
            <FaArrowRight />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packages?.slice(0, 3)?.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={resolveImageUrl(item.featured_image || item.image)}
                  onError={(event) => {
                    event.currentTarget.src = "/maharashtra-map.png";
                  }}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08112b]/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <FaMapMarkerAlt />
                    {item.location}
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs text-slate-500">Starting from</p>
                  <h4 className="text-2xl font-black text-orange-500">
                    Rs. {Number(item.price || 0).toLocaleString("en-IN")}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/packages/${item.slug}`)}
                  className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  View
                </button>
              </div>
            </article>
          ))}
          {!loading && packages.length === 0 && (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyLine text="Recommended treks will appear when packages are published." />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function HeroMetric({ label, value, highlight = false }) {
  return (
    <div className="border-orange-100 bg-white/60 px-6 py-5 md:border-r last:md:border-r-0">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-black ${
          highlight ? "text-orange-500" : "text-[#08112b]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

const toneStyles = {
  soft: "from-orange-50 to-white text-orange-500",
  medium: "from-orange-100 to-white text-orange-600",
  bold: "from-orange-200/70 to-white text-orange-700",
  warm: "from-amber-50 to-white text-orange-600",
};

function StatTile({ label, value, hint, icon, tone = "soft" }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">{value}</h2>
          <p className="mt-2 text-xs text-slate-400">{hint}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${toneStyles[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, icon, action, children }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-black text-slate-900">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyLine({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}
