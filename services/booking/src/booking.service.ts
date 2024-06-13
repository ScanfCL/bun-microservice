import { MessageQueueAdapter } from "@erp/libs";
import { PrismaClient } from "@prisma/client";
import { externalService } from "./external.service";
import { connection } from "./mq-connection";

const prisma = new PrismaClient();
const messageQueue = new MessageQueueAdapter(connection, "invoice");
await messageQueue.createChannel();

export const bookingService = {
  getBookings: async () => {
    const response = await prisma.booking.findMany({});

    return response;
  },
  createBooking: async (customerName: string, carId: string) => {
    const response = await prisma.booking.create({
      data: { customerName, carId },
    });

    const car = await externalService.carService.reserveCar(
      carId,
      customerName
    );
    await messageQueue.sendMessage(
      JSON.stringify({
        type: "CREATE_INVOICE",
        data: {
          bookingId: response.id,
          customerName,
          carPrice: car.price,
        },
      })
    );

    return response;
  },
  deleteBooking: async (carId: string) => {
    const response = await prisma.booking.delete({
      where: { id: carId },
    });

    return response;
  },
};
