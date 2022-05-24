import { createClient, dedupExchange, cacheExchange, fetchExchange, makeOperation } from "urql";
import { authExchange } from "@urql/exchange-auth";

export const graphQLClient = createClient({
  url: process.env.REACT_APP_SUBGRAPH_URL,
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange({
      addAuthToOperation({ operation }) {
        // if clientName does not exist, we return operation without modifications
        if (!operation.context.clientName) {
          return operation;
        }

        const { clientName, fetchOptions } = operation.context;
        const options = typeof fetchOptions === "function" ? fetchOptions() : fetchOptions ?? {};

        switch (clientName) {
          case "aurora": {
            const context = {
              ...operation.context,
              url: process.env.REACT_APP_SUBGRAPH_URL,
              fetchOptions: {
                ...options,
              },
            };

            return makeOperation(operation.kind, operation, context);
          }
          default: {
            return operation;
          }
        }
      },
      getAuth: async () => {},
    }),
    fetchExchange,
  ],
});

export const graphQLClientPolygon = createClient({
  url: process.env.REACT_APP_SUBGRAPH_URL,
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange({
      addAuthToOperation({ operation }) {
        // if clientName does not exist, we return operation without modifications
        if (!operation.context.clientName) {
          return operation;
        }

        const { clientName, fetchOptions } = operation.context;
        console.log("client name", clientName);
        const options = typeof fetchOptions === "function" ? fetchOptions() : fetchOptions ?? {};

        switch (clientName) {
          case "polygon": {
            const context = {
              ...operation.context,
              url: process.env.REACT_APP_POLYGON_URL,
              fetchOptions: {
                ...options,
              },
            };
            return makeOperation(operation.kind, operation, context);
          }
          default: {
            return operation;
          }
        }
      },
      getAuth: async () => {},
    }),
    fetchExchange,
  ],
});

export const polygonClient = createClient({
  url: process.env.REACT_APP_POLYGON_URL,
});