import { Bar } from "react-chartjs-2";

export default function RevenueChart({
  revenueData = {
    labels: [],
    datasets: [],
  },
}) {

  return (

    <div className="bg-white rounded-[28px] p-6 shadow-lg border border-gray-100">

      <h2 className="text-2xl font-bold text-gray-900 mb-6">

        Revenue Overview

      </h2>

      <div className="h-[320px]">

        <Bar
          data={revenueData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />

      </div>

    </div>

  );
}