import { useEffect, useRef, useState, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./collections.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import { getNftCollections } from "../../utils";
import CollectionsCard from "../../components/Marketplace/collectionsCard/collectionsCard";
import { fetchCollections } from "../../utils/firebase";
import { GenContext } from "../../gen-state/gen.context";
import NotFound from "../../components/not-found/notFound";
import PriceDropdown from "../../components/Marketplace/Price-dropdown/priceDropdown";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import { useHistory, useLocation } from "react-router-dom";

const Collections = () => {
  const domMountRef = useRef(false);
  const { mainnet } = useContext(GenContext);
  const location = useLocation();
  const history = useHistory();

  const [state, setState] = useState({
    filteredCollection: [],
    algoCollection: null,
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

  const { algoCollection, polyCollection, celoCollection, nearCollection, filter, filteredCollection, allChains } =
    state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
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
      case "Near":
        return nearCollection;
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

  //fetch data from different blockchains
  useEffect(() => {
    try {
      (async function getAlgoCollection() {
        const collections = await fetchCollections(mainnet);
        const result = await getNftCollections(collections, mainnet);
        handleSetState({ algoCollection: result });
      })();
    } catch (error) {
      console.log(error);
    }

    // get collection for other chains: polygon|celo|near
  }, [mainnet]);

  //get search result for all blockchains
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
  }, [filter.chain, filter.price, algoCollection, polyCollection, celoCollection, nearCollection, allChains]);

  // compile data for all blockchains
  useEffect(() => {
    handleSetState({
      allChains: [
        ...(algoCollection || []),
        ...(polyCollection || []),
        ...(celoCollection || []),
        ...(nearCollection || []),
      ],
    });
  }, [algoCollection, polyCollection, celoCollection, nearCollection]);

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.header}>
          <h1>Collections</h1>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={(value) => handleSetState({ filter: { ...filter, searchValue: value } })} />
            <ChainDropdown onChainFilter={(value) => handleSetState({ filter: { ...filter, chain: value } })} />
            <PriceDropdown onPriceFilter={(value) => handleSetState({ filter: { ...filter, price: value } })} />
          </div>
        </div>
        {filteredCollection?.length ? (
          <div className={classes.wrapper}>
            {filteredCollection.map((collection, idx) => (
              <CollectionsCard key={idx} collection={collection} />
            ))}
          </div>
        ) : !filteredCollection ? (
          <NotFound />
        ) : (
          <div className={classes.skeleton}>
            {Array(4)
              .fill(null)
              .map((_, idx) => (
                <div key={idx}>
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
