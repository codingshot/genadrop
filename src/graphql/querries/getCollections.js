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

export const GET_GRAPH_COLLECTION = gql`
  query MyQuery {
    collection(id: id) {
      description
      id
      nfts {
        category
        chain
        id
        isSold
        price
        tokenIPFSPath
        tokenID
      }
    }
  }
`;
