import { gql } from "@apollo/client";
import { ethers } from "ethers";

export const GET_GRAPH_COLLECTIONS = gql`
  query MyQuery {
    collections {
      description
      id
      name
      creator {
        id
      }
      nfts {
        chain
        category
        createdAtTimestamp
        id
        isSold
        price
        collection {
          name
          id
        }
        tokenID
        owner {
          id
        }
        tokenIPFSPath
        transactions {
          id
          txDate
          txId
          type
          from {
            id
          }
          to {
            id
          }
          price
        }
      }
    }
  }
`;

export const GET_CELO_GRAPH_COLLECITONS = gql`
  query MyQuery {
    collections {
      description
      id
      name
      creator {
        id
      }
      nfts {
        chain
        category
        createdAtTimestamp
        id
        isSold
        isListed
        price
        collection {
          name
          id
        }
        tokenID
        owner {
          id
        }
        tokenIPFSPath
        transactions {
          id
          txDate
          txId
          from {
            id
          }
          type
          price
          to {
            id
          }
        }
      }
    }
  }
`;

export const GET_SINGLE_GRAPH_COLLECTION = gql`
  query ($id: ID) {
    collection(id: $id) {
      description
      id
      name
      creator {
        id
      }
      nfts {
        chain
        category
        createdAtTimestamp
        id
        isSold
        isSoulBound
        isListed
        price
        collection {
          name
          id
        }
        tokenID
        owner {
          id
        }
        tokenIPFSPath
        transactions {
          id
          txDate
          txId
          from {
            id
          }
          type
          price
          to {
            id
          }
        }
      }
    }
  }
`;

export const GET_ALL_POLYGON_COLLECTIONS = gql`
  query MyQuery {
    collections {
      description
      id
      creator {
        id
      }
      name
      nfts {
        chain
        category
        createdAtTimestamp
        id
        isSold
        isListed
        price
        collection {
          name
          id
        }
        tokenID
        owner {
          id
        }

        tokenIPFSPath
        transactions {
          id
          txDate
          price
          txId
          to {
            id
          }
          from {
            id
          }
          type
        }
      }
    }
  }
`;

export const GET_GRAPH_COLLECTION = gql`
  query ($id: ID) {
    collection(id: $id) {
      description
      id
      name
      nfts {
        chain
        id
        isSold
        price
        tokenID
        tokenIPFSPath
        owner {
          id
        }
      }
    }
  }
`;

export const GET_NEAR_COLLECTION = gql`
  query myQuery {
    Collection_by_pk(id: $id) {
      id
      description
      name
      creator
      created_at
      Nfts {
        chain
        id
        isListed
        isSold
        isSoulBound
        owner
        price
        tokenIPFSPath
        createdAtTimestamp
        tokenId
        Transactions {
          from
          id
          price
          to
          txDate
          txId
          type
        }
      }
    }
  }
`;

export const GET_NEAR_COLLECTIONS = gql`
  query MyQuery {
    Collection {
      id
      description
      name
      creator
      created_at
      Nfts {
        chain
        id
        isListed
        isSold
        isSoulBound
        owner
        price
        tokenIPFSPath
        createdAtTimestamp
        tokenId
        Transactions {
          from
          id
          price
          to
          txDate
          txId
          type
        }
      }
    }
  }
`;

export const GET_USER_NFT = gql`
  query ($id: ID) {
    user(id: $id) {
      id
      nfts {
        chain
        createdAtTimestamp
        id
        isSold
        price
        isSoulBound
        tokenID
        collection {
          id
        }
        tokenIPFSPath
        owner {
          id
          collections {
            name
          }
        }
      }
    }
  }
`;

export const GET_NEAR_USER_NFT = gql`
  query ($id: ID) {
    user(id: $id) {
      id
      nfts {
        category
        chain
        createdAtTimestamp
        id
        isSold
        price
        tokenID
        owner {
          id
        }
        tokenIPFSPath
      }
    }
  }
`;

