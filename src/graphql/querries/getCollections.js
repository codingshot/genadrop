import { gql } from "@apollo/client";

export const GET_ALL_AURORA_COLLECTIONS = gql`
  query MyQuery {
    collections {
      description
      id
      name
      nfts {
        createdAtTimestamp
        chain
        category
        isSold
        id
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

export const GET_ALL_POLYGON_COLLECTIONS = gql`
  query MyQuery {
    collections {
      description
      id
      name
      nfts {
        createdAtTimestamp
        chain
        category
        isSold
        id
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

export const GET_ALL_GRAPH_SINGLE_NFTS = gql`
  query MyQuery {
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
`;
