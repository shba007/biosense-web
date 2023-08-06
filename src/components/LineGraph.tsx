import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      right: 60,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      position: 'right',
      ticks: {
        // display: false,
        maxTicksLimit: 6,
        beginAtZero: true,
        drawBorder: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false, // Hide the legend
    },
  },
};

function sampleDataAtFixedInterval(
  data: (number | string)[],
  interval: number
): (number | string)[] {
  const sampledData: (number | string)[] = [];
  for (let i = data.length - 1; i >= 0; i -= interval) {
    sampledData.unshift(data[i]);
  }
  return sampledData;
}

export default function LineGraph({
  data,
  interval = 25,
}: {
  data:
    | {
        labels: string[];
        datasets: {
          label: string;
          data: number[];
        }[];
      }
    | undefined;
  interval?: number;
}) {
  if (data === undefined) data = { labels: [], datasets: [] };

  const sampledData = {
    labels: sampleDataAtFixedInterval(data.labels, interval) as string[],
    datasets: data.datasets.map((dataset) => {
      const points = sampleDataAtFixedInterval(
        dataset.data,
        interval
      ) as number[];
      return {
        // ...dataset,
        data: points,
        pointBorderWidth: points.map((_, index) =>
          index === points.length - 1 ? 5 : 1.5
        ),
        pointBorderColor: points.map((_, index) =>
          index === points.length - 1
            ? 'rgba(52, 211, 153, 0.4)'
            : 'rgba(0, 0, 0, 1)'
        ), // Set the point border color (red)
        pointBackgroundColor: points.map(() => 'rgba(255, 255, 255, 1)'), // Set the point color (green)
        pointRadius: points.map((_, index) =>
          index === points.length - 1 ? 8 : 4
        ), // Set the point radius to 6 pixels
      };
    }),
  };
  console.log(sampledData);

  return (
    <div className="w-screen overflow-x-auto scrollbar-hidden scroll-rtl bg-gradient-to-b from-[rgba(52,211,153,0)] from-0% via-[rgba(52,211,153,0.50)] via-60% to-[rgba(52,211,153,0.50)] to-100%">
      <div className="min-w-[300vw] h-[218px]">
        <Line options={options} data={sampledData} />
      </div>
    </div>
  );
}
