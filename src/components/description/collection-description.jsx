import React, { useContext, useEffect, useRef } from "react";
import { setImageQuality, setOverlay, setMintAmount, setNftLayers, setNotification } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import CollectionDetails from "../details/collection-details";
import classes from "./collection-description.module.css";
import CollectionPreview from "../preview/collection-preview";
import GenadropToolTip from "../Genadrop-Tooltip/GenadropTooltip";
import { useState } from "react";
import { handleAddSampleLayers } from "../../utils";
import CreateGuide from "../create-guide/create-guide";
import { Link } from "react-router-dom";
import { ReactComponent as PreviewIcon } from "../../assets/icon-preview.svg";
import { handleGenerate } from "./collection-description-script";

const CollectionDescription = () => {
  const { layers, nftLayers, mintAmount, dispatch, combinations, rule, isRule, collectionName, imageQuality } =
    useContext(GenContext);
  const canvasRef = useRef(null);
  const [state, setState] = useState({
    selectInputValue: 0.5,
    amountInputValue: "",
    toggleGuide: false,
  });
  const { selectInputValue, amountInputValue, toggleGuide } = state;

  const generateProps = {
    isRule,
    rule,
    mintAmount,
    combinations,
    layers,
    collectionName,
    dispatch,
    canvasRef,
    imageQuality,
  };

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleSample = () => {
    handleAddSampleLayers({ dispatch });
  };

  const handleSelectChange = (e) => {
    handleSetState({ selectInputValue: e.target.value });
    dispatch(setImageQuality(parseInt(e.target.value)));
  };

  const handleAmountChange = (e) => {
    handleSetState({ amountInputValue: e.target.value });
  };

  const handleGenerateClick = () => {
    if (!combinations)
      return dispatch(
        setNotification({
          type: "warning",
          message: "Upload assets and try again.",
        })
      );
    if (amountInputValue <= "0")
      return dispatch(
        setNotification({
          message: "Add valid amount to generate input",
          type: "error",
        })
      );
    if (amountInputValue > combinations)
      return dispatch(
        setNotification({
          message: "Number of arts cannot be greater than the possible combinations",
          type: "error",
        })
      );
    dispatch(setNftLayers([]));
    dispatch(setMintAmount(parseInt(amountInputValue)));
    handleGenerate({ ...generateProps, mintAmount: parseInt(amountInputValue) });
  };

  const handleTutorial = () => {
    handleSetState({ toggleGuide: true });
  };

  useEffect(() => {
    dispatch(setOverlay(false));
  }, [dispatch]);

  useEffect(() => {
    if (combinations) {
      dispatch(setMintAmount(combinations - rule.length ? parseInt(combinations - rule.length) : 0));
    }
  }, [combinations]);

  return (
    <div className={`${classes.container} ${toggleGuide && classes.active}`}>
      <CreateGuide toggleGuide={toggleGuide} setGuide={(toggleGuide) => handleSetState({ toggleGuide })} />
      <div className={classes.preview_details}>
        <div className={classes.previewWrapper}>
          <CollectionPreview />
        </div>
        <div className={classes.detailsWrapper}>
          <CollectionDetails />
        </div>
      </div>

      <div className={classes.sectionHeading}>Generate</div>
      <div className={classes.combinations_amount}>
        <div className={classes.combinations}>
          <div className={classes.title}>
            <span>Possible Combinations</span>
            {/* <GenadropToolTip content={"The maximum number of arts the uploaded assets can generate"} fill="#3d3d3d" /> */}
          </div>
          <div className={classes.count}>{combinations - rule.length}</div>
        </div>

        <div className={classes.amount}>
          <div htmlFor="amount to generate" className={classes.title}>
            <span>Amount to Generate</span>
          </div>
          <input
            className={classes.amountInput}
            type="number"
            min="0"
            max={combinations}
            value={amountInputValue}
            onChange={handleAmountChange}
            placeholder="Eg: 1000"
          />
        </div>
      </div>

      <div className={classes.generateContainer}>
        <div className={classes.generateSettings}>
          <label htmlFor="">Choose image quality: </label>
          <div className={classes.wrapper}>
            <select value={selectInputValue} onChange={handleSelectChange}>
              <option value={1}>High</option>
              <option value={0.5}>Medium</option>
              <option value={0.2}>Low</option>
            </select>
            <span className={classes.format}>PNG</span>
          </div>
        </div>
        <div className={classes.btnContainer}>
          {nftLayers.length ? (
            <div className={classes.previewBtn}>
              <Link to={"/preview"}>
                <PreviewIcon className={classes.previewIcon} />
              </Link>
            </div>
          ) : null}
          <div onClick={handleGenerateClick} className={`${classes.generateBtn} ${combinations && classes.active}`}>
            Generate Collection
          </div>
        </div>
      </div>
      <canvas style={{ display: "none" }} ref={canvasRef} />
    </div>
  );
};

export default CollectionDescription;
