export default function ChartSkeleton({ height = "260px" }) {
  return (
    <div
      className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
      style={{ minHeight: height }}
    >
      <div className="h-full w-full p-6">
        <div className="mb-4 h-4 w-32 rounded bg-slate-200" />
        <div className="h-[70%] rounded-xl bg-slate-200/80" />
      </div>
    </div>
  );
}
