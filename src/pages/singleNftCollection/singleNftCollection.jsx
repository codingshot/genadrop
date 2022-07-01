import React, { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useHistory, useLocation } from "react-router-dom";
import classes from "./singleNftCollection.module.css";
import NftCard from "../../components/Marketplace/NftCard/NftCard";
import NotFound from "../../components/not-found/notFound";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import PriceDropdown from "../../components/Marketplace/Price-dropdown/priceDropdown";
import { GenContext } from "../../gen-state/gen.context";

const SingleNftCollection = () => {
  const { singleAlgoNfts, singleAuroraNfts, singlePolygonNfts } = useContext(GenContext);
  const singleAlgoNftsArr = Object.values(singleAlgoNfts);

  const location = useLocation();
  const history = useHistory();

  const [state, setState] = useState({
    togglePriceFilter: false,
    toggleChainFilter: false,
    filteredCollection: [],
    celoCollection: null,
    allChains: null,
    filter: {
      searchValue: "",
      price: "low",
      chain: "All Chains",
    },
  });

  const { celoCollection, filter, filteredCollection } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const getCollectionByChain = (network = filter.chain) => {
    switch (network.toLowerCase().replace(/ /g, "")) {
      case "allchains":
        return !singleAlgoNftsArr && !singlePolygonNfts && !celoCollection && !singleAuroraNfts
          ? null
          : [
              ...(singleAlgoNftsArr || []),
              ...(singlePolygonNfts || []),
              ...(celoCollection || []),
              ...(singleAuroraNfts || []),
            ];
      case "algorand":
        return singleAlgoNftsArr;
      case "polygon":
        return singlePolygonNfts;
      case "celo":
        return celoCollection;
      case "aurora":
        return singleAuroraNfts;
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
  const sortPrice = (filterProp) => {
    let sorted = [];
    if (filterProp === "high") {
      sorted = filteredCollection.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (filterProp == "low") {
      sorted = filteredCollection.sort((a, b) => Number(b.price) - Number(a.price));
      // } else if (filterProp === "txVolume") {
      //   sorted = filteredCollection.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (filterProp === "newest") {
      sorted = filteredCollection.sort((a, b) => a?.createdAt["seconds"] - b?.createdAt["seconds"]);
    } else if (filterProp === "oldest") {
      sorted = filteredCollection.sort((a, b) => b?.createdAt["seconds"] - a?.createdAt["seconds"]);
    } else if (filterProp === "descAlphabet") {
      sorted = filteredCollection.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    } else if (filterProp === "ascAlphabet") {
      sorted = filteredCollection.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())).reverse();
    }
    handleSetState({ filteredCollection: sorted });
  };

  // compile data for all blockchains
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
    const filtered = collection?.filter((col) => col.name.toLowerCase().includes(name ? name.toLowerCase() : ""));
    if (singleAlgoNftsArr || singleAuroraNfts) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
    return null;
  }, [singleAlgoNfts, singlePolygonNfts, celoCollection, singleAuroraNfts]);

  useEffect(() => {
    window.localStorage.activeAlgoNft = null;
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.header}>
          <h1>1 of 1s</h1>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={searchHandler} />
            <ChainDropdown onChainFilter={chainChange} />
            <PriceDropdown onPriceFilter={sortPrice} />
          </div>
        </div>
        {filteredCollection?.length ? (
          <div className={classes.wrapper}>
            {filteredCollection.map((nft) => (
              <NftCard key={nft.Id} nft={nft} />
            ))}
          </div>
        ) : !filteredCollection && filter.searchValue ? (
          <NotFound />
        ) : !filteredCollection ? (
          <NotFound />
        ) : (
          <div className={classes.skeleton}>
            {[...new Array(5)].map((id) => (
              <div key={id}>
                <Skeleton count={1} height={200} />
                <br />
                <Skeleton count={1} height={30} />
                <br />
                <Skeleton count={1} height={30} />{" "}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleNftCollection;
