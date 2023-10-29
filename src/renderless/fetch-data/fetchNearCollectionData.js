import { gql } from "@apollo/client";
import { GET_NEAR_COLLECTIONS } from "../../graphql/querries/getCollections";
import {
  fetchNearCollection,
  getCollectionNearNft,
  getNearCollections,
  getNearCollectionTransactions,
} from "../../utils";
import { nearCollectionClient } from "../../utils/graphqlClient";

export const getNearCollection = async (collectionId, mainnet) => {
  const { data, error } = await nearCollectionClient
    .query(
      gql` query myQuery {
      Collection_by_pk(id: "${collectionId.split('~')[1]}") {
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
    }`
    )
    .toPromise();
  if (error) return [];
  const result = await fetchNearCollection(data?.Collection_by_pk?.Nfts, data?.Collection_by_pk);
  return result;
};

export const getCollectionNft = async (nftId) => {
  const { data, error } = await nearCollectionClient
    .query(
      gql`
        query myQuery {
          Nfts_by_pk(id: "${nftId}") {
            category
            chain
            collection
            createdAtTimestamp
            id
            isListed
            isSold
            isSoulBound
            owner
            price
            tokenIPFSPath
            tokenId
            Collection {
              name
              creator
              id
            }
          }
        }
      `
    )
    .toPromise();
  if (error) return [];
  const result = await getCollectionNearNft(data?.Nfts_by_pk);
  return result;
};

export const getAllNearCollections = async (mainnet) => {
  const { data, error } = await nearCollectionClient.query(GET_NEAR_COLLECTIONS).toPromise();
  if (error) return [];
  const result = await getNearCollections(data?.Collection);
  return result;
};

export const getUserNearCollection = async (userId, mainnet) => {
  const { data, error } = await nearCollectionClient
    .query(
      gql`
        query MyQuery {
          User_by_pk(id: "${userId}") {
            Collections {
              created_at
              creator
              description
              id
              name
              Nfts {
                tokenId
                tokenIPFSPath
                price
                owner
                isSoulBound
                isSold
                isListed
                chain
                collection
                createdAtTimestamp
                id
              }
            }
          }
        }
      `
    )
    .toPromise();
  if (error) return [];
  const result = await getNearCollections(data?.User_by_pk?.Collections);
  return result;
};

export const getCollectionTransactions = async () => {
  const { data, error } = await nearCollectionClient
    .query(
      gql`
        query MyQuery {
          Transactions(where: { Nft: { Collection: { id: { _eq: "agbado.dev-1677462632216-22981353323896" } } } }) {
            from
            id
            price
            to
            txDate
            txId
            type
          }
        }
      `
    )
    .toPromise();
  if (error) return [];
  const result = await getNearCollectionTransactions(data?.Transactions);
  return result;
};
