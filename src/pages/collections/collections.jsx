import React, { useEffect, useState, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useLocation } from "react-router-dom";
import classes from "./collections.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import CollectionsCard from "../../components/Marketplace/collectionsCard/collectionsCard";
import { GenContext } from "../../gen-state/gen.context";
import NotFound from "../../components/not-found/notFound";
import PriceDropdown from "../../components/Marketplace/Price-dropdown/priceDropdown";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";

const Collections = () => {
  const { auroraCollections, algoCollections } = useContext(GenContext);
  const location = useLocation();
  const history = useHistory();

  const [state, setState] = useState({
    filteredCollection: [],
    polyCollection: null,
    celoCollection: null,
    nearCollection: null,
    allChains: null,
    filter: {
      searchValue: "",
      price: "low",
      chain: "All Chains",
    },
  });

  const { polyCollection, celoCollection, nearCollection, filter, filteredCollection } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const getCollectionByChain = (network = filter.chain) => {
    switch (network.toLowerCase().replace(/ /g, "")) {
      case "allchains":
        return !algoCollections && !polyCollection && !celoCollection && !nearCollection && !auroraCollections
          ? null
          : [
              ...(algoCollections || []),
              ...(polyCollection || []),
              ...(celoCollection || []),
              ...(auroraCollections || []),
              ...(nearCollection || []),
            ];
      case "algorand":
        return algoCollections;
      case "polygon":
        return polyCollection;
      case "celo":
        return celoCollection;
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
    const filtered = collection.filter((col) => col.name.toLowerCase().includes(value.toLowerCase()));
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
        const filtered = collection.filter((col) => col.name.toLowerCase().includes(name ? name.toLowerCase() : ""));
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

  // sort by price function for different blockchains
  const sortPrice = (collection) => {
    if (!collection) return handleSetState({ filteredCollection: null });
    let sorted = [];
    if (filter.price === "low") {
      sorted = collection.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      sorted = collection.sort((a, b) => Number(b.price) - Number(a.price));
    }
    handleSetState({ filteredCollection: sorted });
    return sorted;
  };

  // Price update
  const priceUpdate = (value) => {
    handleSetState({ filter: { ...filter, price: value } });
    sortPrice();
  };

  // compile data for all blockchains
  useEffect(() => {
    const { search } = location;
    const name = new URLSearchParams(search).get("search");
    const chainParameter = new URLSearchParams(search).get("chain");
    if (chainParameter) {
      handleSetState({ filter: { ...filter, chain: chainParameter } });
    }
    const collection = getCollectionByChain();
    if (name) {
      handleSetState({ filter: { ...filter, searchValue: name } });
    }
    const filtered = collection?.filter((col) => col.name.toLowerCase().includes(name ? name.toLowerCase() : ""));
    if (algoCollections || auroraCollections) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
    return null;
  }, [algoCollections, polyCollection, celoCollection, auroraCollections]);

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.header}>
          <h1>Collections</h1>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={searchHandler} />
            <ChainDropdown onChainFilter={chainChange} />
            <PriceDropdown onPriceFilter={priceUpdate} />
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
          <h1 className={classes.noResult}>No Results Found</h1>
        ) : (
          <div className={classes.skeleton}>
            {[...new Array(4)]
              .map((_, idx) => idx)
              .map((id) => (
                <div key={id}>
                  <Skeleton count={1} height={250} />
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
