import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import classes from "./searchResult.module.css";
import handleSuggestions from "../../components/Search/Search-script";
import { GenContext } from "../../gen-state/gen.context";
import { ReactComponent as AngleLeft } from "../../assets/icon-pagination-left.svg";
import { ReactComponent as AngleRight } from "../../assets/icon-pagination-right.svg";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import CollectionsCard from "../../components/Marketplace/collectionsCard/collectionsCard";
import NftCard from "../../components/Marketplace/NftCard/NftCard";
import NotFound from "../../components/not-found/notFound";
import supportedChains from "../../utils/supportedChains";

const SearchResult = () => {
  const [state, setState] = useState({
    value: "",
    suggestions: null,
    filteredCollection: null,
    type: "all",
    chainID: "all",
    pageNumber: 0,
  });
  const { value, suggestions, type, chainID, filteredCollection, pageNumber } = state;
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

  const perPage = 12;
  const pageVisited = pageNumber * perPage;

  const PageCount = (list = []) => {
    return list ? Math.ceil(list.length / perPage) : 1;
  };

  const changePage = ({ selected }) => {
    handleSetState({ pageNumber: selected });
  };

  useEffect(() => {
    const collection = suggestions
      ?.filter((result) => result.type === type || type === "all")
      .filter((result) => result.chain?.toString() === chainID || chainID === "all");
    handleSetState({ filteredCollection: collection });
  }, [type, chainID, suggestions]);
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
          <div
            className={type === "creators" ? classes.active : ""}
            onClick={() => handleSetState({ type: "creators", pageNumber: 0 })}
          >
            Creators
          </div>
        </div>
        {/* <FilterDropdown /> */}
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
      <div className={classes.footer}>
        <ReactPaginate
          previousLabel={<AngleLeft />}
          nextLabel={<AngleRight />}
          breakLabel="..."
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          pageCount={PageCount(filteredCollection)}
          onPageChange={changePage}
          forcePage={pageNumber}
          containerClassName={classes.pagination}
          previousLinkClassName={classes.pagePrev}
          nextLinkClassName={classes.pageNext}
          disabledClassName={classes.pageDisabled}
          activeClassName={classes.activePage}
          pageLinkClassName={classes.pageNumber}
        />
        <div className={classes.directPagination}>
          <p>Go to page</p>
          <input type="text" onChange={(e) => handleSetState({ value: e.target.value })} />
          <div
            onClick={() => {
              handleSetState({ pageNumber: value - 1 });
            }}
          >
            Go
            <AngleRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
