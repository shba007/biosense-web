import { prisma } from '@/db';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sensors = await prisma.device.findMany({
    include: {
      timeline: true,
    },
  });

  res.json(sensors)
}