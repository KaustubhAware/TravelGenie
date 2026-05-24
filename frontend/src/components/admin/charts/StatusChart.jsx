import { Pie } from "react-chartjs-2";
import ChartEmptyPlaceholder from "./ChartEmptyPlaceholder";
import { hasChartData } from "./chartUtils";

export default function StatusChart({
  statusData = {
    labels: [],
    datasets: [],
  },
}) {
  const showChart = hasChartData(statusData);

  return (
    <div className="bg-white rounded-[24px] border border-slate-200 p-5 shadow-sm h-full flex flex-col">
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">
          Analytics
        </p>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Booking Status
        </h2>
      </div>

      {showChart ? (
        <div className="w-[260px] h-[260px] mx-auto">
          <Pie
            data={statusData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "65%",
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    padding: 18,
                    usePointStyle: true,
                  },
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
