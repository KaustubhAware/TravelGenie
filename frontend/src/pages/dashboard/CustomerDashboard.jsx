import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBookmark,
  FaRobot,
  FaArrowRight,
} from "react-icons/fa";

import {
  dashboardService,
} from "../../services/dashboardService";

import {
  DASHBOARD_ROUTES,
} from "../../constants/routesPath";

export default function CustomerDashboard() {

  const navigate =
    useNavigate();

  const [packages, setPackages] =
    useState([]);

  const [bookings, setBookings] =
    useState([]);

  /* ===================================================== */
  /* FETCH */
  /* ===================================================== */

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData =
    async () => {

      try {

        const [
          packageRes,
          bookingRes,
        ] = await Promise.all([

          dashboardService.getTrendingPackages(),

          dashboardService.getUserBookings(),

        ]);

        setPackages(
          packageRes.data || []
        );

        setBookings(
          bookingRes.data || []
        );

      } catch (err) {

        console.error(err);

      }

    };

  return (

    <div className="space-y-5">

      {/* ===================================================== */}
      {/* TOP CARD */}
      {/* ===================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}

          <div>

            <p className="text-sm font-semibold text-orange-500">

              Maharashtra AI Travel

            </p>

            <h1 className="mt-2 text-4xl font-black leading-tight text-slate-900">

              Explore smarter
              adventures with AI

            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">

              Discover curated Maharashtra treks,
              AI itineraries, camping experiences,
              and adventure getaways.

            </p>

            {/* BUTTONS */}

            <div className="mt-5 flex flex-wrap gap-3">

              <button
                onClick={() =>
                  navigate(
                    DASHBOARD_ROUTES.aiChat
                  )
                }
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >

                Start AI Planner

              </button>

              <button
                onClick={() =>
                  navigate(
                    DASHBOARD_ROUTES.packages
                  )
                }
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >

                Explore Treks

              </button>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative flex justify-center">

            <img
              src="/maharashtra-map.png"
              alt="Maharashtra"
              className="h-[220px] object-contain"
            />

          </div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* QUICK STATS */}
      {/* ===================================================== */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* BOOKINGS */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">

                Bookings

              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">

                {bookings.length}

              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">

              <FaCalendarAlt />

            </div>

          </div>

        </div>

        {/* SAVED */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">

                Saved Trips

              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">

                8

              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">

              <FaBookmark />

            </div>

          </div>

        </div>

        {/* AI */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">

                AI Plans

              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">

                14

              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">

              <FaRobot />

            </div>

          </div>

        </div>

        {/* WEATHER */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">

                Weather

              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">

                22°C

              </h2>

            </div>

            <div className="text-4xl">

              ☀️

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* TREKS */}
      {/* ===================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-black text-slate-900">

              Trending Treks

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              Popular destinations this week

            </p>

          </div>

          <button
            onClick={() =>
              navigate(
                DASHBOARD_ROUTES.packages
              )
            }
            className="flex items-center gap-2 text-sm font-semibold text-orange-500"
          >

            View All

            <FaArrowRight />

          </button>

        </div>

        {/* GRID */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {packages
            ?.slice(0, 3)
            ?.map((item) => (

              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* IMAGE */}

                <img
                  src={
                    item.image_url
                  }
                  alt={item.title}
                  className="h-44 w-full object-cover"
                />

                {/* CONTENT */}

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

                      <p className="text-xs text-slate-500">

                        Starting From

                      </p>

                      <h4 className="text-2xl font-black text-orange-500">

                        ₹{item.price}

                      </h4>

                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/packages/${item.slug}`
                        )
                      }
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