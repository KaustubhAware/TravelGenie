import { Pie } from "react-chartjs-2";

export default function StatusChart({
  statusData = {
    labels: [],
    datasets: [],
  },
}) {

  return (

    <div className="bg-white rounded-[28px] p-6 shadow-lg border border-gray-100">

      <h2 className="text-2xl font-bold text-gray-900 mb-6">

        Booking Status

      </h2>

      <div className="w-[280px] h-[280px] mx-auto">

        <Pie
          data={statusData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
            },
          }}
        />

      </div>

    </div>

  );
}