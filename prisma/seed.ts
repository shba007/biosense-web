import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const sensor = await prisma.sensorData.upsert({
    where: {
      sensorId: 10
    },
    update: {},
    create: {
      sensorId: 1,
      timestamp: new Date(),
      temperature: 20.0,
      humidity: 50.0,
      soilMoisture: 30.0,
      lightIntensity: 100.0,
    }
  })
  console.log({sensor})
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    prisma.$disconnect()
  })
