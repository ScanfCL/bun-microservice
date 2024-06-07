import { g } from "garph";

export const Booking = g.type("Booking", {
  id: g.string().description("The ID of the booking"),
  customerName: g.string().description("The name of the customer"),
  carId: g.string().description("The ID of the car"),
});
