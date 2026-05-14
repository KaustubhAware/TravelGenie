import { Bar } from "react-chartjs-2";

export default function DestinationChart({
  topDestData = {
    labels: [],
    datasets: [],
  },
}) {

  return (

    <div className="bg-white rounded-[28px] p-6 shadow-lg border border-gray-100 mb-8">

      <h2 className="text-2xl font-bold text-gray-900 mb-6">

        Top Destinations

      </h2>

      <div className="h-[350px]">

        <Bar
          data={topDestData}
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