import { g } from "garph";

export const Car = g.type("Car", {
  id: g.id(),
  name: g.string(),
  status: g.enumType("CarStatus", ["Ready", "Reserved"]),
  price: g.int(),
});
