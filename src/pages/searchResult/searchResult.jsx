/* eslint-disable no-shadow */
import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import classes from "./searchResult.module.css";
import { GenContext } from "../../gen-state/gen.context";
import handleSuggestions from "../../components/Search/Search-script";
import Pagination from "../../components/pagination/Pagination";
import FilterDropdown from "../../components/Marketplace/Filter-dropdown/FilterDropdown";
import { rangeBy, sortBy } from "../Marketplace/Marketplace-script";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import CollectionsCard from "../../components/Marketplace/collectionsCard/collectionsCard";
import NftCard from "../../components/Marketplace/NftCard/NftCard";
import NotFound from "../../components/not-found/notFound";
import supportedChains from "../../utils/supportedChains";

const SearchResult = () => {
  const [state, setState] = useState({
    paginatePage: "",
    suggestions: null,
    filteredCollection: null,
    type: "all",
    chainID: "all",
    pageNumber: 0,
  });
  const { paginatePage, suggestions, type, chainID, filteredCollection, pageNumber } = state;
  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };
  const location = useLocation();
  const { search } = location;
  const keyword = new URLSearchParams(search).get("keyword");

  const { searchContainer } = useContext(GenContext);

  useEffect(() => {
    if (searchContainer && keyword) {
      handleSuggestions({ handleSetState, searchContainer, value: keyword });
    }
  }, [keyword, searchContainer]);

  const onChainFilter = (name) => {
    const networksIDs = Object.keys(supportedChains);
    networksIDs.map((id) => {
      if (supportedChains[id].chain === name) {
        handleSetState({ chainID: id });
      } else if (name === "All Chains") {
        handleSetState({ chainID: "all" });
      }
      return null;
    });
  };

  // Filter
  const chainFilter = () => {
    const collection = suggestions
      ?.filter((result) => result.type === type || type === "all")
      .filter((result) => result.chain?.toString() === chainID || chainID === "all");
    handleSetState({ filteredCollection: collection });
  };

  const handleFilter = async ({ type: filterType, value }) => {
    if (filterType === "sort") {
      const result = sortBy({ collections: filteredCollection, value });
      handleSetState({ filteredCollection: result });
    } else if (filterType === "range") {
      const result = await rangeBy({ collections: filteredCollection, value });
      handleSetState({ filteredCollection: result });
    } else if (filterType === "cancel") {
      chainFilter();
    }
  };

  useEffect(() => {
    chainFilter();
  }, [type, chainID, suggestions]);

  // pagination
  const perPage = 12;
  const pageVisited = pageNumber * perPage;
  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <div className={classes.keyword}>{keyword}</div>
        <div className={classes.searchCount}>{filteredCollection ? filteredCollection.length : 0} results</div>
      </div>
      <div className={classes.header}>
        <div className={classes.tabs}>
          <div
            className={type === "all" ? classes.active : ""}
            onClick={() => handleSetState({ type: "all", pageNumber: 0 })}
          >
            All
          </div>
          <div
            className={type === "1of1" ? classes.active : ""}
            onClick={() => handleSetState({ type: "1of1", pageNumber: 0 })}
          >
            1 of 1s
          </div>
          <div
            className={type === "collections" ? classes.active : ""}
            onClick={() => handleSetState({ type: "collections", pageNumber: 0 })}
          >
            Collections
          </div>
          {/* <div
            className={type === "creators" ? classes.active : ""}
            onClick={() => handleSetState({ type: "creators", pageNumber: 0 })}
          >
            Creators
          </div> */}
        </div>
        <FilterDropdown handleFilter={handleFilter} />
        <ChainDropdown onChainFilter={onChainFilter} />
      </div>
      {filteredCollection?.length ? (
        <div className={classes.wrapper}>
          {filteredCollection.slice(pageVisited, pageVisited + perPage).map((result) => {
            return result.type === "collections" ? (
              <CollectionsCard key={result.Id} collection={result} />
            ) : (
              <NftCard key={result.Id} nft={result} listed />
            );
          })}
        </div>
      ) : !filteredCollection ? (
        <div className={classes.skeleton}>
          {[...new Array(5)].map((id) => (
            <div key={id}>
              <Skeleton count={1} height={200} />
              <br />
              <Skeleton count={1} height={30} />
              <br />
              <Skeleton count={1} height={30} />
            </div>
          ))}
        </div>
      ) : (
        <NotFound />
      )}
      {filteredCollection?.length > 0 && (
        <Pagination
          handleSetState={handleSetState}
          paginatePage={paginatePage}
          pageNumber={pageNumber}
          perPage={perPage}
          filteredCollection={filteredCollection}
        />
      )}
    </div>
  );
};

export default SearchResult;
