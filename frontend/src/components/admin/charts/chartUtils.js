export function hasChartData(chartData) {
  const labels = chartData?.labels || [];
  const datasets = chartData?.datasets || [];

  if (!labels.length || !datasets.length) {
    return false;
  }

  const total = datasets.reduce((sum, dataset) => {
    const values = dataset.data || [];
    return (
      sum +
      values.reduce(
        (inner, value) => inner + (Number(value) || 0),
        0
      )
    );
  }, 0);

  return total > 0;
}
