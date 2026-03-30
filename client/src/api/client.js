import { graphqlApi } from "./graphqlApi";
import { restApi } from "./restApi";

export const API_MODE = {
  REST: "rest",
  GRAPHQL: "graphql"
};

export function getApi(mode) {
  return mode === API_MODE.GRAPHQL ? graphqlApi : restApi;
}