export const GET_USER_COLLECTIONS = gql`
  query ($id: ID) {
    user(id: $id) {
      id
      collections {
        description
        id
        name
        nfts {
          chain
          category
          createdAtTimestamp
          id
          isSold
          price
          collection {
            name
            id
          }
          tokenID
          owner {
            id
          }
          tokenIPFSPath
          transactions {
            id
            txDate
            txId
            from {
              id
            }
            type
            price
            to {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_CELO_NFT = gql`
  query ($id: ID) {
    nft(id: $id) {
      chain
      category
      createdAtTimestamp
      id
      isSold
      price
      isListed
      tokenID
      isSoulBound
      owner {
        id
      }
      collection {
        name
        creator {
          id
        }
      }
      tokenIPFSPath
      transactions {
        id
        txDate
        txId
        from {
          id
        }
        to {
          id
        }
        type
        price
      }
    }
  }
`;

export const GET_GRAPH_NFT = gql`
  query ($id: ID) {
    nft(id: $id) {
      chain
      category
      createdAtTimestamp
      id
      isSold
      isListed
      price
      isSoulBound
      tokenID
      owner {
        id
      }
      collection {
        name
        creator {
          id
        }
      }
      tokenIPFSPath
      transactions {
        id
        txDate
        txId
        to {
          id
        }
        from {
          id
        }
        type
        price
      }
    }
  }
`;

export const GET_CELO_GRAPH_NFT = gql`
  query ($id: ID) {
    nft(id: $id) {
      chain
      category
      createdAtTimestamp
      id
      isSold
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
      transactions {
        id
        txDate
        txId
        type
        price
      }
    }
  }
