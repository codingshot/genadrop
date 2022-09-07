import classes from "./collections.module.css";
import bannerImg from "../../assets/explore-banner2.svg";
import { ReactComponent as SearchIcon } from "../../assets/icon-search.svg";
import CollectionNftCard from "../../components/Marketplace/CollectionNftCard/CollectionNftCard";
import { useContext, useEffect, useState } from "react";
import { GenContext } from "../../gen-state/gen.context";
import PageControl from "../../components/Marketplace/Page-Control/PageControl";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import FilterDropdown from "../../components/Marketplace/Filter-Dropdown/FilterDropdown";
import {
  rangeBy,
  sortBy,
  shuffle,
  getCollectionsByDate,
  getCollectionsByChain,
  getCollectionsBySearch,
} from "../Marketplace/Marketplace-script";
import NotFound from "../../components/not-found/notFound";
import { useRef } from "react";
import Skeleton from "react-loading-skeleton";

const Collections = () => {
  const { auroraCollections, algoCollections, polygonCollections, celoCollections, mainnet } = useContext(GenContext);
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
  });

  const {
    collections,
    activeDate,
    searchValue,
    paginate,
    currentPage,
    currentPageValue,
    filteredCollection,
    notFound,
  } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

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

  const handleDateSort = (date) => {
    let result;
    if (date === activeDate) {
      result = getCollectionsByDate({ collections, date: 0 });
      handleSetState({ activeDate: 0, filteredCollection: result });
    } else {
      result = getCollectionsByDate({ collections, date });
      handleSetState({ activeDate: date, filteredCollection: result });
    }
  };

  const handleChainChange = (chain) => {
    let result = getCollectionsByChain({ collections, chain, mainnet });
    handleSetState({ filteredCollection: result });
  };

  const handleFilter = ({ type, value }) => {
    if (type === "sort") {
      let result = sortBy({ collections, value });
      handleSetState({ filteredCollection: result });
    } else if (type === "range") {
      let result = rangeBy({ collections, value });
      handleSetState({ filteredCollection: result });
    }
  };

  const handleSearchChange = (e) => {
    let result = getCollectionsBySearch({ collections, search: e.target.value });
    handleSetState({ filteredCollection: result, searchValue: e.target.value });
  };

  useEffect(() => {
    let collections = [...auroraCollections, ...algoCollectionsArr, ...polygonCollections, ...celoCollections];
    collections = shuffle(collections);
    handleSetState({ collections, filteredCollection: collections });
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
      handleSetState({ notFound: Object.keys(paginate).length ? false : true });
    }
    mountRef.current += 1;
  }, [paginate]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <div style={{ backgroundImage: `url(${bannerImg})` }} className={classes.heading}>
        <div className={classes.title}>
          <h1>Collections</h1>
          <p>View all listed Collections {`${collections && collections.length} Listed`}</p>
        </div>
        <div className={classes.searchAndFilter}>
          <div className={classes.search}>
            <SearchIcon />
            <input
              type="text"
              onChange={handleSearchChange}
              value={searchValue}
              placeholder="Search By collections ,1 of 1s or Users"
            />
          </div>
          <ChainDropdown onChainFilter={handleChainChange} />
          <FilterDropdown handleFilter={handleFilter} collection />
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
