import React, { useState, useEffect, useRef, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useLocation } from "react-router-dom";
import { getSingleGraphNfts, getSingleNfts } from "../../utils";
import classes from "./singleNftCollection.module.css";
import NftCard from "../../components/Marketplace/NftCard/NftCard";
import { readAllSingleNft } from "../../utils/firebase";
import NotFound from "../../components/not-found/notFound";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import PriceDropdown from "../../components/Marketplace/Price-dropdown/priceDropdown";
import { GenContext } from "../../gen-state/gen.context";
import { createClient } from "urql";
import { GET_ALL_GRAPH_SINGLE_NFTS } from "../../graphql/querries/getCollections";

const SingleNftCollection = () => {
  const domMountRef = useRef(false);
  const { mainnet } = useContext(GenContext);
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
    allChains: null,
    filter: {
      searchValue: "",
      price: "low",
      chain: "All Chains",
    },
  });

  const { algoCollection, polyCollection, celoCollection, auroraCollection, filter, filteredCollection, allChains } =
    state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const getCollectionByChain = () => {
    switch (filter.chain) {
      case "All Chains":
        return allChains;
      case "Algorand":
        return algoCollection;
      case "Polygon":
        return polyCollection;
      case "Celo":
        return celoCollection;
      case "Aurora":
        return auroraCollection;
      default:
        break;
    }
  };

  const updateHistory = () => {
    const params = new URLSearchParams({
      chain: filter.chain.toLowerCase().replace(/ /g, ""), // for close the space in all chains
      ...(filter.searchValue && { search: filter.searchValue.toLowerCase() }),
    });
    history.replace({ pathname: location.pathname, search: params.toString() });
  };

  //  get singleNft collections for all the blockchains
  useEffect(() => {
    try {
      (async function getAlgoSingleNftCollection() {
        const singleNftCollections = await readAllSingleNft(mainnet);
        const result = await getSingleNfts(mainnet, singleNftCollections);
        const data = await client.query(GET_ALL_GRAPH_SINGLE_NFTS).toPromise();

        const allSingleNfts = await getSingleGraphNfts(data.data.nfts);
        handleSetState({
          algoCollection: result,
          auroraCollection: allSingleNfts,
        });
      })();
    } catch (error) {
      console.log(error);
    }

    // get singleNftCollection for other chains: polygon|celo|aurora
  }, [mainnet]);

  // get search result for different blockchains ****
  useEffect(() => {
    const collection = getCollectionByChain();
    if (!collection) return;
    const filtered = collection.filter((col) => col.name.toLowerCase().includes(filter.searchValue.toLowerCase()));
    if (filtered.length) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
    updateHistory();
  }, [filter.searchValue]);

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
  };

  // render blockchains
  useEffect(() => {
    if (domMountRef.current) {
      sortPrice(getCollectionByChain());
    } else {
      domMountRef.current = true;
    }
    updateHistory();
  }, [filter.chain, filter.price, algoCollection, polyCollection, celoCollection, auroraCollection, allChains]);

  // compile data for all blockchains
  useEffect(() => {
    handleSetState({
      allChains: [
        ...(algoCollection || []),
        ...(polyCollection || []),
        ...(celoCollection || []),
        ...(auroraCollection || []),
      ],
    });
  }, [algoCollection, polyCollection, celoCollection, auroraCollection]);

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.heading}>
          <h3>1 of 1s</h3>
        </div>
        <div className={classes.searchAndFilter}>
          <SearchBar onSearch={(value) => handleSetState({ filter: { ...filter, searchValue: value } })} />
          <ChainDropdown onChainFilter={(value) => handleSetState({ filter: { ...filter, chain: value } })} />
          <PriceDropdown onPriceFilter={(value) => handleSetState({ filter: { ...filter, price: value } })} />
        </div>
        {filteredCollection?.length ? (
          <div className={classes.wrapper}>
            {filteredCollection.map((nft, idx) => (
              <NftCard key={idx} nft={nft} />
            ))}
          </div>
        ) : !filteredCollection ? (
          <NotFound />
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
