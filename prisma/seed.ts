import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const device = await prisma.device.upsert({
    where: { id: "abc" },
    update: {},
    create: {
      id: "abc",
      timeline: {
        createMany: {
          data: [{
            temperature: 20.0,
            humidity: 50.0,
            moisture: 30.0,
            luminosity: 100.0,
          }]
        }
      }
    }
  })

  console.log({ device })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    prisma.$disconnect()
  })
