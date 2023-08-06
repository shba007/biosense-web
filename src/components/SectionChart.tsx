'use client';
import { useEffect, useState } from 'react';
import { ofetch } from 'ofetch';
import LineGraph from './LineGraph';
import { formatExponent } from './SectionInfo';

interface Device {
  id: string;
  timeline: {
    deviceId: string | null;
    timestamp: string;
    luminosity: number;
    temperature: number;
    humidity: number;
    moisture: number;
  }[];
}

export default function SectionChart() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [latestData, setLatestData] = useState<{
    luminosity: number;
    temperature: number;
    humidity: number;
    moisture: number;
  }>();

  const [selectedData, setSelectedData] = useState<
    'luminosity' | 'temperature' | 'humidity' | 'moisture'
  >('luminosity');
  const [data, setDatasets] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  }>();

  useEffect(() => {
    (async () => {
      const response = await ofetch<Device[]>('/devices', {
        baseURL: '/api',
        method: 'GET',
      });

      setDevices(response);
    })();
  }, []);

  useEffect(() => {
    if (devices.length <= 0) return;

    setLatestData({ ...devices[0].timeline[devices[0].timeline.length - 1] });

    setDatasets({
      labels: devices[0].timeline.map((data) =>
        (new Date(data.timestamp).getTime() / 1000).toFixed(0)
      ),
      datasets: [
        {
          label: selectedData,
          data: devices[0].timeline.map((data) => data[selectedData]),
        },
      ],
    });
  }, [devices, selectedData]);

  return (
    <section className="flex flex-col items-center justify-between h-full">
      <div className="grid grid-rows-2 sm:grid-rows-1 grid-cols-2 sm:grid-cols-4 gap-4 w-full">
        <button
          className={`relative flex flex-col gap-1 rounded-lg px-5 py-4 w-full aspect-[5/3] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.10)] before:absolute before:top-0 before:w-[54px] before:h-[6px] before:rounded-md before:bg-[#34D399] ${
            selectedData === 'luminosity' ? 'before:block' : 'before:hidden'
          }`}
          onClick={() => setSelectedData('luminosity')}
        >
          <span className="text-sm opacity-40">Luminosity</span>
          <span className="font-medium text-xl">
            {formatExponent(latestData?.luminosity ?? 0)} lux
          </span>
        </button>
        <button
          className={`relative flex flex-col gap-1 rounded-lg px-5 py-4 w-full aspect-[5/3] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.10)] before:absolute before:top-0 before:w-[54px] before:h-[6px] before:rounded-md before:bg-[#34D399] ${
            selectedData === 'temperature' ? 'before:block' : 'before:hidden'
          }`}
          onClick={() => setSelectedData('temperature')}
        >
          <span className="text-sm opacity-40">Temperature</span>
          <span className="font-medium text-xl">
            {latestData?.temperature?.toFixed(1)} °C
          </span>
        </button>
        <button
          className={`relative flex flex-col gap-1 rounded-lg px-5 py-4 w-full aspect-[5/3] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.10)] before:absolute before:top-0 before:w-[54px] before:h-[6px] before:rounded-md before:bg-[#34D399] ${
            selectedData === 'humidity' ? 'before:block' : 'before:hidden'
          }`}
          onClick={() => setSelectedData('humidity')}
        >
          <span className="text-sm opacity-40">Humidity</span>
          <span className="font-medium text-xl">
            {latestData?.humidity?.toFixed(1)} %
          </span>
        </button>
        <button
          className={`relative flex flex-col gap-1 rounded-lg px-5 py-4 w-full aspect-[5/3] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.10)] before:absolute before:top-0 before:w-[54px] before:h-[6px] before:rounded-md before:bg-[#34D399] ${
            selectedData === 'moisture' ? 'before:block' : 'before:hidden'
          }`}
          onClick={() => setSelectedData('moisture')}
        >
          <span className="text-sm opacity-40">Soil Moisture</span>
          <span className="font-medium text-xl">
            {latestData?.moisture?.toFixed(1)} %
          </span>
        </button>
      </div>
      <LineGraph data={data} />
    </section>
  );
}
