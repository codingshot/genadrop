import React, { useEffect, useState, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useLocation } from "react-router-dom";
import classes from "./collections.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import CollectionsCard from "../../components/Marketplace/collectionsCard/collectionsCard";
import { GenContext } from "../../gen-state/gen.context";
import NotFound from "../../components/not-found/notFound";
import FilterDropdown from "../../components/Marketplace/Filter-dropdown/FilterDropdown";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import supportedChains from "../../utils/supportedChains";

const Collections = () => {
  const { auroraCollections, algoCollections, polygonCollections, celoCollections, chainId } = useContext(GenContext);
  const algoCollectionsArr = algoCollections ? Object.values(algoCollections) : [];

  const location = useLocation();
  const history = useHistory();

  const [state, setState] = useState({
    filteredCollection: [],
    celoCollection: null,
    nearCollection: null,
    allChains: null,
    filter: {
      searchValue: "",
      chain: "All Chains",
      price: "low - high",
      name: "a - z",
      date: "newest - oldest",
    },
  });

  const { celoCollection, nearCollection, filter, filteredCollection } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const getCollectionByChain = (network = filter.chain) => {
    switch (network.toLowerCase().replace(/ /g, "")) {
      case "allchains":
        return !algoCollectionsArr && !polygonCollections && !celoCollections && !nearCollection && !auroraCollections
          ? null
          : [
              ...(algoCollectionsArr || []),
              ...(polygonCollections || []),
              ...(celoCollections || []),
              ...(auroraCollections || []),
              ...(nearCollection || []),
            ];
      case "algorand":
        return algoCollectionsArr;
      case "polygon":
        return polygonCollections;
      case "celo":
        return celoCollections;
      case "near":
        return nearCollection;
      case "aurora":
        return auroraCollections;
      default:
        break;
    }
    return null;
  };

  // get search result for all blockchains
  const searchHandler = (value) => {
    value = value.trim().toLowerCase();
    if (!value) return;
    handleSetState({ filter: { ...filter, searchValue: value } });
    const { search } = location;
    const chainParam = new URLSearchParams(search).get("chain");
    const params = new URLSearchParams({
      search: value,
      ...(chainParam && { chain: chainParam }),
    });
    history.replace({ pathname: location.pathname, search: params.toString() });
    const collection = getCollectionByChain();
    if (!collection) return;
    const filtered = collection.filter(
      (col) => col.name.toLowerCase().includes(value) || col.description.toLowerCase().includes(value)
    );
    if (filtered.length) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
  };

  const chainChange = (value) => {
    const { search } = location;
    const name = new URLSearchParams(search).get("search");
    const params = new URLSearchParams({
      chain: value.toLowerCase().replace(/ /g, ""),
      ...(name && { search: name }),
    });
    history.replace({ pathname: location.pathname, search: params.toString() });
    handleSetState({ filter: { ...filter, chain: value } });
    const collection = getCollectionByChain(value.toLowerCase().replace(/ /g, ""));
    if (collection) {
      if (filter.searchValue) {
        const filtered = collection.filter(
          (col) =>
            col.name.toLowerCase().includes(name ? name.toLowerCase() : "") ||
            col.description.toLowerCase().includes(name ? name.toLowerCase() : "")
        );
        if (filtered.length) {
          handleSetState({ filteredCollection: filtered });
        } else {
          handleSetState({ filteredCollection: null });
        }
      } else {
        handleSetState({ filteredCollection: collection });
      }
    } else {
      handleSetState({ filteredCollection: null });
    }
  };

  const handleFilterDropdown = ({ name, label }) => {
    handleSetState({ filter: { ...filter, [name]: label } });
  };

  useEffect(() => {
    if (!filteredCollection) return;
    let filtered = null;
    if (filter.price === "low - high") {
      filtered = filteredCollection.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      filtered = filteredCollection.sort((a, b) => Number(b.price) - Number(a.price));
    }
    handleSetState({ FilteredCollection: filtered });
  }, [filter.price]);

  useEffect(() => {
    if (!filteredCollection) return;
    let filtered = null;
    if (filter.name === "a - z") {
      filtered = filteredCollection.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return -1;
      });
    } else {
      filtered = filteredCollection.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
        return 1;
      });
    }
    handleSetState({ FilteredCollection: filtered });
  }, [filter.name]);

  useEffect(() => {
    if (!filteredCollection) return;
    let filtered = null;
    if (filter.date === "newest - oldest") {
      if (supportedChains[chainId]?.label === "Algorand") {
        filtered = filteredCollection.sort((a, b) => a?.createdAt?.seconds - b?.createdAt?.seconds);
      } else {
        filtered = filteredCollection.sort((a, b) => a?.createdAt - b?.createdAt);
      }
    } else {
      if (supportedChains[chainId]?.label === "Algorand") {
        filtered = filteredCollection.sort((a, b) => b?.createdAt?.seconds - a?.createdAt?.seconds);
      } else {
        filtered = filteredCollection.sort((a, b) => b?.createdAt - a?.createdAt);
      }
    }
    handleSetState({ FilteredCollection: filtered });
  }, [filter.date]);

  useEffect(() => {
    const { search } = location;
    const name = new URLSearchParams(search).get("search");
    const chainParameter = new URLSearchParams(search).get("chain");
    if (chainParameter) {
      handleSetState({ filter: { ...filter, chain: chainParameter } });
    }
    const collection = getCollectionByChain(chainParameter ? chainParameter.toLowerCase() : "All Chains");
    if (name) {
      handleSetState({ filter: { ...filter, searchValue: name } });
    }
    const filtered = collection?.filter(
      (col) =>
        col.name.toLowerCase().includes(name ? name.toLowerCase() : "") ||
        col.description.toLowerCase().includes(name ? name.toLowerCase() : "")
    );
    if (algoCollectionsArr || auroraCollections || celoCollection || polygonCollections) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
    return null;
  }, [algoCollections, polygonCollections, celoCollection, auroraCollections]);

  useEffect(() => {
    window.localStorage.activeCollection = {};
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.header}>
          <h1>Collections</h1>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={searchHandler} />
            <ChainDropdown onChainFilter={chainChange} />
            <FilterDropdown onFilter={handleFilterDropdown} />
          </div>
        </div>
        {filteredCollection?.length ? (
          <div className={classes.wrapper}>
            {filteredCollection.map((collection, idx) => (
              <CollectionsCard key={idx} collection={collection} />
            ))}
          </div>
        ) : !filteredCollection && filter.searchValue ? (
          <NotFound />
        ) : !filteredCollection ? (
          <NotFound />
        ) : (
          <div className={classes.skeleton}>
            {[...new Array(5)].map((_, id) => (
              <div key={id}>
                <Skeleton count={1} height={200} />
                <br />
                <Skeleton count={1} height={30} />
                <br />
                <Skeleton count={1} height={30} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
