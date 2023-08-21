import { createClient } from "urql";

export const polygonClient = createClient({
  url:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? "https://api.thegraph.com/subgraphs/name/prometheo/playdrop"
      : "https://api.thegraph.com/subgraphs/name/prometheo/polygon-mainnet",
  requestPolicy: "cache-first",
});

export const celoClient = createClient({
  url:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? "https://api.thegraph.com/subgraphs/name/prometheo/celo-dev-subgraph"
      : "https://api.thegraph.com/subgraphs/name/prometheo/celo-mainnet",
  requestPolicy: "cache-first",
});

export const auroraClient = createClient({
  url:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? "https://api.thegraph.com/subgraphs/name/prometheo/aurora-genadrop-dev?"
      : "https://api.thegraph.com/subgraphs/name/prometheo/aurora-mainnet",
  requestPolicy: "cache-first",
});

export const nearClient = createClient({
  url:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? "https://api.thegraph.com/subgraphs/name/prometheo/near_testnet"
      : "https://api.thegraph.com/subgraphs/name/prometheo/near-mainnet",
  requestPolicy: "cache-first",
});

export const nearCollectionClient = createClient({
  url:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? "https://genadrop-near.hasura.app/v1/graphql"
      : "https://genadrop-mainnet.hasura.app/v1/graphql",
  fetchOptions: {
    headers: {
      "Hasura-Client-Name": "hasura-console",
      "X-Hasura-Admin-Secret":
        process.env.REACT_APP_ENV_STAGING === "true"
          ? "6NemYe8quC7J5KeHKcihbSN04NpEAX6UugM1oyBiLXQj35vQkAWKMJ4D8Rn2d1Ep"
          : "tBuEbrlWHFY8XPK1g0IZB165K5f5VpowoN26WXJnwGKsMYZnk3hJxMiadaYAuSqU",
      "content-type": "application/json",
    },
    requestPolicy: "cache-first",
  },
});

export const avalancheClient = createClient({
  url:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-avatestnet"
      : "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-avax",
  requestPolicy: "cache-first",
});

export const arbitrumClient = createClient({
  url:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-arbitrum-goerli"
      : "https://api.thegraph.com/subgraphs/name/prometheo/arbitrum",
  requestPolicy: "cache-first",
});
