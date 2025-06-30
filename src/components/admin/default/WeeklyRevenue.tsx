import { useMemo } from 'react';
import dayjs from 'dayjs';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AssetChart() {
  // const { data: assets, loading } = useGet<any[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/assets`);

  //  بيانات وهمية 
  const fakeAssets = [
    { id: 1, created_at: '2025-06-24T10:00:00Z' },
    { id: 2, created_at: '2025-06-24T12:00:00Z' },
    { id: 3, created_at: '2025-06-25T14:00:00Z' },
    { id: 4, created_at: '2025-06-25T15:30:00Z' },
    { id: 5, created_at: '2025-06-26T09:45:00Z' },
    { id: 6, created_at: '2025-06-27T13:00:00Z' },
    { id: 7, created_at: '2025-06-28T08:20:00Z' },
    { id: 8, created_at: '2025-06-28T11:15:00Z' },
    { id: 9, created_at: '2025-06-29T16:10:00Z' },
    { id: 10, created_at: '2025-06-30T10:05:00Z' },
  ];

  const chartData = useMemo(() => {
    const groupedByDay = fakeAssets.reduce(
      (acc: Record<string, number>, asset: any) => {
        const day = dayjs(asset.created_at).format('DD/MM');
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      },
      {},
    );

    return {
      data: [
        {
          name: 'عدد الأصول اليومية',
          data: Object.values(groupedByDay),
        },
      ],
      categories: Object.keys(groupedByDay),
    };
  }, []);

  const barChartOptions: ApexOptions = {
    chart: { toolbar: { show: false } },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '14px',
          fontWeight: '500',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#CBD5E0',
          fontSize: '14px',
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        colorStops: [
          [
            { offset: 0, color: '#4318FF', opacity: 1 },
            { offset: 100, color: 'rgba(67, 24, 255, 1)', opacity: 0.28 },
          ],
        ],
      },
    },
    plotOptions: {
      bar: { borderRadius: 10, columnWidth: '40px' },
    },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' },
  };

  return (
    <Chart
      options={barChartOptions}
      series={chartData.data}
      type="bar"
      height={350}
    />
  );
}
