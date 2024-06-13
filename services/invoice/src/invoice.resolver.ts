import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import { InferResolvers, g } from "garph";
import { YogaInitialContext } from "graphql-yoga";

const queryType = g.type("Query", {});

const mutationType = g.type("Mutation", {});

export const resolvers: GraphQLResolverMap<
  InferResolvers<
    { Query: typeof queryType; Mutation: typeof mutationType },
    { context: YogaInitialContext }
  >
> = {
  Query: {},
  Mutation: {},
};
