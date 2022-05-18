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
        if (clientName?.length > 0) {
          const context = {
            ...operation.context,
            url: "https://api.thegraph.com/subgraphs/name/prometheo/playdrop",
            requestPolicy: "network",
            // clientName: clientName[1],
            fetchOptions: {
              ...options,
            },
          };

          const context2 = {
            ...operation.context,
            // clientName: clientName[0],
            url: "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet",
            fetchOptions: {
              ...options,
            },
          };
          const make1 = makeOperation(operation.kind, operation, context);
          const make2 = makeOperation(operation.kind, operation, context2);

          console.log("Context 1", make1);
          console.log("Context 2", make2);

          return [make1, make2];
        }
        // switch (clientName) {
        //   case "polygon": {
        //     // New context for endpoint A
        //     const context = {
        //       ...operation.context,
        //       url: "https://api.thegraph.com/subgraphs/name/prometheo/playdrop",
        //       fetchOptions: {
        //         ...options,
        //       },
        //     };
        //     console.log("polygon", makeOperation(operation.kind, operation, context));
        //     return makeOperation(operation.kind, operation, context);
        //   }
        //   case "aurora": {
        //     // Endpoint B headers

        //     // New context for endpoint B
        //     const context = {
        //       ...operation.context,
        //       url: "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet",
        //       fetchOptions: {
        //         ...options,
        //       },
        //     };

        //     return makeOperation(operation.kind, operation, context);
        //   }
        //   default: {
        //     // throw new Error(`Unexpected object: ${clientName}`);
        //     return operation;
        //   }
        // }
      },
      getAuth: async () => {},
    }),
    fetchExchange,
  ],
});
