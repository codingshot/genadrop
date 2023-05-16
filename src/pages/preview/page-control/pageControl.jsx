import React from "react";
import classes from "../preview.module.css";

const PageControl = ({ controProps }) => {
  const { handleGoto, handleNext, handlePrev, currentPage, currentPageValue, paginate, handleSetState } = controProps;
  return (
    <div className={classes.paginate}>
      <div onClick={handlePrev} className={classes.pageControl}>
        prev
      </div>
      <div className={classes.pageCount}>
        {currentPage} of {Object.keys(paginate).length}
      </div>
      <div onClick={handleNext} className={classes.pageControl}>
        next
      </div>
      <div onClick={handleGoto} className={classes.pageControl}>
        goto
      </div>
      <input
        min={1}
        type="number"
        value={currentPageValue}
        onChange={(e) => handleSetState({ currentPageValue: e.target.value >= 1 ? e.target.value : "" })}
      />
    </div>
  );
};

export default PageControl;
