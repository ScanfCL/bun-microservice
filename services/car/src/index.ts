import { buildSubgraphSchema } from "@apollo/subgraph";
import { yoga } from "@elysiajs/graphql-yoga";
import { useApolloInlineTrace } from "@graphql-yoga/plugin-apollo-inline-trace";
import Elysia from "elysia";
import { g, printSchema } from "garph";
import { parse } from "graphql";
import { resolvers } from "./car.resolver";

const schemaString = printSchema(g);
const schema = buildSubgraphSchema([
  { typeDefs: parse(schemaString), resolvers },
]);

const app = new Elysia()
  .use(
    yoga({
      schema: schema,
      plugins: [useApolloInlineTrace],
    })
  )
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}/graphql`
);
