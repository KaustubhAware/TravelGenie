import {
  FaArrowRight,
  FaRobot,
  FaBrain,
  FaMapMarkedAlt,
  FaRoute,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import PageContainer from "../../components/ui/PageContainer";

import Button from "../../components/ui/Button";

export default function AIPlannerBanner() {

  const navigate =
    useNavigate();

  /* ===================================================== */
  /* FEATURES */
  /* ===================================================== */

  const features = [

    {
      icon: <FaBrain />,
      title: "Smart Recommendations",
    },

    {
      icon: <FaMapMarkedAlt />,
      title: "Personalized Itineraries",
    },

    {
      icon: <FaRoute />,
      title: "Optimized Trek Planning",
    },

  ];

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <section className="py-28 bg-slate-50 overflow-hidden">

      <PageContainer>

        <div className="relative overflow-hidden rounded-[40px] border border-orange-100 bg-gradient-to-br from-[#08112b] via-[#1a1208] to-orange-950 px-8 py-16 md:px-16 md:py-20">

          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-orange-500/25 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-orange-300/10 blur-3xl" />

          {/* ===================================================== */}
          {/* CONTENT */}
          {/* ===================================================== */}

          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">

            {/* ===================================================== */}
            {/* LEFT */}
            {/* ===================================================== */}

            <div>

              {/* BADGE */}

              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl">

                <FaRobot className="text-orange-300" />

                <span className="text-sm font-semibold text-white/80">

                  AI Travel Assistant

                </span>

              </div>

              {/* TITLE */}

              <h2 className="mt-8 text-4xl md:text-6xl font-black text-white leading-tight">

                Plan Your Perfect
                Adventure With AI

              </h2>

              {/* DESCRIPTION */}

              <p className="mt-8 text-lg text-slate-300 leading-relaxed max-w-2xl">

                TravelGenie uses intelligent AI assistance
                to generate smarter itineraries, optimize
                budgets, recommend treks, and simplify
                travel planning workflows.

              </p>

              {/* FEATURES */}

              <div className="grid sm:grid-cols-3 gap-5 mt-10">

                {features.map((feature) => (

                  <div
                    key={feature.title}
                    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5"
                  >

                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-300 flex items-center justify-center text-lg">

                      {feature.icon}

                    </div>

                    <h3 className="mt-4 text-sm font-bold text-white leading-relaxed">

                      {feature.title}

                    </h3>

                  </div>

                ))}

              </div>

              {/* BUTTON */}

              <Button
                size="lg"
                className="mt-12"
                icon={<FaArrowRight />}
                onClick={() =>
                  navigate(
                    "/dashboard/ai-planner"
                  )
                }
              >

                Start AI Planning

              </Button>

            </div>

            {/* ===================================================== */}
            {/* RIGHT */}
            {/* ===================================================== */}

            <div className="relative">

              {/* MAIN CARD */}

              <div className="rounded-[36px] border border-white/10 bg-white/10 backdrop-blur-2xl p-8 shadow-2xl">

                {/* TOP */}

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-300">

                      AI Planning Session

                    </p>

                    <h3 className="mt-2 text-3xl font-black text-white">

                      Kedarkantha Trek

                    </h3>

                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-xl shadow-lg shadow-orange-500/30">

                    <FaRobot />

                  </div>

                </div>

                {/* STEPS */}

                <div className="space-y-5 mt-10">

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">

                    <p className="text-sm text-slate-400">

                      Budget Optimization

                    </p>

                    <div className="mt-3 flex items-center justify-between">

                      <h4 className="text-lg font-bold text-white">

                        ₹7,500 Estimated

                      </h4>

                      <span className="text-emerald-400 text-sm font-semibold">

                        Optimized

                      </span>

                    </div>

                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">

                    <p className="text-sm text-slate-400">

                      Trek Matching

                    </p>

                    <div className="mt-3 flex items-center justify-between">

                      <h4 className="text-lg font-bold text-white">

                        98% Match Score

                      </h4>

                      <span className="text-orange-300 text-sm font-semibold">

                        AI Suggested

                      </span>

                    </div>

                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">

                    <p className="text-sm text-slate-400">

                      Best Season

                    </p>

                    <div className="mt-3 flex items-center justify-between">

                      <h4 className="text-lg font-bold text-white">

                        December - February

                      </h4>

                      <span className="text-orange-300 text-sm font-semibold">

                        Recommended

                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </PageContainer>

    </section>

  );

}