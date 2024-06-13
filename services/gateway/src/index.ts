import {
  ApolloGateway,
  GraphQLDataSourceProcessOptions,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
} from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }: GraphQLDataSourceProcessOptions) {
    const authorization = context.headers?.authorization;

    if (authorization) {
      request.http?.headers.set("Authorization", authorization);
    }
  }
}

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "car", url: "http://localhost:3001/graphql" },
      { name: "booking", url: "http://localhost:3002/graphql" },
      // { name: "invoice", url: "http://localhost:3003/graphql" },
    ],
    subgraphHealthCheck: true,
  }),
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const server = new ApolloServer({
  gateway,
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({ headers: req.headers }),
  listen: { port: 3000 },
});
console.log(`🚀  Server ready at ${url}`);
