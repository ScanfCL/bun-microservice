import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const carService = {
  cars: async () => {
    return prisma.car.findMany({});
  },
  carById: async (id: string) => {
    return prisma.car.findUniqueOrThrow({ where: { id } });
  },
  reserveCar: async (carId: string) => {
    const car = await prisma.car.findUniqueOrThrow({ where: { id: carId } });
    if (car.status === "Ready") {
      return prisma.car.update({
        where: { id: carId },
        data: { status: "Reserved" },
      });
    } else {
      throw new Error("Car is not available");
    }
  },
};
