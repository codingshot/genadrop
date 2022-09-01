import classes from "./singleNftCollection.module.css";
import bannerImg from "../../assets/explore-banner2.svg";
import { ReactComponent as SearchIcon } from "../../assets/icon-search.svg";
import { useContext, useEffect, useState } from "react";
import { GenContext } from "../../gen-state/gen.context";
import SingleNftCard from "../../components/Marketplace/SingleNftCard/SingleNftCard";
import PageControl from "../../components/Marketplace/Page-Control/PageControl";
import { getSort } from "./singleNftCollection-script";
import Search from "../../components/Search/Search";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";

const SingleNftCollection = () => {
  const { singleAlgoNfts, singleAuroraNfts, singlePolygonNfts, singleCeloNfts } = useContext(GenContext);
  const singleAlgoNftsArr = Object.values(singleAlgoNfts);

  const [state, setState] = useState({
    collections: [],
    filteredCollection: [],
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,
    activeDate: 1,
    searchValue: "",
  });

  const { collections, paginate, currentPage, currentPageValue, activeDate, searchValue, filteredCollection } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const controlProps = {
    ...state,
    handleSetState,
  };

  const shuffle = (array) => {
    for (let i = 0; i < 100; i += 1) {
      for (let x = array.length - 1; x > 0; x -= 1) {
        const j = Math.floor(Math.random() * (x + 1));
        [array[x], array[j]] = [array[j], array[x]];
      }
    }
    return array;
  };

  const handleDateSort = (date) => {
    getSort({ collections, date });
    handleSetState({ activeDate: date });
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
    handleSetState({ searchValue: e.target.value });
  };

  const handleChainChange = (chain) => {
    console.log({ chain });
  };

  useEffect(() => {
    let collections = [...singleAlgoNftsArr, ...singleAuroraNfts, ...singlePolygonNfts, ...singleCeloNfts];
    collections = shuffle(collections);
    handleSetState({ collections, filteredCollection: collections });
  }, [singleAlgoNfts, singleAuroraNfts, singleCeloNfts, singlePolygonNfts]);

  useEffect(() => {
    const countPerPage = 20;
    const numberOfPages = Math.ceil(collections.length / countPerPage);
    let startIndex = 0;
    let endIndex = startIndex + countPerPage;
    const paginate = {};
    for (let i = 1; i <= numberOfPages; i += 1) {
      paginate[i] = collections.slice(startIndex, endIndex);
      startIndex = endIndex;
      endIndex = startIndex + countPerPage;
    }
    handleSetState({ paginate });
  }, [collections]);

  useEffect(() => {
    let value = searchValue.trim().toLocaleLowerCase();
    const filtered = collections.filter(
      (col) => col.name.toLowerCase().includes(value) || col.description.toLowerCase().includes(value)
    );
    handleSetState({ filteredCollection: filtered });
  }, [searchValue]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <div style={{ backgroundImage: `url(${bannerImg})` }} className={classes.heading}>
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
          <div className={classes.chain}>
            <ChainDropdown onChainFilter={handleChainChange} />
          </div>
          {/* <div className={classes.filter}>Filters</div> */}
        </div>
        {/* <div className={classes.dateFilter}>
          <div onClick={() => handleDateSort(1)} className={`${classes.date} ${activeDate === 1 && classes.active}`}>
            24 Hours
          </div>
          <div onClick={() => handleDateSort(7)} className={`${classes.date} ${activeDate === 7 && classes.active}`}>
            7 Days
          </div>
          <div onClick={() => handleDateSort(30)} className={`${classes.date} ${activeDate === 30 && classes.active}`}>
            30 Days
          </div>
        </div> */}
      </div>
      <div className={classes.wrapper}>
        <div className={classes.nfts}>
          {Object.keys(paginate).length
            ? paginate[currentPage].map((nft, idx) => <SingleNftCard key={idx} nft={nft} />)
            : null}
        </div>
      </div>
      {Object.keys(paginate).length && (
        <PageControl controProps={{ handleNext, handlePrev, handleGoto, ...controlProps }} />
      )}
    </div>
  );
};

export default SingleNftCollection;
