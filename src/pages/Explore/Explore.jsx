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
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import { setActiveCollection } from "../../gen-state/gen.actions";
import { filterBy, sortBy } from "../Marketplace/Marketplace-script";

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
  } = state;
  const { dispatch, mainnet, algoCollections, auroraCollections, polygonCollections, celoCollections } =
    useContext(GenContext);

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
    let filtered = filterBy({ value: filter.status, collections: NFTCollection });
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
        <div className={classes.section}></div>
        <div className={classes.displayWrapper}>
          <Filter
            handleFilter={handleFilter}
            filterToDelete={filterToDelete}
            attributes={attributes}
            toggleFilter={toggleFilter}
            handleExploreSetState={(prop) => handleSetState({ ...prop })}
          />
          <main className={classes.main}>
            <div className={classes.searchContainer}>
              <SearchBar onSearch={(value) => handleSetState({ filter: { ...filter, searchValue: value } })} />
            </div>

            <div className={classes.filterDisplay}>
              {filter?.attributes &&
                filter.attributes.map((f, idx) => (
                  <div key={idx} className={classes.filteredItem}>
                    <span>{f.trait_type}</span>:<span>{f.value}</span>
                    <CloseIcon onClick={() => handleSetState({ filterToDelete: f })} className={classes.closeIcon} />
                  </div>
                ))}
              {filter?.attributes && filter.attributes.length ? (
                <div onClick={() => handleSetState({ filterToDelete: [] })} className={classes.clearFilter}>
                  clear all
                </div>
              ) : null}
            </div>
            <Menu
              headerHeight={headerHeight}
              NFTCollection={FilteredCollection}
              loadedChain={loadedChain}
              chain={algoCollections[collectionName.trimEnd()]?.chain}
              toggleFilter={toggleFilter}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Explore;
