import { CAR_SERVICE_URL } from "@erp/constant";
import { request } from "@erp/libs";
import { Car as CarModel } from "@prisma/client";
import { GraphQLError } from "graphql";

const ReserveCarDocument = `
mutation ReserveCar($carId: ID!) {
  reserveCar(carId: $carId) {
    id
    name
    status
    price
  }
}
`;

export const externalService = {
  carService: {
    reserveCar: async (
      carId: string,
      customerName: string
    ): Promise<CarModel> => {
      try {
        const { reserveCar: car } = await request<{ reserveCar: CarModel }>(
          CAR_SERVICE_URL,
          ReserveCarDocument,
          {
            carId,
            customerName,
          }
        );

        return car;
      } catch (error) {
        throw new GraphQLError(`${error}`);
      }
    },
  },
};
