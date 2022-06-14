import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  setCurrentDnaLayers,
  setNotification,
  setLoader,
  setLoading,
  setMintAmount,
  setNftLayers,
} from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import Button from "../Button/Button";
import AssetDetails from "../Asset-Details/AssetDetails";
import classes from "./AssetDescription.module.css";
import ButtonEffects from "../Button-Effects/ButtonEffects";
import { createDna, createUniqueLayer, generateArt, parseLayers } from "./AssetDescription-Script";
import AssetPreview from "../Asset-Preview/AssetPreview";

const AssetDescription = () => {
  const { layers, nftLayers, mintAmount, dispatch, combinations, rule, isRule, collectionName } =
    useContext(GenContext);
  const canvasRef = useRef(null);

  const handleChange = (event) => {
    const { value } = event.target;
    dispatch(setMintAmount(value ? parseInt(value) : 0));
  };

  const handleGenerate = async () => {
    const getFirstLayerWithTrait = (layers) => {
      return layers.find((layer) => layer.traits.length);
    };

    if (isRule) {
      return dispatch(
        setNotification({
          message: "Finish adding conflict rule and try again",
          type: "warning",
        })
      );
    }
    if (!mintAmount) {
      return dispatch(
        setNotification({
          message: "Set the number to generate",
          type: "warning",
        })
      );
    }
    if (!combinations) {
      return dispatch(
        setNotification({
          message: "Upload images and try again",
          type: "warning",
        })
      );
    }
    if (mintAmount > combinations - rule.length) {
      return dispatch(
        setNotification({
          message: "Cannot generate more than the possible combinations",
          type: "warning",
        })
      );
    }
    dispatch(setNftLayers([]));
    dispatch(setLoading(true));
    const dnaLayers = createDna(layers);
    const uniqueLayers = await createUniqueLayer({
      dispatch,
      setNotification,
      setLoader,
      layers: dnaLayers,
      mintAmount,
      rule,
      collectionName,
    });

    const arts = await generateArt({
      dispatch,
      setLoader,
      layers: uniqueLayers,
      canvas: canvasRef.current,
      image: getFirstLayerWithTrait(layers).traits[0].image,
    });
    dispatch(setCurrentDnaLayers(dnaLayers));
    dispatch(setNftLayers(parseLayers({ uniqueLayers, arts })));
    dispatch(
      setNotification({
        message: "Done! Click on the preview button to view assets.",
        type: "success",
      })
    );
    dispatch(setLoading(false));
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
    <div className={classes.container}>
      <div className={classes.preview_details}>
        <div className={classes.previewWrapper}>
          <AssetPreview />
        </div>
        <div className={classes.detailsWrapper}>
          <AssetDetails />
        </div>
      </div>

      <div className={classes.input}>
        <div className={classes.action}>
          <label htmlFor="generate amout"># to Generate</label>
          <input onChange={handleChange} type="number" min="0" />
        </div>
        <div className={classes.action}>
          <div htmlFor="combinations">Combinations</div>
          <div className={classes.combinations}>{combinations - rule.length}</div>
        </div>
      </div>
      {nftLayers.length ? (
        <div className={classes.btnWrapper}>
          <Link to="/preview">
            <ButtonEffects>
              <Button invert>preview</Button>
            </ButtonEffects>
          </Link>
        </div>
      ) : null}

      <div className={classes.btnWrapper}>
        <div onClick={handleGenerate}>
          <ButtonEffects>
            <Button>Generate {mintAmount}</Button>
          </ButtonEffects>
        </div>
      </div>
      <canvas style={{ display: "none" }} ref={canvasRef} />
    </div>
  );
};

export default AssetDescription;
