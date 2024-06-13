import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import { Car } from "@erp/models";
import { InferResolvers, g } from "garph";
import { YogaInitialContext } from "graphql-yoga";
import { carService } from "./car.service";

export const carQueries = g.type("Query", {
  cars: g.ref(Car).list().args({}).description("List of cars"),
  carById: g.ref(Car).args({ id: g.id() }).description("Get car by id"),
});

export const carMutations = g.type("Mutation", {
  reserveCar: g.ref(Car).args({
    carId: g.id(),
  }),
});

export const resolvers: GraphQLResolverMap<
  InferResolvers<
    {
      Query: typeof carQueries;
      Mutation: typeof carMutations & { son: string };
    },
    { context: YogaInitialContext }
  >
> = {
  Query: {
    cars: async (parent, args, context, info) => {
      const cars = await carService.cars();
      return cars;
    },
    carById: async (parent, args, context, info) => {
      const { id } = args;
      const car = await carService.carById(id);

      return car;
    },
  },
  Mutation: {
    reserveCar: async (parent, args, context, info) => {
      const { carId } = args;
      const car = await carService.reserveCar(carId);

      return car;
    },
  },
};
