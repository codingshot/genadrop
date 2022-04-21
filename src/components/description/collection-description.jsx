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
import Button from "../button/button";
import CollectionDetails from "../details/collection-details";
import classes from "./collection-description.module.css";
import ButtonClickEffect from "../button-effect/button-effect";
import { createDna, createUniqueLayer, generateArt, parseLayers } from "./collection-description-script";
import CollectionPreview from "../preview/collection-preview";

const CollectionDescription = () => {
  const { layers, nftLayers, mintAmount, dispatch, combinations, rule, isRule, collectionName } =
    useContext(GenContext);
  const canvasRef = useRef(null);

  const handleChange = (event) => {
    const { value } = event.target;
    dispatch(setMintAmount(value ? parseInt(value) : 0));
  };

  const handleGenerate = async () => {
    if (isRule) {
      return dispatch(setNotification("finish adding conflict rule and try again"));
    }
    if (!mintAmount) {
      return dispatch(setNotification("please set the number to generate"));
    }
    if (!combinations) {
      return dispatch(setNotification("Please uplaod images and try again"));
    }
    if (mintAmount > combinations - rule.length) {
      return dispatch(setNotification("cannot generate more than the possible combinations"));
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
      image: layers[0].traits[0].image,
    });
    dispatch(setCurrentDnaLayers(dnaLayers));
    dispatch(setNftLayers(parseLayers({ uniqueLayers, arts })));
    dispatch(setNotification("done! click on the preview button to view assets."));
    dispatch(setLoading(false));
  };

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  return (
    <div className={classes.container}>
      <div className={classes.preview_details}>
        <div className={classes.previewWrapper}>
          <CollectionPreview />
        </div>
        <div className={classes.detailsWrapper}>
          <CollectionDetails />
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

      <div className={classes.btnWrapper}>
        <div onClick={handleGenerate}>
          <ButtonClickEffect>
            <Button>generate {mintAmount}</Button>
          </ButtonClickEffect>
        </div>
      </div>

      <div className={classes.btnWrapper}>
        {nftLayers.length && (
          <Link to="/preview">
            <ButtonClickEffect>
              <Button invert>preview</Button>
            </ButtonClickEffect>
          </Link>
        )}
      </div>
      <canvas style={{ display: "none" }} ref={canvasRef} />
    </div>
  );
};

export default CollectionDescription;
