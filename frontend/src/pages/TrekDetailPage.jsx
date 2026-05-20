import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCloudSun,
  FaDownload,
  FaMapMarkedAlt,
  FaMountain,
  FaRobot,
  FaRoute,
  FaStar,
  FaUsers,
  FaWallet,
} from "react-icons/fa";

import AICustomizationPanel from "../components/trek/AICustomizationPanel";
import DepartureCard from "../components/trek/DepartureCard";
import ItineraryTimeline from "../components/trek/ItineraryTimeline";
import TrekOverviewSection from "../components/trek/TrekOverviewSection";
import SectionHeader from "../components/ui/SectionHeader";
import Badge from "../components/ui/Badge";
import { getTrekBySlug } from "../data/featuredTreks";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const TrekDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const trek = useMemo(() => getTrekBySlug(slug), [slug]);

  if (!trek) {
    return (
      <section className="bg-surface px-6 py-40 text-center">
        <h1 className="font-heading text-4xl font-bold text-ink">
          Trek not found
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

  const startBooking = (departure) => {
    navigate("/dashboard/booking", {
      state: {
        destination: trek.title,
        days: parseInt(trek.duration, 10),
        cost: trek.price,
        departure: departure?.date || trek.nextDeparture,
        trekSlug: trek.slug,
      },
    });
  };

  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-primary-dark pt-28 text-white">
        <img
          src={trek.image}
          alt={trek.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" />

        <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-10 px-6 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-wrap gap-3">
              <Badge variant="dark">{trek.region}</Badge>
              <Badge variant="accent">{trek.difficulty}</Badge>
            </div>

            <h1 className="font-heading mt-6 text-5xl font-bold leading-tight md:text-7xl">
              {trek.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/78">
              {trek.overview}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => startBooking()}
                className="inline-flex items-center gap-3 rounded-2xl bg-accent px-7 py-4 font-semibold text-white transition-colors hover:bg-accent-dark"
              >
                Request Booking
                <FaArrowRight />
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/ai-planner", { state: { trek } })}
                className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15"
              >
                Customize with AI
                <FaRobot />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/itinerary/${trek.slug}`)}
                className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15"
              >
                Full Itinerary
                <FaCalendarAlt />
              </button>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-card backdrop-blur-xl"
          >
            <div className="relative h-56">
              <img
                src={trek.gallery?.[0] || trek.image}
                alt={`${trek.title} camp`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  Expedition brief
                </p>
                <p className="font-heading mt-2 text-2xl font-bold text-white">
                  {trek.promise}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5">
              {[
                [FaRoute, "Duration", trek.duration],
                [FaMountain, "Altitude", trek.altitude],
                [FaCalendarAlt, "Next departure", trek.nextDeparture],
                [FaWallet, "From", formatPrice(trek.price)],
              ].map(([Icon, label, value]) => (
                <div key={label} className="rounded-2xl bg-white/10 p-4">
                  <Icon className="text-accent" />
                  <p className="text-sm text-white/65">{label}</p>
                  <p className="mt-2 font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="mx-5 mb-5 flex items-center justify-between rounded-2xl bg-primary-dark/70 p-4">
              <span className="flex items-center gap-2 text-sm text-white/78">
                <FaStar className="text-accent" />
                {trek.rating} from {trek.reviews} reviews
              </span>
              <span className="text-sm font-semibold text-accent">
                <FaUsers className="mr-1 inline" />
                {trek.departures} batches
              </span>
            </div>
          </motion.aside>
        </div>
      </section>

      <TrekOverviewSection trek={trek} />

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="Day-wise expedition timeline"
            title="Itinerary built for trekking operations"
            description="A storytelling-led route plan with altitude, distance, camp movement, and summit markers."
            align="left"
          />
          <div className="mt-12">
            <ItineraryTimeline items={trek.itinerary} />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-3xl bg-primary-dark p-7 text-white shadow-card md:p-9">
            <FaMapMarkedAlt className="text-3xl text-accent" />
            <h2 className="font-heading mt-5 text-3xl font-bold">Route map</h2>
            <p className="mt-3 text-white/72">
              Approximate operating zone for route planning, pickup coordination, and guide assignment.
            </p>
            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="relative aspect-[4/3] bg-[radial-gradient(circle_at_35%_35%,rgba(230,126,34,0.35),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03))]">
                <div className="absolute left-[18%] top-[68%] h-3 w-3 rounded-full bg-accent ring-8 ring-accent/20" />
                <div className="absolute left-[36%] top-[52%] h-3 w-3 rounded-full bg-white ring-8 ring-white/15" />
                <div className="absolute left-[58%] top-[36%] h-3 w-3 rounded-full bg-accent ring-8 ring-accent/20" />
                <div className="absolute left-[19%] top-[69%] h-px w-[42%] -rotate-[31deg] bg-white/45" />
                <div className="absolute bottom-5 left-5 rounded-2xl bg-primary-dark/75 px-4 py-3 text-sm backdrop-blur">
                  {trek.coordinates[0]}, {trek.coordinates[1]}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-3xl bg-white p-7 shadow-soft ring-1 ring-slate-100">
              <h3 className="font-heading text-2xl font-bold text-ink">
                Altitude profile
              </h3>
              <div className="mt-6 space-y-4">
                {trek.altitudeProfile.map((point) => (
                  <div key={`${point.day}-${point.place}`} className="grid grid-cols-[80px_1fr_auto] items-center gap-4">
                    <p className="text-sm font-semibold text-primary">{point.day}</p>
                    <div>
                      <p className="font-semibold text-ink">{point.place}</p>
                      <div className="mt-2 h-2 rounded-full bg-surface-muted">
                        <div
                          className="h-2 rounded-full bg-accent"
                          style={{ width: `${Math.min(100, getBarWidth(point.altitude))}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-ink-muted">{point.altitude}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoPanel
                icon={FaCloudSun}
                title="Weather insight"
                text={`Season window: ${trek.season}. AI support can generate packing and risk notes for the selected departure.`}
              />
              <InfoPanel
                icon={FaRobot}
                title="AI customization"
                text="Adjust preparation, fitness plans, gear lists, food preferences, and rest strategy while keeping the operator package fixed."
              />
            </div>
          </div>
        </div>
      </section>

      <AICustomizationPanel
        trek={trek}
        onPlan={() => navigate("/dashboard/ai-planner", { state: { trek } })}
      />

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="Departure calendar"
            title="Choose a guided batch"
            description="Booking requests enter admin review first. Payment happens only after approval, preserving the existing workflow."
            align="left"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {trek.departuresList.map((departure) => (
              <DepartureCard
                key={`${departure.date}-${departure.guide}`}
                departure={departure}
                onSelect={startBooking}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Gallery and trust"
              title="A premium trek page for real decisions"
              description="Visuals, reviews, FAQs, and operations notes are kept together so customers understand the expedition before requesting a booking."
              align="left"
            />
            <div className="mt-10 grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
              {trek.gallery.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt={`${trek.title} gallery`}
                  className="h-72 w-full rounded-3xl object-cover shadow-soft first:md:h-full"
                  loading="lazy"
                />
              ))}
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {[
                [
                  "Expedition felt professionally run from pickup to summit morning.",
                  "Verified trekker",
                ],
                [
                  "The departure review before payment made the whole process feel safer and more transparent.",
                  "Group leader",
                ],
              ].map(([quote, name]) => (
                <blockquote
                  key={quote}
                  className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100"
                >
                  <div className="flex gap-1 text-accent">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar key={index} />
                    ))}
                  </div>
                  <p className="mt-4 leading-relaxed text-ink-muted">"{quote}"</p>
                  <p className="mt-5 font-semibold text-ink">{name}</p>
                </blockquote>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              {trek.faqs.map(([question, answer]) => (
                <details key={question} className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
                  <summary className="cursor-pointer font-heading text-lg font-bold text-ink">
                    {question}
                  </summary>
                  <p className="mt-3 text-ink-muted">{answer}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="h-max rounded-3xl bg-primary-dark p-7 text-white shadow-card lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Booking workflow
            </p>
            <h3 className="font-heading mt-3 text-3xl font-bold">
              Request first, pay after approval
            </h3>
            <div className="mt-6 space-y-4 text-sm text-white/75">
              {["Submit booking request", "Admin reviews availability and fit", "Payment link opens after approval", "Invoice and booking tracking become available"].map((step, index) => (
                <p key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-accent">
                    {index + 1}
                  </span>
                  {step}
                </p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => startBooking()}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-accent py-4 font-semibold text-white hover:bg-accent-dark"
            >
              <FaWallet />
              Start request
            </button>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 py-4 font-semibold text-white/85"
            >
              <FaDownload />
              Sample invoice
            </button>
          </aside>
        </div>
      </section>
    </>
  );
};

const getBarWidth = (altitude) => {
  const value = Number(String(altitude).replace(/[^\d]/g, ""));
  return (value / 16000) * 100;
};

const InfoPanel = ({ icon: Icon, title, text }) => (
  <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
    <Icon className="text-2xl text-accent" />
    <h3 className="font-heading mt-4 text-xl font-bold text-ink">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
  </div>
);

export default TrekDetailPage;
