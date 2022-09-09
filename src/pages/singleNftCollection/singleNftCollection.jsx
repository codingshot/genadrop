import classes from "./singleNftCollection.module.css";
import { ReactComponent as SearchIcon } from "../../assets/icon-search.svg";
import { useContext, useEffect, useState } from "react";
import NotFound from "../../components/not-found/notFound";
import { GenContext } from "../../gen-state/gen.context";
import SingleNftCard from "../../components/Marketplace/SingleNftCard/SingleNftCard";
import PageControl from "../../components/Marketplace/Page-Control/PageControl";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import {
  filterBy,
  getCollectionsByChain,
  getCollectionsBySearch,
  rangeBy,
  shuffle,
  sortBy,
} from "../Marketplace/Marketplace-script";
import { useRef } from "react";
import Skeleton from "react-loading-skeleton";
import FilterDropdown from "../../components/Marketplace/Filter-dropdown/FilterDropdown";

const SingleNftCollection = () => {
  const { singleAlgoNfts, singleAuroraNfts, singlePolygonNfts, singleCeloNfts, mainnet, account } =
    useContext(GenContext);
  const singleAlgoNftsArr = Object.values(singleAlgoNfts);

  const mountRef = useRef(null);
  const [state, setState] = useState({
    collections: [],
    filteredCollection: [],
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,
    searchValue: "",
    notFound: false,
  });

  const { collections, paginate, currentPage, currentPageValue, searchValue, filteredCollection, notFound } = state;

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

  const handleSearchChange = (e) => {
    let result = getCollectionsBySearch({ collections, search: e.target.value });
    handleSetState({ filteredCollection: result, searchValue: e.target.value });
  };

  const handleChainChange = (chain) => {
    let result = getCollectionsByChain({ collections, chain, mainnet });
    handleSetState({ filteredCollection: result });
  };

  const handleFilter = ({ type, value }) => {
    let filterCollection = [];
    if (activeDate) {
      filterCollection = filteredCollection;
    } else {
      filterCollection = collections;
    }

    if (type === "status") {
      let result = filterBy({ collections: filterCollection, value, account });
      handleSetState({ filteredCollection: result });
    } else if (type === "sort") {
      let result = sortBy({ collections: filterCollection, value });
      handleSetState({ filteredCollection: result });
    } else if (type === "range") {
      let result = rangeBy({ collections: filterCollection, value });
      handleSetState({ filteredCollection: result });
    }
  };

  useEffect(() => {
    let collections = [...singleAlgoNftsArr, ...singleAuroraNfts, ...singlePolygonNfts, ...singleCeloNfts];
    collections = shuffle(collections);
    handleSetState({ collections, filteredCollection: [...collections] });
  }, [singleAlgoNfts, singleAuroraNfts, singleCeloNfts, singlePolygonNfts]);

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
      <div className={classes.heading}>
        <div className={classes.title}>
          <h1>1 of 1s</h1>
          <p>View all listed 1 of 1s {`(${collections.length} Listed)`}</p>
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
          <FilterDropdown handleFilter={handleFilter} />
        </div>
      </div>
      <div className={classes.wrapper}>
        {Object.keys(paginate).length ? (
          <div className={classes.nfts}>
            {paginate[currentPage].map((nft, idx) => (
              <SingleNftCard key={idx} nft={nft} />
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

export default SingleNftCollection;