`;

const auroraAddress =
  process.env.REACT_APP_ENV_STAGING === "true"
    ? ethers.utils.hexlify(process.env?.REACT_APP_AURORA_TESTNET_SINGLE_ADDRESS)
    : ethers.utils.hexlify(process.env?.REACT_APP_AURORA_MAINNET_SINGLE_ADDRESS);

const auroraSoulBoundAddress =
  process.env.REACT_APP_ENV_STAGING === "true"
    ? ethers.utils.hexlify(process.env?.REACT_APP_AURORA_TESTNET_SOULBOUND_ADDRESS)
    : ethers.utils.hexlify(process.env?.REACT_APP_AURORA_MAINNET_SOULBOUND_ADDRESS);

export const GET_AURORA_SINGLE_NFTS = gql`
  query MyQuery {
    nfts(orderBy: createdAtTimestamp, orderDirection: desc, where: { collection_in: ["${auroraAddress}"]}) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      isListed
      isSoulBound
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

export const GET_AURORA_SINGLE_NFTS_WITH_LIMIT = gql`
  query MyQuery {
    nfts(orderBy: createdAtTimestamp, orderDirection: desc, first: 10 where: { collection_in: ["${auroraAddress}"]}) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      isListed
      isSoulBound
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

export const GET_AURORA_SOUL_BOUND_NFTS = gql`
query MyQuery {
  nfts(orderBy: createdAtTimestamp, orderDirection: desc, where: { collection_in: ["${auroraSoulBoundAddress}"]}) {
    category
    chain
    createdAtTimestamp
    id
    isSold
    isListed
    isSoulBound
    price
    tokenID
    owner {
      id
    }
    tokenIPFSPath
  }
}
`;

export const GET_AURORA_SOUL_BOUND_NFTS_WITH_LIMIT = gql`
query MyQuery {
  nfts(orderBy: createdAtTimestamp, orderDirection: desc, first: 10 where: { collection_in: ["${auroraSoulBoundAddress}"]}) {
    category
    chain
    createdAtTimestamp
    id
    isSold
    isListed
    isSoulBound
    price
    tokenID
    owner {
      id
    }
    tokenIPFSPath
  }
}
`;

const polygonAddress =
  process.env.REACT_APP_ENV_STAGING === "true"
    ? ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
    : ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS);
const soulboundSingleFilterAddress = ethers.utils.hexlify(process.env.REACT_APP_POLY_MAINNET_SOULBOUND_ADDRESS);
export const GET_POLYGON_SINGLE_NFTS = gql`
  query MyQuery {
    nfts(orderBy: createdAtTimestamp, orderDirection: desc, where: { collection_in: ["${polygonAddress}"]}) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      isListed
      isSoulBound
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

export const GET_POLYGON_SINGLE_NFTS_WITH_LIMIT = gql`
  query MyQuery {
    nfts(orderBy: createdAtTimestamp, orderDirection: desc, first: 10 where: { collection_in: ["${polygonAddress}"]}) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      isListed
      isSoulBound
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

export const GET_POLYGON_SOUL_BOUND_NFTS = gql`
query MyQuery {
  nfts(orderBy: createdAtTimestamp, orderDirection: desc, where: { collection_in: ["${soulboundSingleFilterAddress}"]}) {
    category
    chain
    createdAtTimestamp
    id
    isSold
    isListed
    isSoulBound
    price
    tokenID
    owner {
      id
    }
    tokenIPFSPath
  }
}
`;

export const GET_POLYGON_SOUL_BOUND_NFTS_WITH_LIMITS = gql`
query MyQuery {
  nfts(orderBy: createdAtTimestamp, orderDirection: desc, first: 10 where: { collection_in: ["${soulboundSingleFilterAddress}"]}) {
    category
    chain
    createdAtTimestamp
    id
    isSold
    isListed
    isSoulBound
    price
    tokenID
    owner {
      id
    }
    tokenIPFSPath
  }
}
`;

const celoAddress =
  process.env.REACT_APP_ENV_STAGING === "true"
    ? ethers.utils.hexlify(process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS)
    : ethers.utils.hexlify(process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS);

export const GET_CELO_SINGLE_NFT = gql`
  query MyQuery {
    nfts(orderBy: createdAtTimestamp, orderDirection: desc, where: { collection_in: ["${celoAddress}"]}) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      price
      isSoulBound
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

export const GET_CELO_SINGLE_NFT_WITH_LIMITS = gql`
  query MyQuery {
    nfts(orderBy: createdAtTimestamp, orderDirection: desc, first: 10 where: { collection_in: ["${celoAddress}"]}) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      price
      isSoulBound
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

export const GET_CELO_SOUL_BOUND_NFTS = gql`
query MyQuery {
  nfts(orderBy: createdAtTimestamp, orderDirection: desc, where: { collection_in: ["${soulboundSingleFilterAddress}"]}) {
    category
    chain
    createdAtTimestamp
    id
    isSold
    price
    isSoulBound
    tokenID
    owner {
      id
    }
    tokenIPFSPath
  }
}
`;

export const GET_CELO_SOUL_BOUND_NFTS_WITH_LIMITS = gql`
query MyQuery {
  nfts(orderBy: createdAtTimestamp, orderDirection: desc, first: 10 where: { collection_in: ["${soulboundSingleFilterAddress}"]}) {
    category
    chain
    createdAtTimestamp
    id
    isSold
    price
    isSoulBound
    tokenID
    owner {
      id
    }
    tokenIPFSPath
  }
}
`;

export const GET_NEAR_SINGLE_NFTS = gql`
  query MyQuery {
    nfts(orderBy: createdAtTimestamp, orderDirection: desc) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      isListed
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

export const GET_NEAR_SINGLE_NFTS_WITH_LIMIT = gql`
  query MyQuery {
    nfts(orderBy: createdAtTimestamp, orderDirection: desc, first: 10) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      isListed
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

export const GET_FEATURED_SINGLE_NFT = gql`
  query ($id: ID) {
    nft(id: $id) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      isListed
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

export const GET_AVAX_SINGLE_NFTS = gql`
  query MyQuery {
    nfts(orderBy: createdAtTimestamp, orderDirection: desc) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      isListed
      isSoulBound
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

export const GET_AVAX_SINGLE_NFTS_WITH_LIMIT = gql`
  query MyQuery {
    nfts(first: 10, orderBy: createdAtTimestamp, orderDirection: desc) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      isListed
      isSoulBound
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

export const GET_NEAR_NFT = gql`
  query ($id: ID) {
    nft(id: $id) {
      chain
      category
      createdAtTimestamp
      id
      isSold
      price
      tokenID
      isListed
      owner {
        id
      }
      tokenIPFSPath
      transactions {
        id
        txDate
        txId
        type
        price
        to {
          id
        }
        from {
          id
        }
      }
    }
  }
`;
