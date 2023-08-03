import { prisma } from '@lib/prisma'

export default async function Home() {
  const sensor = await prisma.sensorData.findFirst(
    where: {
      sensorId: 1
    })
    
  return <main>{sensor}</main>;
}
