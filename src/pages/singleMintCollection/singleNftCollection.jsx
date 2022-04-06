import React, { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useLocation } from "react-router-dom";
import { getSingleNfts } from "../../utils";
import classes from "./singleNftCollection.module.css";
import NftCard from "../../components/Marketplace/NftCard/NftCard";
import { readAllSingleNft } from "../../utils/firebase";
import NotFound from "../../components/not-found/notFound";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import PriceDropdown from "../../components/Marketplace/Price-dropdown/priceDropdown";
import { GenContext } from "../../gen-state/gen.context";

const SingleNftCollection = () => {
  const { mainnet } = useContext(GenContext);
  const history = useHistory();
  const location = useLocation();
  const [state, setState] = useState({
    togglePriceFilter: false,
    toggleChainFilter: false,
    filteredCollection: [],
    algoCollection: null,
    polyCollection: null,
    celoCollection: null,
    nearCollection: null,
    filter: {
      searchValue: "",
      price: "low",
      chain: "all",
    },
  });

  const {
    algoCollection,
    polyCollection,
    celoCollection,
    nearCollection,
    filter,
    filteredCollection,
  } = state;

  const getCollectionByChain = (network = filter.chain) => {
    switch (network.toLowerCase()) {
      case "all":
        return [
          ...(algoCollection || []),
          ...(polyCollection || []),
          ...(celoCollection || []),
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
      default:
        break;
    }
    return null;
  };

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  // ******************* get singleNft collections for all the blockchains *******************
  useEffect(() => {
    try {
      (async function getAlgoSingleNftCollection() {
        const singleNftCollections = await readAllSingleNft(mainnet);
        if (singleNftCollections.length > 0) {
          const result = await getSingleNfts(mainnet, singleNftCollections);
          handleSetState({
            algoCollection: result,
          });
        }
        return null;
      })();
    } catch (error) {
      console.log(error);
    }
  }, []);
  // *******************************************************************************************

  // ********************* sort by price function for different blockchains ********************
  // eslint-disable-next-line consistent-return
  const sortPrice = () => {
    const collection = getCollectionByChain();
    if (!collection) return handleSetState({ filteredCollection: null });
    let sorted = [];
    if (filter.price === "low") {
      sorted = collection.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      sorted = collection.sort((a, b) => Number(b.price) - Number(a.price));
    }
    handleSetState({ filteredCollection: sorted });
  };
  // *******************************************************************************************

  // *********************************** render blockchains ************************************
  useEffect(() => {
    const { search } = location;
    const name = new URLSearchParams(search).get("search");
    const chainParameter = new URLSearchParams(search).get("chain");
    if (chainParameter) {
      handleSetState({ filter: { ...filter, chain: chainParameter } });
    }
    const collection = getCollectionByChain();
    if (!collection) return handleSetState({ filteredCollection: null });
    if (name) {
      handleSetState({ filter: { ...filter, searchValue: name } });
    }
    const filtered = collection.filter((col) =>
      col.name.toLowerCase().includes(name ? name.toLowerCase() : "")
    );
    if (filtered?.length) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
    return null;
  }, [algoCollection, polyCollection, celoCollection, nearCollection]);
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
    const filtered = collection.filter((col) =>
      col.name.toLowerCase().includes(value.toLowerCase())
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
      chain: value.toLowerCase(),
      ...(name && { search: name }),
    });
    history.replace({ pathname: location.pathname, search: params.toString() });
    handleSetState({ filter: { ...filter, chain: value } });
    const collection = getCollectionByChain(value);
    if (collection) {
      if (filter.searchValue) {
        const filtered = collection.filter((col) =>
          col.name.toLowerCase().includes(filter.searchValue.toLowerCase())
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

  const priceUpdate = (value) => {
    handleSetState({ filter: { ...filter, price: value } });
    sortPrice();
  };
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
            {filteredCollection.map((nft) => (
              <NftCard key={nft.Id} nft={nft} />
            ))}
          </div>
        ) : !filteredCollection ? (
          <NotFound />
        ) : (
          <div className={classes.skeleton}>
            {[...new Array(5)]
              .map((_, idx) => idx)
              .map((id) => (
                <div key={id}>
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
