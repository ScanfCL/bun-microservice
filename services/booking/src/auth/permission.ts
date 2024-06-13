import { rule, shield } from "graphql-shield";

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.currentUser !== null;
  }
);

// Define permission
const permissions = shield({
  Query: {
    bookings: isAuthenticated,
    // add more query auth here
  },
  Mutation: {},
});

export default permissions;
