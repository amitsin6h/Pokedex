import { GraphQLClient } from "graphql-request";

const ENDPOINT = "https://beta.pokeapi.co/graphql/v1beta";

export const gqlClient = new GraphQLClient(ENDPOINT, {
  headers: {
    "Content-Type": "application/json",
  },
});
