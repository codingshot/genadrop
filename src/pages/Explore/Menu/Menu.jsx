/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import SingleNftCard from "../../../components/Marketplace/SingleNftCard/SingleNftCard";
import classes from "./Menu.module.css";

const Menu = ({ NFTCollection, toggleFilter, headerHeight }) => {
  const [state, setState] = useState({
    currentPage: 1,
    paginate: {},
  });

  const { currentPage, paginate } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handlePrev = () => {
    if (currentPage <= 1) return;
    handleSetState({ currentPage: currentPage - 1 });
    document.documentElement.scrollTop = headerHeight;
  };

  const handleNext = () => {
    if (currentPage >= Object.keys(paginate).length) return;
    handleSetState({ currentPage: currentPage + 1 });
    document.documentElement.scrollTop = headerHeight;
  };

  useEffect(() => {
    if (!NFTCollection) return;
    const countPerPage = 12;
    const numberOfPages = Math.ceil(NFTCollection.length / countPerPage);
    let startIndex = 0;
    let endIndex = startIndex + countPerPage;
    const paginate = {};
    for (let i = 1; i <= numberOfPages; i += 1) {
      paginate[i] = NFTCollection.slice(startIndex, endIndex);
      startIndex = endIndex;
      endIndex = startIndex + countPerPage;
    }
    handleSetState({ paginate });
  }, [NFTCollection]);

  return (
    <div className={classes.container}>
      <div className={`${classes.menu} ${toggleFilter && classes.resize}`}>
        {Object.keys(paginate).length
          ? paginate[currentPage].map((nft, idx) => (
              <SingleNftCard collectionNft={{ name: NFTCollection[0]?.collection_name }} key={idx} nft={nft} />
            ))
          : [...new Array(8)]
              .map((_, idx) => idx)
              .map((id) => (
                <div className={classes.loader} key={id}>
                  <Skeleton count={1} height={200} />
                  <br />
                  <Skeleton count={1} height={40} />
                </div>
              ))}
      </div>
      <div className={classes.control}>
        <div onClick={handlePrev} className={classes.pageControl}>
          prev
        </div>
        <div className={classes.pageCount}>
          {currentPage} of {Object.keys(paginate).length}
        </div>
        <div onClick={handleNext} className={classes.pageControl}>
          next
        </div>
      </div>
    </div>
  );
};

export default Menu;
