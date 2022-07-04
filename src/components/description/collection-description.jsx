import React, { useContext, useEffect, useRef } from "react";
import { setImageQuality, setLoading, setMintAmount, setNftLayers, setNotification } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import CollectionDetails from "../details/collection-details";
import classes from "./collection-description.module.css";
import CollectionPreview from "../preview/collection-preview";
import GenadropToolTip from "../Genadrop-Tooltip/GenadropTooltip";
import GenerateModal from "./Generate-Modal/GenerateModal";
import { useState } from "react";
import { handleAddSampleLayers } from "../../utils";
import CreateGuide from "../create-guide/create-guide";
import { Link } from "react-router-dom";
import { ReactComponent as PreviewIcon } from "../../assets/icon-preview.svg";

const CollectionDescription = () => {
  const { layers, nftLayers, mintAmount, dispatch, combinations, rule, isRule, collectionName, imageQuality } =
    useContext(GenContext);
  const canvasRef = useRef(null);
  const [state, setState] = useState({
    modal: false,
    inputValue: 0.5,
    toggleGuide: false,
  });
  const { modal, inputValue, toggleGuide } = state;

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

  const handleGenerateModal = () => {
    if (!combinations)
      return dispatch(
        setNotification({
          type: "warning",
          message: "Upload assets and try again.",
        })
      );
    dispatch(setNftLayers([]));
    handleSetState({ modal: true });
  };

  const handleSample = () => {
    handleAddSampleLayers({ dispatch });
  };

  const handleChange = (e) => {
    handleSetState({ inputValue: e.target.value });
    dispatch(setImageQuality(parseInt(e.target.value)));
  };

  const handleTutorial = () => {
    handleSetState({ toggleGuide: true });
  };

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (combinations) {
      dispatch(setMintAmount(combinations - rule.length ? parseInt(combinations - rule.length) : 0));
    }
  }, [combinations]);

  return (
    <div className={`${classes.container} ${(toggleGuide || modal) && classes.active}`}>
      <CreateGuide toggleGuide={toggleGuide} setGuide={(toggleGuide) => handleSetState({ toggleGuide })} />
      <GenerateModal
        modal={modal}
        combinations={combinations}
        closeModal={(modal) => handleSetState({ modal })}
        generateProps={generateProps}
        nftLayers={nftLayers}
      />
      <div className={classes.preview_details}>
        <div className={classes.guide_preview_wrapper}>
          <div className={classes.guide}>
            <div>Need help?</div>
            <div onClick={handleSample}>Try our samples</div>
            <div onClick={handleTutorial}>Watch tutorial</div>
          </div>
          <div className={classes.previewWrapper}>
            <CollectionPreview />
          </div>
        </div>
        <div className={classes.detailsWrapper}>
          <CollectionDetails />
        </div>
      </div>

      <div className={classes.combinations}>
        <div htmlFor="combinations" className={classes.title}>
          <span>Possible Combinations</span>
          {/* <GenadropToolTip content={"The maximum number of arts the uploaded assets can generate"} fill="#3d3d3d" /> */}
        </div>
        <div className={classes.count}>{combinations - rule.length}</div>
      </div>

      <div className={classes.generateContainer}>
        <div className={classes.title}>Generate:</div>
        <div className={classes.generateSettings}>
          <label htmlFor="">Choose image quality: </label>
          <div className={classes.wrapper}>
            <select value={inputValue} onChange={handleChange}>
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
          <div onClick={handleGenerateModal} className={`${classes.generateBtn}`}>
            Generate Collection
          </div>
        </div>
      </div>
      <canvas style={{ display: "none" }} ref={canvasRef} />
    </div>
  );
};

export default CollectionDescription;
