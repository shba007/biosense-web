
import { prisma } from '../src/db';
import { connect } from 'mqtt';
import cron from 'node-cron';

// Connect to MQTT broker
const client = connect(`mqtts://${process.env.NEXT_PUBLIC_MQTT_URL}:8883`, {
  username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
  password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
  clientId: 'cron-job',
  clean: true,
})

interface Data {
  deviceId: string | null;
  temperature: number;
  humidity: number;
  moisture: number;
  luminosity: number;
}

async function updateDatabase(data: Data) {
  try {
    if (data.deviceId === null)
      throw new Error("Device Id null")
    // Update the value in the database using the Prisma client
    await prisma.data.create({
      data: {
        deviceId: data.deviceId,
        luminosity: data.luminosity,
        temperature: data.temperature,
        humidity: data.humidity,
        moisture: data.moisture
      }
    })
    console.log('Database updated successfully:', data);
  } catch (error) {
    console.error('Error updating database:', error);
  }
}

// Connect to the database using Prisma client
function main() {
  let currentData: Data = {
    deviceId: null,
    temperature: 0,
    humidity: 0,
    moisture: 0,
    luminosity: 0,
  };

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
  });
  client.on('disconnect', () => {
    console.log('Disconnected to MQTT broker');
  });

  client.on('error', (error) => {
    console.error('MQTT connection error:', error);
  });

  // Subscribe to a topic
  const topics = "#"
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
    currentData.deviceId = "ESP32"

    switch (topic) {
      case 'sensor/luminosity':
        currentData.luminosity = parseFloat(data)
        break;
      case 'sensor/temperature':
        currentData.temperature = parseFloat(data)
        break;
      case 'sensor/humidity':
        currentData.humidity = parseFloat(data)
        break;
      case 'sensor/moisture':
        currentData.moisture = parseFloat(data)
        break;
      case 'sensor/airquality':
        break;
      default:
        console.log('Received message:', topic, data);
        break;
    }
  });

  cron.schedule('* 15 * * * *', () => {
    updateDatabase(currentData);
  });
}

main()