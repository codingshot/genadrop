import React, { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useHistory, useLocation } from "react-router-dom";
import classes from "./singleNftCollection.module.css";
import NftCard from "../../components/Marketplace/NftCard/NftCard";
import NotFound from "../../components/not-found/notFound";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import FilterDropdown from "../../components/Marketplace/Filter-dropdown/FilterDropdown";
import { GenContext } from "../../gen-state/gen.context";
import supportedChains from "../../utils/supportedChains";

const SingleNftCollection = () => {
  const { singleAlgoNfts, singleAuroraNfts, singlePolygonNfts, singleCeloNfts, chainId } = useContext(GenContext);
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
      chain: "All Chains",
      price: "low - high",
      name: "a - z",
      date: "newest - oldest",
    },
  });

  const { celoCollection, filter, filteredCollection } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const getCollectionByChain = (network = filter.chain) => {
    switch (network.toLowerCase().replace(/ /g, "")) {
      case "allchains":
        return !singleAlgoNftsArr && !singlePolygonNfts && !singleCeloNfts && !singleAuroraNfts
          ? null
          : [
              ...(singleAlgoNftsArr || []),
              ...(singlePolygonNfts || []),
              ...(singleCeloNfts || []),
              ...(singleAuroraNfts || []),
            ];
      case "algorand":
        return singleAlgoNftsArr;
      case "polygon":
        return singlePolygonNfts;
      case "celo":
        return singleCeloNfts;
      case "aurora":
        return singleAuroraNfts;
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
      if (supportedChains[chainId].label === "Algorand") {
        filtered = filteredCollection.sort((a, b) => a?.createdAt?.seconds - b?.createdAt?.seconds);
      } else {
        filtered = filteredCollection.sort((a, b) => a?.createdAt - b?.createdAt);
      }
    } else {
      if (supportedChains[chainId].label === "Algorand") {
        filtered = filteredCollection.sort((a, b) => b?.createdAt?.seconds - a?.createdAt?.seconds);
      } else {
        filtered = filteredCollection.sort((a, b) => b?.createdAt - a?.createdAt);
      }
    }
    handleSetState({ FilteredCollection: filtered });
  }, [filter.date]);

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
    const filtered = collection?.filter(
      (col) =>
        col.name.toLowerCase().includes(name ? name.toLowerCase() : "") ||
        col.description.toLowerCase().includes(name ? name.toLowerCase() : "")
    );
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
            <FilterDropdown onFilter={handleFilterDropdown} />
          </div>
        </div>
        {filteredCollection?.length ? (
          <div className={classes.wrapper}>
            {filteredCollection.map((nft) => (
              <NftCard key={nft.Id} nft={nft} listed />
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
