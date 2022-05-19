import { createClient, dedupExchange, cacheExchange, fetchExchange, makeOperation } from "urql";
import { authExchange } from "@urql/exchange-auth";

export const graphQLClient = createClient({
  url: "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet",
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
          // case "polygon": {
          //   // New context for endpoint A
          //   const context = {
          //     ...operation.context,
          //     url: "https://api.thegraph.com/subgraphs/name/prometheo/playdrop",
          //     fetchOptions: {
          //       ...options,
          //     },
          //   };
          //   console.log("POLYGON=>", makeOperation(operation.kind, operation, context));
          //   return makeOperation(operation.kind, operation, context);
          // }
          case "aurora": {
            // Endpoint B headers

            // New context for endpoint B
            const context = {
              ...operation.context,
              url: "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet",
              fetchOptions: {
                ...options,
              },
            };

            console.log("AURORA=>", makeOperation(operation.kind, operation, context));

            return makeOperation(operation.kind, operation, context);
          }
          default: {
            // throw new Error(`Unexpected object: ${clientName}`);
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
  url: "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet",
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
            // New context for endpoint A
            const context = {
              ...operation.context,
              url: "https://api.thegraph.com/subgraphs/name/prometheo/playdrop",
              fetchOptions: {
                ...options,
              },
            };
            console.log("POLYGON=>", makeOperation(operation.kind, operation, context));
            return makeOperation(operation.kind, operation, context);
          }
          // case "aurora": {
          //   // Endpoint B headers

          //   // New context for endpoint B
          //   const context = {
          //     ...operation.context,
          //     url: "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet",
          //     fetchOptions: {
          //       ...options,
          //     },
          //   };

          //   console.log("AURORA=>", makeOperation(operation.kind, operation, context));

          //   return makeOperation(operation.kind, operation, context);
          // }
          default: {
            // throw new Error(`Unexpected object: ${clientName}`);
            return operation;
          }
        }
      },
      getAuth: async () => {},
    }),
    fetchExchange,
  ],
});
