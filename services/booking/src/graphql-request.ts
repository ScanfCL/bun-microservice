import { GraphQLError } from "graphql";

// graphQLClient.ts

interface GraphQLResponse<T> {
  data: T;
  errors?: { message: string }[];
}

async function request<T>(
  endpoint: string,
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result: GraphQLResponse<T> = await response.json();

  if (!result.errors?.length) {
    return result.data;
  } else {
    throw new GraphQLError(result.errors?.[0]?.message || "Unknown error");
  }
}

export default request;
