import classes from "./collectionPreview.module.css";
import arrowIconLeft from "../../../assets/icon-arrow-left.svg";
import { useEffect, useState } from "react";

const CollectionPreview = ({ file, goBack }) => {
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
    const numberOfPages = Math.ceil(file.length / countPerPage);
    let startIndex = 0;
    let endIndex = startIndex + countPerPage;
    const paginateObj = {};
    for (let i = 1; i <= numberOfPages; i += 1) {
      paginateObj[i] = file.slice(startIndex, endIndex);
      startIndex = endIndex;
      endIndex = startIndex + countPerPage;
    }
    handleSetState({ paginate: paginateObj });
  }, [file]);

  return (
    <div className={classes.container}>
      <div className={classes.topNav}>
        <div onClick={() => goBack({ preview: false })} className={classes.backBtn}>
          <img src={arrowIconLeft} alt="" />
          Back
        </div>

        <div className={classes.paginate}>
          <div onClick={handlePrev} className={`${classes.pageControl} ${classes.prev}`}>
            prev
          </div>
          <div className={classes.pageCount}>
            {currentPage} of {Object.keys(paginate).length}
          </div>
          <div onClick={handleNext} className={`${classes.pageControl} ${classes.next}`}>
            next
          </div>
          <div className={classes.gotoWrapper}>
            <div onClick={handleGoto} className={`${classes.pageControl} ${classes.goto}`}>
              goto
            </div>
            <input
              type="number"
              value={currentPageValue}
              onChange={(event) => handleSetState({ currentPageValue: event.target.value })}
            />
          </div>
        </div>
      </div>

      {Object.keys(paginate).length
        ? paginate[currentPage].map((f, idx) => (
            <div key={idx} className={classes.assetWrapper}>
              <img src={URL.createObjectURL(f)} alt="" />
            </div>
          ))
        : null}
    </div>
  );
};

export default CollectionPreview;
