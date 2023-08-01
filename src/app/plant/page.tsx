'use client';
import Image from 'next/image';
import AppButton from '@/components/Button';
import { useEffect, useState } from 'react';
import { MqttClient, connect } from 'mqtt';
import { v4 as uuidv4 } from 'uuid';

// const mqtt = { connect };

function formatExponent(number: number) {
  // Get the exponent part using toExponential() and split it
  const [coefficient, exponent] = number.toExponential().split('e');

  // Format the coefficient part to remove trailing zeros
  const formattedCoefficient = parseFloat(coefficient).toFixed(1);

  // Format the exponent part to remove leading zeros and add a plus sign if needed
  const formattedExponent = parseInt(exponent)
    .toString()
    .replace(/^(-)?0+/, (match, p1) => (p1 ? '-0' : ''));
  const sign = formattedExponent.startsWith('-') ? '-' : '';

  return (
    <span className="relative mr-2">
      {formattedCoefficient} x 10
      <span className="absolute -top-1 -right-2 text-sm">
        {sign}
        {Number.isNaN(Math.abs(parseInt(formattedExponent)))
          ? 0
          : Math.abs(parseFloat(formattedExponent))}
      </span>
    </span>
  );
}

export default function PlantPage() {
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

  return (
    <div className="flex-grow relative flex flex-col justify-between h-full overflow-x-clip">
      <section>
        <h1 className="text-[2rem] font-semibold">Aloe Vera</h1>
        <h2 className="text-base font-medium opacity-40">
          Aloe barbadensis miller
        </h2>
      </section>
      <section>
        <ul className="flex flex-col gap-6">
          <li className="flex flex-col font-medium">
            <span className="opacity-40">Water Intake</span>
            <span className="text-2xl">0 ml</span>
          </li>
          <li className="flex flex-col font-medium">
            <span className="opacity-40">Age</span>
            <span className="text-2xl">2 Week</span>
          </li>
          <li className="flex flex-col font-medium">
            <span className="opacity-40">Luminosity</span>
            <span className="text-2xl">
              {formatExponent(luminosity ?? 0)} lux
            </span>
          </li>
          <li className="flex flex-col font-medium">
            <span className="opacity-40">Temperature</span>
            <span className="text-2xl">{temperature.toFixed(1)} °C</span>
          </li>
          <li className="flex flex-col font-medium">
            <span className="opacity-40">Humidity</span>
            <span className="text-2xl">{humidity.toFixed(1)} %</span>
          </li>
          <li className="flex flex-col font-medium">
            <span className="opacity-40">Soil Moisture</span>
            <span className="text-2xl">{moisture.toFixed(1)} %</span>
          </li>
        </ul>
        <div className="fixed sm:absolute left-full sm:right-0 top-1/2 -translate-x-[40%] sm:-translate-x-full -translate-y-1/2 w-[430px] h-[430px]">
          <div className="w-full h-full rounded-full bg-[#CEDFF7] absolute shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)_inset]"></div>
          <div className="w-[75%] aspect-square rounded-full bg-[#CEDFF7] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)_inset]"></div>
          <div className="w-[50%] aspect-square rounded-full bg-[#CEDFF7] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.25)_inset]"></div>
          <div className="relative w-full h-full rounded-b-[50%] overflow-hidden">
            <img
              src="images/aloe-vera.png"
              alt="aloe-vera"
              className="md:mx-auto w-full object-contain -translate-x-1/4 md:translate-x-0 -translate-y-[5%] scale-[80%]"
            />
          </div>
        </div>
      </section>
      <section className="flex justify-between gap-4">
        <AppButton
          icon={`lightbulb-${lightActive ? 'active' : 'inactive'}`}
          onToggle={toggleLightState}
        />
        <AppButton
          icon={`raindrop-${sprayActive ? 'active' : 'inactive'}`}
          onPress={toggleSprayState}
        />
        <AppButton icon="growth" title="Details" className="ml-auto" />
      </section>
    </div>
  );
}
