import { Line } from "react-chartjs-2";
import ChartEmptyPlaceholder from "./ChartEmptyPlaceholder";
import { hasChartData } from "./chartUtils";

export default function RevenueTrendChart({
  lineData = {
    labels: [],
    datasets: [],
  },
}) {
  const showChart = hasChartData(lineData);

  const data = {
    ...lineData,
    datasets: lineData.datasets?.map((dataset) => ({
      ...dataset,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      backgroundColor: "rgba(37,99,235,0.12)",
      borderColor: "#2563EB",
      pointBackgroundColor: "#2563EB",
      pointRadius: 4,
    })),
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-200 p-5 shadow-sm h-full flex flex-col">
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">
          Trends
        </p>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Revenue Trend
        </h2>
      </div>

      {showChart ? (
        <div className="h-[300px]">
          <Line
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false } },
                y: {
                  ticks: { color: "#64748B" },
                  grid: { color: "#E2E8F0" },
                },
              },
            }}
          />
        </div>
      ) : (
        <ChartEmptyPlaceholder />
      )}
    </div>
  );
}
