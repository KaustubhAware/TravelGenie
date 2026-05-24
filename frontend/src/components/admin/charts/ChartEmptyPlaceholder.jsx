export default function ChartEmptyPlaceholder({ title = "No analytics data available" }) {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
      <div>
        <p className="text-sm font-semibold text-slate-500">
          {title}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Data will appear once bookings are recorded.
        </p>
      </div>
    </div>
  );
}
