import React, { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useHistory, useLocation } from "react-router-dom";
import { createClient } from "urql";
import { getSingleGraphNfts, getSingleNfts } from "../../utils";
import classes from "./singleNftCollection.module.css";
import NftCard from "../../components/Marketplace/NftCard/NftCard";
import NotFound from "../../components/not-found/notFound";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import PriceDropdown from "../../components/Marketplace/Price-dropdown/priceDropdown";
import { GenContext } from "../../gen-state/gen.context";
import { GET_ALL_GRAPH_SINGLE_NFTS } from "../../graphql/querries/getCollections";
import { readAllSingleNft } from "../../utils/firebase";

const SingleNftCollection = () => {
  const { singleNfts, mainnet } = useContext(GenContext);
  const location = useLocation();
  const history = useHistory();

  const APIURL = "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet";

  const client = createClient({
    url: APIURL,
  });

  const [state, setState] = useState({
    togglePriceFilter: false,
    toggleChainFilter: false,
    filteredCollection: [],
    algoCollection: null,
    polyCollection: null,
    celoCollection: null,
    auroraCollection: null,
    loading: true,
    allChains: null,
    filter: {
      searchValue: "",
      price: "low",
      chain: "All Chains",
    },
  });

  const { algoCollection, polyCollection, celoCollection, auroraCollection, filter, filteredCollection, loading } =
    state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const getCollectionByChain = (network = filter.chain) => {
    switch (network.toLowerCase().replace(/ /g, "")) {
      case "allchains":
        return !algoCollection && !polyCollection && !celoCollection && !auroraCollection
          ? null
          : [
              ...(algoCollection || []),
              ...(polyCollection || []),
              ...(celoCollection || []),
              ...(auroraCollection || []),
            ];
      case "algorand":
        return algoCollection;
      case "polygon":
        return polyCollection;
      case "celo":
        return celoCollection;
      case "aurora":
        return auroraCollection;
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

  //  get singleNft collections for all the blockchains
  useEffect(() => {
    try {
      (async function getAlgoSingleNftCollection() {
        const result = await getSingleNfts(mainnet, singleNfts);
        const data = await client.query(GET_ALL_GRAPH_SINGLE_NFTS).toPromise();
        const allSingleNfts = await getSingleGraphNfts(data.data.nfts);
        handleSetState({
          algoCollection: result || [],
          auroraCollection: allSingleNfts || [],
          loading: false,
        });
      })();
    } catch (error) {
      console.log(error);
    }

    // get singleNftCollection for other chains: polygon|celo|aurora
  }, [mainnet]);

  // compile data for all blockchains
  useEffect(() => {
    const { search } = location;
    const name = new URLSearchParams(search).get("search");
    const chainParameter = new URLSearchParams(search).get("chain");
    if (chainParameter) {
      handleSetState({ filter: { ...filter, chain: chainParameter } });
    }
    const collection = getCollectionByChain();
    if (loading) return collection;
    if (name) {
      handleSetState({ filter: { ...filter, searchValue: name } });
    }
    const filtered = collection?.filter((col) => col.name.toLowerCase().includes(name ? name.toLowerCase() : ""));
    if (filtered?.length) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
    return null;
  }, [algoCollection, polyCollection, celoCollection, auroraCollection]);

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.heading}>
          <h3>1 of 1s</h3>
        </div>
        <div className={classes.searchAndFilter}>
          <SearchBar onSearch={searchHandler} />
          <ChainDropdown onChainFilter={chainChange} />
          <PriceDropdown onPriceFilter={priceUpdate} />
        </div>
        {filteredCollection?.length ? (
          <div className={classes.wrapper}>
            {filteredCollection.map((nft, idx) => (
              <NftCard key={idx} nft={nft} />
            ))}
          </div>
        ) : !filteredCollection && filter.searchValue ? (
          <NotFound />
        ) : !filteredCollection ? (
          <h1 className={classes.noResult}>No Results Found</h1>
        ) : (
          <div className={classes.skeleton}>
            {Array(5)
              .fill(null)
              .map((_, idx) => (
                <div key={idx}>
                  <Skeleton count={1} height={200} />
                  <Skeleton count={3} height={40} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleNftCollection;
