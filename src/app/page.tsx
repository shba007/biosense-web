import { prisma } from '@lib/prisma' 

export default async function Home() {
  const sensor = await prisma.sensorData.findFirst(
    where: {
      sensorId: 1
    })
    
  return  (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{sensor}</h1>
    </main>
  );
}
