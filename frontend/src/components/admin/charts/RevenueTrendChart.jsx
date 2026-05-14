import { Line } from "react-chartjs-2";

export default function RevenueTrendChart({
  lineData = {
    labels: [],
    datasets: [],
  },
}) {

  return (

    <div className="bg-white rounded-[28px] p-6 shadow-lg border border-gray-100 mb-8">

      <h2 className="text-2xl font-bold text-gray-900 mb-6">

        Revenue Trend

      </h2>

      <div className="h-[380px]">

        <Line
          data={lineData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />

      </div>

    </div>

  );
}