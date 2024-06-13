import { g } from "garph";

export const User = g.type("User", {
  id: g.id(),
  name: g.string(),
  email: g.string(),
  password: g.string(),
});
