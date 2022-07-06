import { useEffect, useState, useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import AssetCard from "../Asset-Card/AssetCard";
import classes from "./Display.module.css";

const Display = () => {
  const { nftLayers } = useContext(GenContext);

  const [state, setState] = useState({
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,
  });

  const { currentPage, paginate, currentPageValue } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handlePrev = () => {
    if (currentPage <= 1) return;
    handleSetState({ currentPage: currentPage - 1 });
    document.documentElement.scrollTop = 0;
  };

  const handleNext = () => {
    if (currentPage >= Object.keys(paginate).length) return;
    handleSetState({ currentPage: currentPage + 1 });
    document.documentElement.scrollTop = 0;
  };

  const handleGoto = () => {
    if (currentPageValue < 1 || currentPageValue > Object.keys(paginate).length) return;
    handleSetState({ currentPage: Number(currentPageValue) });
    document.documentElement.scrollTop = 0;
  };

  useEffect(() => {
    const countPerPage = 20;
    const numberOfPages = Math.ceil(nftLayers.length / countPerPage);
    let startIndex = 0;
    let endIndex = startIndex + countPerPage;
    const paginateObj = {};
    for (let i = 1; i <= numberOfPages; i += 1) {
      paginateObj[i] = nftLayers.slice(startIndex, endIndex);
      startIndex = endIndex;
      endIndex = startIndex + countPerPage;
    }
    handleSetState({ paginate: paginateObj });
  }, [nftLayers]);

  return (
    <div className={classes.container}>
      <div className={classes.displayWrapper}>
        {Object.keys(paginate).length
          ? paginate[currentPage].map((asset, idx) => <AssetCard key={idx} cardProps={asset} />)
          : null}
      </div>
    </div>
  );
};

export default Display;
