import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCampground, FaCheck, FaMapMarkedAlt, FaMountain, FaSuitcaseRolling } from "react-icons/fa";

import ItineraryTimeline from "../components/trek/ItineraryTimeline";
import SectionHeader from "../components/ui/SectionHeader";
import { getTrekBySlug } from "../data/featuredTreks";

const packingList = [
  "Layered thermal wear and fleece",
  "Trekking shoes with ankle support",
  "Rain cover, poncho, and dry bags",
  "Headlamp, bottle, and personal medicines",
  "Reusable cutlery and small daypack",
  "Power bank and identity documents",
];

const ItineraryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const trek = useMemo(() => getTrekBySlug(id), [id]);

  if (!trek) {
    return (
      <section className="bg-surface px-6 py-40 text-center">
        <h1 className="font-heading text-4xl font-bold text-ink">
          Itinerary not found
        </h1>
        <button
          type="button"
          onClick={() => navigate("/treks")}
          className="mt-6 rounded-2xl bg-primary px-6 py-3 font-semibold text-white"
        >
          Browse treks
        </button>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-primary-dark pb-20 pt-36 text-white md:pt-44">
        <img
          src={trek.gallery?.[1] || trek.image}
          alt={`${trek.title} itinerary`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/84 to-primary/25" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            Expedition plan
          </p>
          <h1 className="font-heading mt-5 max-w-4xl text-5xl font-bold leading-tight md:text-6xl">
            {trek.title} detailed itinerary
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/76">
            Day-wise route movement, altitude gain, camps, summit markers, and preparation checklist for the selected trek.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="Route timeline"
            title="Day-wise expedition movement"
            description="A detailed plan for camps, route transitions, altitude, and summit pacing."
            align="left"
          />
          <div className="mt-12">
            <ItineraryTimeline items={trek.itinerary} />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="rounded-3xl bg-primary-dark p-8 text-white shadow-card">
            <FaMapMarkedAlt className="text-3xl text-accent" />
            <h2 className="font-heading mt-5 text-3xl font-bold">Altitude and route profile</h2>
            <div className="mt-8 space-y-5">
              {trek.altitudeProfile.map((point) => (
                <div key={`${point.day}-${point.place}`} className="rounded-2xl bg-white/10 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-accent">{point.day}</p>
                      <p className="mt-1 font-semibold">{point.place}</p>
                    </div>
                    <p className="font-bold">{point.altitude}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
            <FaSuitcaseRolling className="text-3xl text-accent" />
            <h2 className="font-heading mt-5 text-3xl font-bold text-ink">
              Packing checklist
            </h2>
            <div className="mt-6 space-y-4">
              {packingList.map((item) => (
                <p key={item} className="flex items-center gap-3 text-ink-muted">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FaCheck className="text-xs" />
                  </span>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="Camp rhythm"
            title="How the expedition builds day by day"
            description="A quick operational read of where the trek gets higher, harder, and more weather dependent."
            align="left"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {trek.itinerary.slice(0, 3).map((day, index) => (
              <div
                key={`${day.day}-${day.camp}`}
                className="rounded-3xl bg-surface p-6 shadow-soft ring-1 ring-slate-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                  {day.summit ? <FaMountain /> : <FaCampground />}
                </div>
                <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-accent">
                  Stage {index + 1}
                </p>
                <h3 className="font-heading mt-2 text-2xl font-bold text-ink">
                  {day.camp}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {day.summit
                    ? "Peak effort window with early movement, guide pacing, and weather calls."
                    : "Controlled camp transition focused on hydration, layering, and acclimatization."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ItineraryPage;
