import { compare, hash } from "bcryptjs";
import { InferResolvers, g } from "garph";
import { YogaInitialContext } from "graphql-yoga";
import { sign } from "jsonwebtoken";
import { Booking, User } from "models";
import { APP_SECRET } from "./auth/auth";
import { bookingService } from "./booking.service";
import { GraphQLContext } from "./context";

const AuthPayload = g.type("AuthPayload", {
  token: g.string(),
  user: g.ref(User),
});

const queryType = g.type("Query", {
  bookings: g.ref(Booking).list().args({}).description("List of cars"),
});

const mutationType = g.type("Mutation", {
  createBooking: g
    .ref(Booking)
    .args({ carId: g.id(), customerName: g.string() }),

  signup: g
    .ref(AuthPayload)
    .args({ name: g.string(), email: g.string(), password: g.string() }),
  signin: g.ref(AuthPayload).args({ email: g.string(), password: g.string() }),
});

export const resolvers: InferResolvers<
  { Query: typeof queryType; Mutation: typeof mutationType },
  { context: YogaInitialContext & GraphQLContext }
> = {
  Query: {
    bookings: async (_, args, context, info) => {
      const bookings = await bookingService.getBookings();
      return bookings;
    },
  },
  Mutation: {
    createBooking: async (_, args) => {
      const { carId, customerName } = args;
      const booking = await bookingService.createBooking(customerName, carId);

      return booking;
    },
    signup: async (_, args, context) => {
      const password = await hash(args.password, 10);
      const user = await context.prisma.user.create({
        data: { ...args, password },
      });
      const token = sign({ userId: user.id }, APP_SECRET);
      return { token, user };
    },
    signin: async (_, args, context) => {
      const user = await context.prisma.user.findUnique({
        where: { email: args.email },
      });
      if (!user) {
        throw new Error("No such user found");
      }

      const valid = await compare(args.password, user.password);
      if (!valid) {
        throw new Error("Invalid password");
      }

      const token = sign({ userId: user.id }, APP_SECRET);
      return { token, user };
    },
  },
};
