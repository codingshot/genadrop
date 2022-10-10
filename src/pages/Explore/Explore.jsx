import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./Explore.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import Filter from "./Filter/Filter";
import Header from "./Header/Header";
import { groupAttributesByTraitType, mapAttributeToFilter } from "./Explore-script";
import { getGraphCollection, getNftCollection } from "../../utils";
import Menu from "./Menu/Menu";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import listIcon from "../../assets/icon-items.svg";
import activityIcon from "../../assets/icon-activity.svg";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import { setActiveCollection } from "../../gen-state/gen.actions";
import { filterBy, sortBy } from "../Marketplace/Marketplace-script";
import Items from "./items/items";
import ExploreTransactionHistory from "./exploreTransactionHistory/exploreTransactionHistory";

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
  const {
    toggleFilter,
    collection,
    NFTCollection,
    attributes,
    filter,
    filterToDelete,
    FilteredCollection,
    headerHeight,
    loadedChain,
    activeType,
    collectionId,
  } = state;
  const { dispatch, mainnet, algoCollections, auroraCollections, polygonCollections, celoCollections } = useContext(
    GenContext
  );

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

  const getAllCollectionChains = () => {
    return !auroraCollections && !polygonCollections && !celoCollections
      ? null
      : [...(auroraCollections || []), ...(polygonCollections || []), ...(celoCollections || [])];
  };

  useEffect(() => {
    (async function getAlgoResult() {
      dispatch(setActiveCollection(null));
      if (Object.keys(algoCollections).length) {
        const collection = algoCollections[collectionName.trimEnd()];
        if (collection) {
          const res = await getNftCollection({
            collection,
            mainnet,
          });
          const { NFTCollection } = res;
          handleSetState({ NFTCollection, loadedChain: collection.chain, collection });
          dispatch(setActiveCollection(NFTCollection));
        }
      }
    })();
  }, [algoCollections]);

  useEffect(() => {
    (async function getGraphResult() {
      const allCollection = getAllCollectionChains();
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
    })();
  }, [auroraCollections, polygonCollections, celoCollections]);

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
          <Items handleSetState={handleSetState} state={state} collectionName={collectionName} />
        ) : (
          <ExploreTransactionHistory collectionId={collectionId} chain={NFTCollection[0]?.chain} />
        )}
      </div>
    </div>
  );
};

export default Explore;
