'use client';
import { useEffect, useRef, useState } from 'react';
import { MqttClient, connect } from 'mqtt';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import { Splide, SplideSlide } from '@splidejs/react-splide';

import AppButton from '@/components/Button';
import AppActionButton from '@/components/ActionButton';
import SectionInfo from '@/components/SectionInfo';
import SectionScan from '@/components/SectionScan';
import Pagination from '@/components/Pagination';

export default function PlantPage() {
  const splide = useRef<Splide>();
  const [currentPage, setCurrentPage] = useState(0);

  const [client, setClient] = useState<MqttClient>();
  const [connected, setConnected] = useState(false);

  const [luminosity, setLuminosity] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [moisture, setMoisture] = useState<number>(0);
  const [lightActive, setLightActive] = useState(false);
  const [sprayActive, setSprayActive] = useState(false);

  function toggleLightState() {
    if (!(client && connected)) return;

    setLightActive(!lightActive);

    console.log('Send message: ', 'light/state', !lightActive ? 'ON' : 'OFF');
    client.publish('light/state', !lightActive ? 'ON' : 'OFF', {
      qos: 1,
      retain: true,
    });
  }
  function toggleSprayState(state: boolean) {
    if (!(client && connected)) return;

    setSprayActive(state);

    if (!state) return;
    console.log('Send message: ', 'spray/amount', '1');
    client.publish('spray/amount', '1', {
      qos: 1,
      retain: true,
    });
  }

  useEffect(() => {
    if (connected) return;
    // Connect to MQTT broker
    setClient(
      connect(`mqtts://${process.env.NEXT_PUBLIC_MQTT_URL}:8884/mqtt`, {
        username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
        password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
        clientId: `client-web-${uuidv4()}`,
        clean: true,
      })
    );

    return () => {
      if (client) client.end(); // Disconnect from MQTT broker
    };
  }, []);

  useEffect(() => {
    if (!client) return;
    // Event handlers for connection
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      setConnected(true);
    });
    client.on('disconnect', () => {
      console.log('Disconnected to MQTT broker');
      setConnected(false);
    });

    client.on('error', (error) => {
      console.error('MQTT connection error:', error);
      setConnected(false);
    });

    // Subscribe to a topic
    const topics = [
      'sensor/luminosity',
      'sensor/temperature',
      'sensor/humidity',
      'sensor/moisture',
      'light/state',
      'spray/amount',
    ];
    client.subscribe(topics, (err) => {
      if (err) {
        console.error('Error subscribing to topics:', err);
      } else {
        console.log('Subscribed to topics:', topics);
      }
    });

    // Event handler for received messages
    client.on('message', (topic, message) => {
      const data = message.toString();

      switch (topic) {
        case 'sensor/luminosity':
          setLuminosity(parseFloat(data));
          break;
        case 'sensor/temperature':
          setTemperature(parseFloat(data));
          break;
        case 'sensor/humidity':
          setHumidity(parseFloat(data));
          break;
        case 'sensor/moisture':
          setMoisture(parseFloat(data));
          break;
        case 'light/state':
          setLightActive(data === 'ON');
          break;
        case 'spray/amount':
          setSprayActive(true);
          setTimeout(() => setSprayActive(false), parseInt(data) * 300);
          break;
        default:
          console.log('Received message:', data);
          break;
      }
    });
  }, [client]);

  function onMove(
    _slide: any,
    list: { items: string | any[] },
    _prev: any,
    curr: { page: number }
  ) {
    setCurrentPage(curr?.page ?? 0);
  }

  function changeSlide() {
    splide.current!.go((currentPage + 1) % 2);
  }

  return (
    <div className="relative flex-grow flex flex-col gap-6 justify-between min-h-full w-full">
      <div className="sm:hidden"></div>
      <Splide
        className="relative w-screen -left-4 mt-auto"
        ref={splide}
        options={{
          perPage: 1,
          arrows: false,
          padding: '1rem',
          gap: '2rem',
        }}
        onPaginationUpdated={onMove}
      >
        <SplideSlide>
          <SectionInfo
            luminosity={luminosity}
            temperature={temperature}
            humidity={humidity}
            moisture={moisture}
          />
        </SplideSlide>
        <SplideSlide>
          <SectionScan />
        </SplideSlide>
      </Splide>
      <div className="relative -left-4 flex justify-between items-center sm:mb-2 w-screen overflow-x-clip">
        <Pagination
          page={currentPage}
          className="absolute top-8 left-1/2 -translate-x-1/2"
        />
        <AppActionButton
          icon={`lightbulb-${lightActive ? 'active' : 'inactive'}`}
          state={lightActive}
          onToggle={toggleLightState}
        />
        <AppButton
          icon="chart"
          className="translate-y-1/2"
          onClick={changeSlide}
        />
        <AppActionButton
          icon={`raindrop-${sprayActive ? 'active' : 'inactive'}`}
          state={sprayActive}
          flip={true}
          onPress={toggleSprayState}
        />
      </div>
    </div>
  );
}
