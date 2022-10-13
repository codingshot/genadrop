import React, { useContext, useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./collections.module.css";
import { ReactComponent as SearchIcon } from "../../assets/icon-search.svg";
import CollectionNftCard from "../../components/Marketplace/CollectionNftCard/CollectionNftCard";
import { GenContext } from "../../gen-state/gen.context";
import PageControl from "../../components/Marketplace/Page-Control/PageControl";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import {
  rangeBy,
  sortBy,
  shuffle,
  getCollectionsByDate,
  getCollectionsByChain,
  getCollectionsBySearch,
} from "../Marketplace/Marketplace-script";
import NotFound from "../../components/not-found/notFound";
import FilterDropdown from "../../components/Marketplace/Filter-dropdown/FilterDropdown";
import Search from "../../components/Search/Search";
import {
  parseAlgoCollection,
  parseAuroraCollection,
  parseCeloCollection,
  parsePolygonCollection,
} from "../../renderless/fetch-data/fetchData-script";

const Collections = () => {
  const {
    auroraCollections,
    algoCollections,
    polygonCollections,
    celoCollections,
    mainnet,
    searchContainer,
  } = useContext(GenContext);
  const algoCollectionsArr = algoCollections ? Object.values(algoCollections) : [];

  const mountRef = useRef(0);
  const [state, setState] = useState({
    collections: [],
    filteredCollection: [],
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,
    activeDate: 0,
    searchValue: "",
    notFound: false,
    searchChain: "All Chains",
    searchContext: "",
  });

  const {
    collections,
    activeDate,
    searchValue,
    searchContext,
    paginate,
    currentPage,
    currentPageValue,
    filteredCollection,
    notFound,
    searchChain,
  } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  // Pagination
  const handlePrev = () => {
    if (currentPage <= 1) return;
    handleSetState({ currentPage: currentPage - 1 });
  };

  const handleNext = () => {
    if (currentPage >= Object.keys(paginate).length) return;
    handleSetState({ currentPage: currentPage + 1 });
  };

  const handleGoto = () => {
    if (currentPageValue < 1 || currentPageValue > Object.keys(paginate).length) return;
    handleSetState({ currentPage: Number(currentPageValue) });
    document.documentElement.scrollTop = 0;
  };

  // Date Filter
  const handleDateSort = (date) => {
    let result;

    const tempCollection = getCollectionsByChain({ collections, chain: searchChain, mainnet });

    if (date === activeDate) {
      result = getCollectionsByDate({ collections: tempCollection, date: 0 });
      console.log("1", result);
      handleSetState({ activeDate: 0, filteredCollection: result });
    } else {
      result = getCollectionsByDate({ collections: tempCollection, date });
      console.log("2", result);

      handleSetState({ activeDate: date, filteredCollection: result });
    }
  };

  // Chain Filter
  const handleChainChange = (chain) => {
    const tempCollection = getCollectionsByDate({ collections, date: activeDate });

    const result = getCollectionsByChain({ collections: tempCollection, chain, mainnet });
    handleSetState({ filteredCollection: result, searchChain: chain });
  };

  const handleFilter = async ({ type, value }) => {
    let filterCollection = [];
    if (activeDate) {
      filterCollection = filteredCollection;
    } else {
      filterCollection = collections;
    }
    if (type === "sort") {
      const result = sortBy({ collections: filterCollection, value });
      handleSetState({ filteredCollection: result });
    } else if (type === "range") {
      const result = await rangeBy({ collections: filterCollection, value });
      handleSetState({ filteredCollection: result });
    }
  };

  // Search
  const handleSearchChange = (e) => {
    const result = getCollectionsBySearch({ collections, search: e.target.value });
    handleSetState({ filteredCollection: result, searchValue: e.target.value });
  };

  useEffect(() => {
    let collections = [
      ...(auroraCollections || []),
      ...(algoCollectionsArr || []),
      ...(polygonCollections || []),
      ...(celoCollections || []),
    ];
    collections = shuffle(collections);
    handleSetState({ collections, filteredCollection: collections });
    handleSetState({
      searchContext: {
        "Algorand collection": parseAlgoCollection(algoCollectionsArr),
        "Aurora collection": parseAuroraCollection(auroraCollections),
        "Celo collection": parseCeloCollection(celoCollections),
        "Polygon collection": parsePolygonCollection(polygonCollections),
      },
    });
  }, [auroraCollections, algoCollections, polygonCollections, celoCollections]);

  useEffect(() => {
    const countPerPage = 20;
    const numberOfPages = Math.ceil(filteredCollection.length / countPerPage);
    let startIndex = 0;
    let endIndex = startIndex + countPerPage;
    const paginate = {};
    for (let i = 1; i <= numberOfPages; i += 1) {
      paginate[i] = filteredCollection.slice(startIndex, endIndex);
      startIndex = endIndex;
      endIndex = startIndex + countPerPage;
    }
    handleSetState({ paginate });
  }, [filteredCollection]);

  useEffect(() => {
    if (mountRef.current > 2) {
      handleSetState({ notFound: !Object.keys(paginate).length });
    }
    mountRef.current += 1;
  }, [paginate]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.title}>
          <h1>Collections</h1>
          <p>View all listed Collections ({`${collections && collections.length}) Listed`}</p>
        </div>
        <div className={classes.searchAndFilter}>
          <Search searchContext={searchContext} searchPlaceholder="Search By collections or Users" />

          {/* <div className={classes.search}>
            <input
              type="text"
              onChange={handleSearchChange}
              value={searchValue}
              placeholder="Search By collections ,1 of 1s or Users"
            />
          </div> */}
          <div className={classes.filter}>
            <div className={classes.chainDesktop}>
              <ChainDropdown onChainFilter={handleChainChange} data={collections} />
            </div>
            <FilterDropdown handleFilter={handleFilter} />
          </div>
        </div>
        <div className={classes.chainMobile}>
          <ChainDropdown onChainFilter={handleChainChange} />
        </div>
        <div className={classes.dateFilter}>
          <div onClick={() => handleDateSort(1)} className={`${classes.date} ${activeDate === 1 && classes.active}`}>
            24 Hours
          </div>
          <div onClick={() => handleDateSort(7)} className={`${classes.date} ${activeDate === 7 && classes.active}`}>
            7 Days
          </div>
          <div onClick={() => handleDateSort(30)} className={`${classes.date} ${activeDate === 30 && classes.active}`}>
            30 Days
          </div>
          <div onClick={() => handleDateSort(0)} className={`${classes.date} ${activeDate === 0 && classes.active}`}>
            All
          </div>
        </div>
      </div>
      <div className={classes.wrapper}>
        {Object.keys(paginate).length ? (
          <div className={classes.nfts}>
            {paginate[currentPage].map((collection, idx) => (
              <CollectionNftCard key={idx} collection={collection} />
            ))}
          </div>
        ) : !notFound ? (
          <div className={classes.nfts}>
            {[...new Array(8)]
              .map((_, idx) => idx)
              .map((id) => (
                <div className={classes.loader} key={id}>
                  <Skeleton count={1} height={200} />
                  <br />
                  <Skeleton count={1} height={40} />
                </div>
              ))}
          </div>
        ) : (
          <NotFound />
        )}
      </div>
      {Object.keys(paginate).length ? (
        <PageControl controProps={{ handleNext, handlePrev, handleGoto, ...state, handleSetState }} />
      ) : null}
    </div>
  );
};

export default Collections;
