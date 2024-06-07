import { Booking } from "@erp/models";
import { g } from "garph";

export const bookingQueriesType = g.type("Query", {
  bookings: g.ref(Booking).list().args({}).description("List of cars"),
});
