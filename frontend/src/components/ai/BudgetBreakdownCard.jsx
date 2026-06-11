const numberValue = (value) => {
  const numeric = Number(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatCurrency = (value) => {
  const numeric = numberValue(value);
  if (!numeric) return "Budget Not Specified";
  return `Rs ${numeric.toLocaleString("en-IN")}`;
};

export default function BudgetBreakdownCard({ breakdown = {}, total = 0 }) {
  const items = [
    ["Transport", breakdown.transport || breakdown.travel],
    ["Stay", breakdown.accommodation || breakdown.stay || breakdown.hotel],
    ["Food", breakdown.food],
    ["Activities", breakdown.activities || breakdown.sightseeing],
    ["Misc", breakdown.miscellaneous || breakdown.misc || breakdown.emergency],
  ];

  const computedTotal = numberValue(total) || items.reduce((sum, [, value]) => sum + numberValue(value), 0);
  const visibleItems = items.filter(([, value]) => numberValue(value) > 0);

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">
            Budget
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            Estimated trip spend
          </h2>
        </div>
      </div>

      <div className="mt-8">
        <div className="space-y-2">
          {visibleItems.length > 0 ? (
            visibleItems.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-6 rounded-2xl bg-slate-50/80 px-4 py-4 transition hover:bg-orange-50">
                <span className="text-sm font-semibold text-slate-600">{label}</span>
                <span className="text-lg font-semibold text-slate-950">{formatCurrency(value)}</span>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-slate-50/80 px-4 py-4 text-sm text-slate-500">
              Budget details were not included in this itinerary.
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-6 rounded-3xl bg-slate-950 px-5 py-5 text-white shadow-lg shadow-slate-950/15 md:px-6">
          <span className="text-sm font-semibold text-orange-100">
            Total
          </span>
          <span className="text-3xl font-black">{formatCurrency(computedTotal)}</span>
        </div>
      </div>
    </section>
  );
}
