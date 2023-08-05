'use client';
import { ofetch } from 'ofetch';
import { useEffect, useState } from 'react';

interface Sensor {
  id: string;
  timeline: {
    deviceId: string | null;
    timestamp: string;
    temperature: number;
    humidity: number;
    moisture: number;
    luminosity: number;
  }[];
}

export default function SectionChart() {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    (async () => {
      const response = await ofetch<Sensor[]>('/devices', {
        baseURL: '/api',
        method: 'GET',
      });

      setSensors(response);
    })();
  }, []);

  return (
    <section className="flex flex-col items-center justify-between p-4 ">
      <ul className="flex flex-col">
        {sensors.map(({ id, timeline }) => (
          <li key={id}>
            <span className="line-clamp-1">Device: {id}</span>
            <ul className="flex flex-col ml-3">
              {timeline.map(
                ({
                  timestamp,
                  luminosity,
                  temperature,
                  humidity,
                  moisture,
                }) => (
                  <li key={timestamp}>
                    <span>At {timestamp}</span>
                    <div className="ml-4">
                      luminosity: {luminosity}
                      <br />
                      temperature: {temperature}
                      <br />
                      humidity: {humidity}
                      <br />
                      moisture: {moisture}
                      <br />
                    </div>
                  </li>
                )
              )}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
