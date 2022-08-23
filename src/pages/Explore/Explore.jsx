import React, { useContext, useState, useEffect, useRef } from "react";
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
import FilterDropdown from "../../components/Marketplace/Filter-dropdown/FilterDropdown";
import { setActiveCollection } from "../../gen-state/gen.actions";
import supportedChains from "../../utils/supportedChains";

const Explore = () => {
  const [state, setState] = useState({
    toggleFilter: true,
    togglePriceFilter: false,
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
      price: "low - high",
      name: "a - z",
      date: "newest - oldest",
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
  const { dispatch, mainnet, chainId, algoCollections, auroraCollections, polygonCollections, celoCollections } =
    useContext(GenContext);

  const { collectionName } = useParams();

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleFilter = (_filter) => {
    handleSetState({ filter: { ...filter, ..._filter } });
  };

  const handleFilterDropdown = ({ name, label }) => {
    handleSetState({ filter: { ...filter, [name]: label } });
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
      if (Object.keys(algoCollections).length) {
        const collection = algoCollections[collectionName.trimEnd()];
        if (collection) {
          const { NFTCollection, loadedChain } = await getNftCollection({
            collection,
            mainnet,
          });
          handleSetState({ NFTCollection, loadedChain, collection });
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
        const result = await getGraphCollection(NFTCollection[0]?.nfts, NFTCollection[0]);
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
    let filtered = null;
    if (filter.price === "low - high") {
      filtered = NFTCollection.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      filtered = NFTCollection.sort((a, b) => Number(b.price) - Number(a.price));
    }
    handleSetState({ FilteredCollection: filtered });
  }, [filter.price]);

  useEffect(() => {
    if (!NFTCollection) return;
    let filtered = null;
    if (filter.name === "a - z") {
      filtered = NFTCollection.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return -1;
      });
    } else {
      filtered = NFTCollection.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
        return 1;
      });
    }
    handleSetState({ FilteredCollection: filtered });
  }, [filter.name]);

  useEffect(() => {
    if (!NFTCollection) return;
    let filtered = null;
    if (filter.date === "newest - oldest") {
      if (supportedChains[chainId].label === "Algorand") {
        filtered = NFTCollection.sort((a, b) => a?.createdAt?.seconds - b?.createdAt?.seconds);
      } else {
        filtered = NFTCollection.sort((a, b) => a?.createdAt - b?.createdAt);
      }
    } else {
      if (supportedChains[chainId].label === "Algorand") {
        filtered = NFTCollection.sort((a, b) => b?.createdAt?.seconds - a?.createdAt?.seconds);
      } else {
        filtered = NFTCollection.sort((a, b) => b?.createdAt - a?.createdAt);
      }
    }
    handleSetState({ FilteredCollection: filtered });
  }, [filter.date]);

  useEffect(() => {
    if (!NFTCollection) return;
    const filtered = NFTCollection.filter(
      (col) => Number(col.price) >= Number(filter.priceRange.min) && Number(col.price) <= Number(filter.priceRange.max)
    );
    handleSetState({ FilteredCollection: filtered });
  }, [filter.priceRange]);

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

  return (
    <div className={classes.container}>
      <Header
        getHeight={getHeight}
        collection={{
          ...collection,
          numberOfNfts: NFTCollection && NFTCollection.length,
          imageUrl: NFTCollection && NFTCollection[Math.floor(Math.random() * NFTCollection.length)]?.image_url,
        }}
        loadedChain={loadedChain}
      />

      <div className={classes.displayContainer}>
        <Filter
          handleFilter={handleFilter}
          filterToDelete={filterToDelete}
          attributes={attributes}
          toggleFilter={toggleFilter}
          handleExploreSetState={(prop) => handleSetState({ ...prop })}
        />
        <main className={classes.displayWrapper}>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={(value) => handleSetState({ filter: { ...filter, searchValue: value } })} />
            <FilterDropdown onFilter={handleFilterDropdown} />
          </div>

          <div className={classes.filterDisplay}>
            {filter?.attributes &&
              filter.attributes.map((f, idx) => (
                <div key={idx} className={classes.filteredItem}>
                  <span>{`${f.trait_type}: ${f.value}`}</span>
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
            NFTCollection={FilteredCollection}
            loadedChain={loadedChain}
            chain={algoCollections[collectionName.trimEnd()]?.chain}
            toggleFilter={toggleFilter}
          />
        </main>
      </div>
    </div>
  );
};

export default Explore;
