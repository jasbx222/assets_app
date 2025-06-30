'use client';
import dynamic from 'next/dynamic';
// import Chart from 'react-apexcharts';
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const LineChart = () => {
  // بيانات وهمية جاهزة
  const data = [
    { month: 'يناير', count: 12 },
    { month: 'فبراير', count: 8 },
    { month: 'مارس', count: 15 },
    { month: 'أبريل', count: 10 },
    { month: 'مايو', count: 18 },
    { month: 'يونيو', count: 22 },
  ];

  const chartData = [
    {
      name: 'عدد الأصول',
      data: data.map(item => item.count),
      color: '#4318FF',
    },
  ];

  const chartOptions = {
chart: {
    toolbar: { show: false },
    type: "line" as "line", // هنا نوع صحيح معتمد
  },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" as const },
    tooltip: { theme: 'dark' },
    xaxis: {
      categories: data.map(item => item.month),
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#CBD5E0',
          fontSize: '12px',
        },
      },
    },
    grid: { show: false },
    legend: { show: false },
  };

  return (
    <Chart
      options={chartOptions}
      series={chartData}
      type="line"
      width="100%"
      height="100%"
    />
  );
};

export default LineChart;
