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
          buyer {
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
          buyer {
            id
          }
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
        collection {
          id
        }
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
        buyer {
          id
        }
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

export const GET_POLYGON_SINGLE_NFTS = gql`
  query MyQuery {
    nfts(where: { collection: "0x6639b2310b94196cb8b7f2e361c8c58c683add2c" }) {
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

export const GET_CELO_SINGLE_NFT = gql`
  query MyQuery {
    nfts(where: { collection: "0xa5ead6ffa64a98757a2f6f4068f2cb86b515b6ca" }) {
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
