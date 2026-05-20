import { FaMountain, FaSearch } from "react-icons/fa";

export default function DashboardHeader({
  search,
  setSearch,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-primary-dark/88 px-4 py-4 text-white shadow-card backdrop-blur-xl md:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
            Admin command center
          </p>
          <h1 className="font-heading mt-1 text-3xl font-bold">
            Expedition Operations
          </h1>
          <p className="mt-1 text-sm text-white/62">
            Monitor bookings, revenue, departures, customers, and guide workflows.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <label className="relative block flex-1 lg:flex-none">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/44" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/12 bg-white/10 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-accent lg:w-[300px]"
            />
          </label>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-lg">
            <FaMountain />
          </div>
        </div>
      </div>
    </header>
  );
}
