import React, { useEffect, useState } from "react";
import classes from "./CollectionPreviewSelect.module.css";
import AttributeOverlay from "../attribute-overlay/attributeOverlay";
import { updateZip } from "../collection-single/collection-single-script";
import { ReactComponent as ArrowIconLeft } from "../../../assets/icon-arrow-left.svg";
import angleLeft from "../../../assets/icon-angle-left.svg";
import angleRight from "../../../assets/icon-angle-right.svg";

const CollectionPreviewSelect = ({
  file,
  metadata,
  handleMintSetState,
  zip,
  handleSetFileState,
  collectionProfile,
}) => {
  const [state, setState] = useState({
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,
    fileToMetadataMap: {},
    showAttribute: false,
    attribute: {},
  });

  const { currentPage, paginate, currentPageValue, showAttribute, attribute } = state;

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
  const saveHandler = async () => {
    await updateZip(zip, collectionProfile.name, handleSetFileState);
    handleMintSetState({ preview: false, previewSelectMode: false, toggleGuide: false });
  };

  const getPagination = () => {
    const arr = [];
    const countPerPage = 20;
    const len = Math.ceil(file.length / countPerPage);
    if (currentPage - 4 > 0) {
      arr.push(1);
      arr.push("....");
      arr.push(currentPage - 2);
      arr.push(currentPage - 1);
      arr.push(currentPage);
    } else if (currentPage - 3 > 0) {
      arr.push(1);
      arr.push(currentPage - 2);
      arr.push(currentPage - 1);
      arr.push(currentPage);
    } else if (currentPage - 2 > 0) {
      arr.push(currentPage - 2);
      arr.push(currentPage - 1);
      arr.push(currentPage);
    } else if (currentPage - 1 > 0) {
      arr.push(currentPage - 1);
      arr.push(currentPage);
    } else {
      arr.push(currentPage);
    }
    if (len - (currentPage + 3) > 0) {
      arr.push(currentPage + 1);
      arr.push(currentPage + 2);
      arr.push("....");
      arr.push(len);
    } else if (len - (currentPage + 2) > 0) {
      arr.push(currentPage + 1);
      arr.push(currentPage + 2);
      arr.push(len);
    } else if (len - (currentPage + 1) > 0) {
      arr.push(currentPage + 1);
      arr.push(len);
    } else if (len - currentPage > 0) {
      arr.push(len);
    }
    return arr;
  };

  return (
    <div className={classes.container}>
      {showAttribute && <AttributeOverlay attribute={attribute} handleSetState={handleSetState} />}
      <div className={classes.topNav}>
        <div
          onClick={() => handleMintSetState({ preview: false, previewSelectMode: false })}
          className={classes.backBtn}
        >
          <ArrowIconLeft />
          Select an image
        </div>
        <div className={classes.display}>
          {Object.keys(paginate).length
            ? paginate[currentPage].map((f, idx) => (
                <div
                  key={idx}
                  className={`${classes.assetWrapper} ${
                    collectionProfile.name === f.name && classes.assetWrapperActive
                  }`}
                >
                  <img
                    onClick={() => handleMintSetState({ collectionProfile: f })}
                    src={URL.createObjectURL(f)}
                    alt=""
                  />
                </div>
              ))
            : null}
        </div>
        <div className={classes.paginate}>
          <div onClick={handlePrev} className={`${classes.pageControl} ${classes.prev}`}>
            <img src={angleLeft} alt="" />
          </div>
          <div className={classes.pageCount}>
            {getPagination().map((num) => (
              <p
                className={`${currentPage === num && classes.activePage} ${num === "...." && classes.fillerPage}`}
                onClick={() => (num !== "...." ? handleSetState({ currentPage: num }) : "")}
                key={num}
              >
                {num}
              </p>
            ))}
          </div>
          <div onClick={handleNext} className={`${classes.pageControl} ${classes.next}`}>
            <img src={angleRight} alt="" />
          </div>
          <div className={classes.gotoWrapper}>
            <input
              type="number"
              value={currentPageValue}
              onChange={(event) => handleSetState({ currentPageValue: event.target.value })}
            />
            <div onClick={handleGoto} className={`${classes.pageControl} ${classes.goto}`}>
              Go
              <img src={angleRight} alt="" />
            </div>
          </div>
        </div>
        <div className={classes.buttonWrapper}>
          <p onClick={() => handleMintSetState({ preview: false, previewSelectMode: false })}>Cancel</p>
          <div onClick={saveHandler}>Save</div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPreviewSelect;
