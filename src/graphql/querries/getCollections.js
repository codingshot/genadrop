import { gql } from "@apollo/client";

export const GET_GRAPH_COLLECTIONS = gql`
  query MyQuery {
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
          type
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
        marketId
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
        marketId
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
        tokenID
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
      marketId
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
      price
      tokenID
      marketId
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

export const GET_CELO_GRAPH_NFT = gql`
  query ($id: ID) {
    nft(id: $id) {
      chain
      category
      createdAtTimestamp
      id
      isSold
      price
      marketId
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

export const GET_AURORA_SINGLE_NFTS = gql`
  query MyQuery {
    nfts(where: { collection: "0x9b7a0b10ae2216433d37601cabf371211cf057b5" }) {
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
`;

const polygonAddress =
  process.env.REACT_APP_ENV_STAGING === "true"
    ? "0xd6b01b63dd514cf771d8d21b776197fdf9648d54"
    : "0x3243cd574e9d51ad012c7fa4957e8037beb8792f";

export const GET_POLYGON_SINGLE_NFTS = gql`
  query MyQuery {
    nfts(where: { collection: "${polygonAddress}" }) {
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
`;

const celoAddress =
  process.env.REACT_APP_ENV_STAGING === "true"
    ? "0x68c79f7d19b5de514b1fc23cbd5c4b84f05bf178"
    : "0x0d2e152fc5cfc53f3baf7e1ae0f6b967953706ed";

export const GET_CELO_SINGLE_NFT = gql`
  query MyQuery {
    nfts(where: { collection: "${celoAddress}" }) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      marketId
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;
