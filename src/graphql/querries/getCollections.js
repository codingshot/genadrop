import { gql } from "@apollo/client";

export const GET_ALL_AURORA_COLLECTIONS = gql`
  query MyQuery {
    collections {
      nfts {
        category
        chain
        id
        name
        owner {
          id
          nfts {
            category
            chain
            createdAtTimestamp
            id
            name
            price
            tokenID
            tokenIPFSPath
          }
        }
        price
        tokenIPFSPath
        tokenID
        createdAtTimestamp
      }
    }
  }
`;
