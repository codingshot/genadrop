import { GET_GRAPH_NFT, GET_USER_NFT } from "../../graphql/querries/getCollections";
import { getGraphNft, getTransactions, getUserGraphNft } from "../../utils";
import { auroraClient, celoClient, polygonClient } from "../../utils/graphqlClient";

export const polygonUserData = async (address) => {
  const { data: polygonData, error: polygonError } = await polygonClient
    .query(GET_GRAPH_NFT, { id: address })
    .toPromise();
  if (polygonError) return;
  let trHistory;
  let polygonResult = [];
  if (polygonData?.nft !== null) {
    polygonResult = await getGraphNft(polygonData?.nft);
    trHistory = await getTransactions(polygonData?.nft?.transactions);
    trHistory.find((t) => {
      if (t.type === "Minting") t.price = polygonResult[0].price;
    });
  }
  return [polygonResult[0], trHistory];
};

export const getPolygonNFTToList = async (address, nftId) => {
  const { data, error: polygonError } = await polygonClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (polygonError) return;
  const polygonBoughtNft = await getUserGraphNft(data?.user?.nfts, address);
  const nft = polygonBoughtNft.filter((NFT) => NFT.tokenID === nftId)[0];
  return nft;
};

export const getCeloNFTToList = async (address, nftId) => {
  const { data, error: polygonError } = await celoClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (polygonError) return;
  const polygonBoughtNft = await getUserGraphNft(data?.user?.nfts, address);
  const nft = polygonBoughtNft.filter((NFT) => NFT.tokenID === nftId)[0];
  return nft;
};

export const auroraUserData = async (address) => {
  const { data: auroraData, error: auroraError } = await auroraClient.query(GET_GRAPH_NFT, { id: address }).toPromise();
  if (auroraError) return;
  let trHistory;
  let auroraResult = [];
  if (auroraData?.nft !== null) {
    auroraResult = await getGraphNft(auroraData?.nft);
    trHistory = await getTransactions(auroraData?.nft?.transactions);
    trHistory.find((t) => {
      if (t.type === "Minting") t.price = auroraResult[0].price;
    });
  }
  return [auroraResult[0], trHistory];
};

export const celoUserData = async (address) => {
  const { data: celoData, error: celoError } = await celoClient.query(GET_GRAPH_NFT, { id: address }).toPromise();
  if (celoError) return;
  let trHistory;
  let celoResult = [];
  if (celoData?.nft !== null) {
    celoResult = await getGraphNft(celoData?.nft);
    trHistory = await getTransactions(celoData?.nft?.transactions);
    trHistory.find((t) => {
      if (t.type === "Minting") t.price = celoResult[0].price;
    });
  }
  return [celoResult[0], trHistory];
};
