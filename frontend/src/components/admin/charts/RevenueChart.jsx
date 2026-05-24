import { Bar } from "react-chartjs-2";
import ChartEmptyPlaceholder from "./ChartEmptyPlaceholder";
import { hasChartData } from "./chartUtils";

export default function RevenueChart({
  revenueData = {
    labels: [],
    datasets: [],
  },
}) {
  const showChart = hasChartData(revenueData);

  const data = {
    ...revenueData,
    datasets: revenueData.datasets?.map((dataset) => ({
      ...dataset,
      borderRadius: 10,
      backgroundColor: "#2563EB",
      maxBarThickness: 55,
    })),
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-200 p-5 shadow-sm h-full flex flex-col">
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">
          Revenue
        </p>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Revenue Overview
        </h2>
      </div>

      {showChart ? (
        <div className="h-[260px]">
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false } },
                y: { grid: { color: "#E2E8F0" } },
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
