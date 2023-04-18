import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./Explore.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import Header from "./Header/Header";
import { groupAttributesByTraitType, mapAttributeToFilter } from "./Explore-script";
import { getGraphCollection, getNftCollection } from "../../utils";
import listIcon from "../../assets/icon-items.svg";
import activityIcon from "../../assets/icon-activity.svg";
import { setActiveCollection } from "../../gen-state/gen.actions";
import { filterBy, sortBy } from "../Marketplace/Marketplace-script";
import Items from "./items/items";
import ExploreTransactionHistory from "./exploreTransactionHistory/exploreTransactionHistory";
import { getNearCollection } from "../../renderless/fetch-data/fetchNearCollectionData";
import supportedChains from "../../utils/supportedChains";
import {
  getAllAlgorandCollections,
  getAuroraSingleCollection,
  getCeloSingleCollection,
  getPolygonSingleCollection,
} from "../../renderless/fetch-data/fetchUserGraphData";
import { fetchAlgoCollections } from "../../utils/firebase";

const Explore = () => {
  const [state, setState] = useState({
    toggleFilter: true,
    NFTCollection: null,
    FilteredCollection: null,
    loadedChain: null,
    allGraphCollection: [],
    collection: null,
    attributes: null,
    filterToDelete: null,
    headerHeight: 0,
    filter: {
      searchValue: "",
      status: "not listed",
      sortby: "newest",
    },
    activeType: "T1",
    collectionId: null,
  });
  const { collection, NFTCollection, filter, headerHeight, loadedChain, activeType, collectionId } = state;
  const { dispatch, mainnet } = useContext(GenContext);

  const { collectionName } = useParams();

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleFilter = (_filter) => {
    handleSetState({ filter: { ...filter, ..._filter } });
  };

  const getHeight = (res) => {
    handleSetState({ headerHeight: res });
  };

  const getAllCollectionChains = async () => {
    let result = await getNearCollection(collectionName, mainnet);
    if (result.length) {
      return result;
    }

    if (result.length <= 0) {
      let nftData = [];
      let collectionData = [];
      const chainId = collectionName.split("~")[0];
      const splitCollectionId = collectionName.split("~")[1];
      if (supportedChains[chainId]?.chain === "Polygon") {
        [nftData, collectionData] = await getPolygonSingleCollection(splitCollectionId);
      } else if (supportedChains[chainId]?.chain === "Celo") {
        [nftData, collectionData] = await getCeloSingleCollection(splitCollectionId);
      } else if (supportedChains[chainId]?.chain === "Aurora") {
        [nftData, collectionData] = await getAuroraSingleCollection(splitCollectionId);
      } else {
        const fetchAlgorandCollections = await getAllAlgorandCollections(mainnet, dispatch);
        if (fetchAlgorandCollections) {
          const singleAlgorandCollection = fetchAlgorandCollections.filter((data) => data?.name === collectionName)[0];
          const res = await getNftCollection({
            collection: singleAlgorandCollection,
            mainnet,
          });
          const { NFTCollection } = res;
          handleSetState({
            NFTCollection,
            loadedChain: singleAlgorandCollection.chain,
            collection: singleAlgorandCollection,
          });
          dispatch(setActiveCollection(NFTCollection));
          return fetchAlgoCollections;
        }
      }
      handleSetState({
        collection: {
          ...collectionData,
          owner: collectionData?.owner,
          price: nftData?.collectionPrice,
        },
        collectionId: collectionData?.Id,

        NFTCollection: nftData,
        loadedChain: nftData?.chain,
      });
    }

    return result;
  };

  useEffect(() => {
    (async function getGraphResult() {
      const allCollection = await getAllCollectionChains();

      if (supportedChains[allCollection[0]?.chain]?.chain === "Near") {
        handleSetState({
          collection: {
            ...allCollection[0],
            owner: allCollection[0]?.owner,
            price: allCollection[0]?.price,
          },
          collectionId: allCollection[0]?.Id,
          NFTCollection: allCollection,
          loadedChain: allCollection[0]?.chain,
        });
      }
      if (collectionName.split("~")[1]) {
        const NFTCollection = allCollection?.filter((col) => col?.Id === collectionName);
        if (NFTCollection?.length) {
          const result = await getGraphCollection(NFTCollection[0].nfts, NFTCollection[0]);
          handleSetState({
            collection: {
              ...NFTCollection[0],
              owner: NFTCollection[0]?.owner,
              price: result[0]?.collectionPrice,
            },
            collectionId: NFTCollection[0]?.Id,

            NFTCollection: result,
            loadedChain: result[0]?.chain,
          });
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (!NFTCollection) return;
    handleSetState({
      attributes: mapAttributeToFilter(NFTCollection),
      FilteredCollection: NFTCollection,
    });
  }, [NFTCollection]);

  useEffect(() => {
    if (!NFTCollection) return;
    const filtered = NFTCollection.filter((col) => col.name.toLowerCase().includes(filter.searchValue.toLowerCase()));
    handleSetState({ FilteredCollection: filtered });
  }, [filter.searchValue]);

  useEffect(() => {
    if (!NFTCollection) return;
    const filtered = filterBy({ value: filter.status, collections: NFTCollection });
    handleSetState({ FilteredCollection: filtered });
  }, [filter.status]);

  useEffect(() => {
    if (!NFTCollection) return;
    const filtered = sortBy({ value: filter.sortby, collections: NFTCollection });
    handleSetState({ FilteredCollection: filtered });
  }, [filter.sortby]);

  useEffect(() => {
    if (!NFTCollection) return;
    const groupedAttributes = groupAttributesByTraitType(filter.attributes);
    const filtered = NFTCollection.filter((col) =>
      Object.keys(groupedAttributes).every((attributeKey) =>
        groupedAttributes[attributeKey].some((el) =>
          JSON.stringify(col.ipfs_data.properties).includes(JSON.stringify(el))
        )
      )
    );
    handleSetState({ FilteredCollection: filtered });
    document.documentElement.scrollTop = headerHeight;
  }, [filter.attributes]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  const handleTabActive = (active) => {
    handleSetState({
      activeType: active,
    });
  };
  return (
    <div className={classes.container}>
      {collection ? (
        <Header
          getHeight={getHeight}
          collection={{
            ...collection,
          }}
          loadedChain={loadedChain}
        />
      ) : null}

      <div className={classes.displayContainer}>
        <div className={`${classes.displayWrapper} ${classes.section}`}>
          <div className={classes.types}>
            <div
              onClick={() => handleTabActive("T1")}
              className={`${classes.type}  ${activeType === "T1" && classes.active}`}
            >
              <img src={listIcon} alt="" />
              Items
            </div>
            <div
              onClick={() => handleTabActive("T2")}
              className={`${classes.type}  ${activeType === "T2" && classes.active}`}
            >
              <img src={activityIcon} alt="" />
              Activity
            </div>
          </div>
        </div>

        {activeType === "T1" ? (
          <Items
            handleSetState={handleSetState}
            state={state}
            collectionName={collectionName.split("~")[1] ? collectionName.split("~")[1] : collectionName}
          />
        ) : (
          <ExploreTransactionHistory collectionId={collectionId} chain={NFTCollection[0]?.chain} />
        )}
      </div>
    </div>
  );
};

export default Explore;
