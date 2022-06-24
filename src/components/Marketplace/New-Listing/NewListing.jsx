import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./NewListing.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import CollectionsCard from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";
import ChainDropdown from "../Chain-dropdown/chainDropdown";

const NewListing = () => {
  const { auroraCollections, algoCollections, polygonCollections } = useContext(GenContext);
  const algoCollectionsArr = algoCollections ? Object.values(algoCollections) : [];

  const [state, setState] = useState({
    filteredCollection: [],
    celoCollection: null,
    nearCollection: null,
    allChains: null,
    init: false,
    filter: {
      chain: "All Chains",
    },
  });

  const { celoCollection, nearCollection, filter, filteredCollection, init } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const getCollectionByChain = (network = filter.chain) => {
    switch (network.toLowerCase().replace(/ /g, "")) {
      case "allchains":
        return !algoCollectionsArr && !polygonCollections && !celoCollection && !nearCollection && !auroraCollections
          ? null
          : [
              ...(algoCollectionsArr || []),
              ...(polygonCollections || []),
              ...(celoCollection || []),
              ...(auroraCollections || []),
              ...(nearCollection || []),
            ];
      case "algorand":
        return algoCollectionsArr;
      case "polygon":
        return polygonCollections;
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

  const chainChange = (value) => {
    handleSetState({ filter: { ...filter, chain: value } });
    const collection = getCollectionByChain(value.toLowerCase().replace(/ /g, ""));
    if (collection) {
      handleSetState({ filteredCollection: collection });
    } else {
      handleSetState({ filteredCollection: null });
    }
    handleSetState({ init: !init });
  };

  useEffect(() => {
    const collection = getCollectionByChain(filter.chain);
    if (collection) {
      handleSetState({ filteredCollection: collection });
    } else {
      handleSetState({ filteredCollection: null });
    }
  }, [algoCollections, polygonCollections, celoCollection, auroraCollections]);

  useEffect(() => {
    window.localStorage.activeCollection = null;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>What's New</h3>
        <ChainDropdown onChainFilter={chainChange} />
      </div>

      <GenadropCarouselScreen cardWidth={16 * 20} gap={16} init={init}>
        {filteredCollection?.length ? (
          filteredCollection.map((collection, idx) => (
            <CollectionsCard useWidth="20em" key={idx} collection={collection} />
          ))
        ) : !filteredCollection ? (
          <NotFound />
        ) : (
          [...new Array(4)].map((_, idx) => (
            <div className={classes.skeleton} useWidth="20em" key={idx}>
              <Skeleton count={1} height={250} />
              <br />
              <Skeleton count={1} height={30} />
              <br />
              <Skeleton count={1} height={30} />
            </div>
          ))
        )}
      </GenadropCarouselScreen>
    </div>
  );
};

export default NewListing;