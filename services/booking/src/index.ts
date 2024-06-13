import { buildSubgraphSchema } from "@apollo/subgraph";
import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import bearer from "@elysiajs/bearer";
import yoga from "@elysiajs/graphql-yoga";
import { useApolloInlineTrace } from "@graphql-yoga/plugin-apollo-inline-trace";
import Elysia from "elysia";
import { g, printSchema } from "garph";
import { parse } from "graphql";
import { applyMiddleware } from "graphql-middleware";
import permissions from "./auth/permission";
import { resolvers } from "./booking.resolver";
import { createContext } from "./context";

const schemaString = printSchema(g);
const schema = buildSubgraphSchema([
  {
    typeDefs: parse(schemaString),
    resolvers: resolvers as GraphQLResolverMap,
  },
]);

const app = new Elysia()
  .use(bearer())
  .use(
    yoga({
      schema: applyMiddleware(schema, permissions),
      plugins: [useApolloInlineTrace],
      context: createContext,
      useContext(_) {},
    })
  )
  .listen(3002);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}/graphql`
);
