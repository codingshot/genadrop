import React, { useEffect, useState } from "react";
import classes from "./collectionPreview.module.css";
import arrowIconLeft from "../../../assets/icon-arrow-left.svg";
import AttributeOverlay from "../attribute-overlay/attributeOverlay";

const CollectionPreview = ({ file, metadata, goBack }) => {
  const [state, setState] = useState({
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,
    fileToMetadataMap: {},
    showAttribute: false,
    attribute: {},
  });

  const { currentPage, paginate, currentPageValue, fileToMetadataMap, showAttribute, attribute } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
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

  const handleShowAttribute = (attributes) => {
    handleSetState({ showAttribute: true, attribute: attributes });
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

  useEffect(() => {
    const data = [...metadata];
    const obj = {};
    file.forEach((f) => {
      data.forEach((m, idx) => {
        if (f.name === m.image) {
          obj[f.name] = { ...m, file: f };
          data.splice(idx, 1);
        }
      });
    });
    handleSetState({ fileToMetadataMap: obj });
  }, []);

  return (
    <div className={classes.container}>
      {showAttribute && <AttributeOverlay attribute={attribute} handleSetState={handleSetState} />}
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

      <div className={classes.display}>
        {Object.keys(paginate).length
          ? paginate[currentPage].map((f, idx) => (
              <div key={idx} className={classes.assetWrapper}>
                <img src={URL.createObjectURL(f)} alt="" />

                <div className={classes.assetOverlay}>
                  {fileToMetadataMap[f.name].name}
                  <button
                    type="button"
                    onClick={() => handleShowAttribute(fileToMetadataMap[f.name])}
                    className={classes.attrBtn}
                  >
                    View Attributes
                  </button>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default CollectionPreview;
