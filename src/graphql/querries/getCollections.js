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
