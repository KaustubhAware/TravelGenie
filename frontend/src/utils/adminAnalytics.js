export function generateDashboardAnalytics(bookings = []) {
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const totalBookings = safeBookings.length;

  const paidBookings = safeBookings.filter(
    (b) => b?.status === "paid"
  ).length;

  const pendingBookings = safeBookings.filter(
    (b) => b?.status === "pending"
  ).length;

  const completedBookings = safeBookings.filter(
    (b) => b?.status === "completed"
  ).length;

  const paidRevenue = safeBookings
    .filter((b) => ["paid", "completed"].includes(b?.status))
    .reduce(
      (sum, booking) =>
        sum + Number(booking?.total_cost || booking?.budget || 0),
      0
    );

  const statusMap = {
    Pending: 0,
    Approved: 0,
    Paid: 0,
    Completed: 0,
  };

  safeBookings.forEach((booking) => {
    if (booking?.status === "pending") statusMap.Pending += 1;
    if (booking?.status === "approved") statusMap.Approved += 1;
    if (booking?.status === "paid") statusMap.Paid += 1;
    if (booking?.status === "completed") statusMap.Completed += 1;
  });

  const statusData = {
    labels: Object.keys(statusMap),
    datasets: [
      {
        data: Object.values(statusMap),
        backgroundColor: ["#f59e0b", "#3b82f6", "#22c55e", "#8b5cf6"],
        borderWidth: 0,
      },
    ],
  };

  const destinationMap = {};

  safeBookings.forEach((booking) => {
    const destination =
      booking?.destination ||
      booking?.package_location ||
      "Unknown";
    destinationMap[destination] = (destinationMap[destination] || 0) + 1;
  });

  const destinationData = {
    labels: Object.keys(destinationMap),
    datasets: [
      {
        data: Object.values(destinationMap),
        backgroundColor: [
          "#2563eb",
          "#0f172a",
          "#16a34a",
          "#ea580c",
          "#7c3aed",
        ],
        borderRadius: 8,
      },
    ],
  };

  const revenueMap = {};

  safeBookings
    .filter((b) => ["paid", "completed"].includes(b?.status))
    .forEach((booking) => {
      const created = booking?.created_at
        ? new Date(booking.created_at)
        : new Date();
      const month = created.toLocaleString("default", { month: "short" });
      revenueMap[month] =
        (revenueMap[month] || 0) +
        Number(booking?.total_cost || booking?.budget || 0);
    });

  const revenueTrendData = {
    labels: Object.keys(revenueMap),
    datasets: [
      {
        label: "Revenue",
        data: Object.values(revenueMap),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return {
    totalBookings,
    totalRevenue: paidRevenue,
    paidRevenue,
    paidBookings,
    pendingBookings,
    completedBookings,
    statusData,
    destinationData,
    revenueTrendData,
  };
}
