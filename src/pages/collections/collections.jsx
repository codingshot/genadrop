import React, { useEffect, useState, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useLocation } from "react-router-dom";
import classes from "./collections.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import { getAuroraCollections, getNftCollections } from "../../utils";
import CollectionsCard from "../../components/Marketplace/collectionsCard/collectionsCard";
import { fetchCollections } from "../../utils/firebase";
import { GenContext } from "../../gen-state/gen.context";
import NotFound from "../../components/not-found/notFound";
import PriceDropdown from "../../components/Marketplace/Price-dropdown/priceDropdown";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import { createClient } from "urql";
import { GET_ALL_AURORA_COLLECTIONS } from "../../graphql/querries/getCollections";
import { polygonClient } from "../../utils/graphqlClient";

const Collections = () => {
  const { mainnet } = useContext(GenContext);
  const location = useLocation();
  const history = useHistory();

  const APIURL = "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet";

  const client = createClient({
    url: APIURL,
  });

  const [state, setState] = useState({
    filteredCollection: [],
    algoCollection: null,
    polyCollection: null,
    celoCollection: null,
    nearCollection: null,
    auroraCollection: null,
    loading: true,
    allChains: null,
    filter: {
      searchValue: "",
      price: "low",
      chain: "All Chains",
    },
  });

  const {
    algoCollection,
    polyCollection,
    celoCollection,
    nearCollection,
    filter,
    filteredCollection,
    loading,
    auroraCollection,
  } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const getCollectionByChain = (network = filter.chain) => {
    switch (network.toLowerCase().replace(/ /g, "")) {
      case "allchains":
        return !algoCollection && !polyCollection && !celoCollection && !nearCollection && !auroraCollection
          ? null
          : [
              ...(algoCollection || []),
              ...(polyCollection || []),
              ...(celoCollection || []),
              ...(auroraCollection || []),
              ...(nearCollection || []),
            ];
      case "algorand":
        return algoCollection;
      case "polygon":
        return polyCollection;
      case "celo":
        return celoCollection;
      case "near":
        return nearCollection;
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

  // fetch data from different blockchains
  useEffect(() => {
    try {
      (async function getAlgoCollection() {
        const collections = await fetchCollections(mainnet);
        const result = await getNftCollections(collections, mainnet);
        handleSetState({ algoCollection: result || [], loading: false });
      })();
    } catch (error) {
      console.log(error);
    }

    // get collection for other chains: polygon|celo|near
  }, [mainnet]);

  useEffect(() => {
    (async function getSubgraphNfts() {
      const data = await client.query(GET_ALL_AURORA_COLLECTIONS).toPromise();
      const polygonData = await polygonClient.query(GET_ALL_AURORA_COLLECTIONS).toPromise();
      const polygonResult = await getAuroraCollections(polygonData.data.collections);
      const result = await getAuroraCollections(data.data.collections);
      if (result?.length) {
        handleSetState({ auroraCollection: result, polyCollection: polygonResult });
      } else {
        handleSetState({ auroraCollection: null, polyCollection: null });
      }
    })();
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
  }, [algoCollection, polyCollection, celoCollection, nearCollection]);

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
