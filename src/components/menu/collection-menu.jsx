/* eslint-disable react/no-array-index-key */
/* eslint-disable react/button-has-type */
import React, { useRef, useContext, useState } from "react";
import classes from "./collection-menu.module.css";
import ArtCard from "../art-card/art-card";
import { GenContext } from "../../gen-state/gen.context";
import { addImage } from "../../gen-state/gen.actions";
import { handleAddBlank, handleFileChange } from "./collection-menu-script";
import { ReactComponent as AddCircularIcon } from "../../assets/icon-add.svg";
import { ReactComponent as UploadIcon } from "../../assets/icon-upload.svg";
import { ReactComponent as AddIcon } from "../../assets/icon-plus.svg";

const CollectionMenu = ({ layer }) => {
  const [state, setState] = useState({
    activeCard: "",
  });
  const { activeCard } = state;
  const { layerTitle, traits, id } = layer;
  const { dispatch, layers, imageQuality } = useContext(GenContext);
  const fileRef = useRef(null);

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleBlank = async () => {
    const canvas = document.createElement("canvas");
    const res = await handleAddBlank({
      layerId: id,
      traits,
      layerTitle,
      canvas,
      img: layers[0].traits[0].image,
      imageQuality,
    });
    dispatch(addImage(res));
  };

  return (
    <div className={classes.container}>
      <section className={classes.layer}>
        <div className={classes.heading}>
          <h3 className={classes.title}>{layerTitle}</h3>
          {traits.length ? (
            <div className={classes.btnContainer}>
              <button onClick={() => fileRef.current.click()} className={classes.upload}>
                <UploadIcon className={classes.uploadIcon} /> Upload
              </button>
              <button type="button" onClick={handleBlank} className={classes.addBlank}>
                <AddIcon className={classes.addIcon} /> Add blank
              </button>
            </div>
          ) : null}
        </div>
        {/* list of images */}
        <div className={classes.wrapper}>
          {traits.length ? (
            traits.map((trait, idx) => (
              <ArtCard
                key={idx}
                index={idx}
                layerTitle={layerTitle}
                trait={trait}
                layerId={id}
                setActiveCard={(activeArtCard) => handleSetState({ activeCard: activeArtCard })}
                activeCard={activeCard}
              />
            ))
          ) : (
            <div onClick={() => fileRef.current.click()} className={classes.uploadCard}>
              <AddCircularIcon />
              <div className={classes.uploadTitle}>Upload images</div>
              <div className={classes.uploadText}>(Image/png, max file size: 2MB per image)</div>
              <button className={classes.uploadBtn}>
                <UploadIcon className={classes.uploadIcon} /> Browse Files
              </button>
            </div>
          )}
        </div>
      </section>

      <input
        onChange={(event) => dispatch(addImage(handleFileChange({ layerId: id, event, traits, layerTitle, dispatch })))}
        ref={fileRef}
        style={{ display: "none" }}
        type="file"
        name="avatar"
        id="avatar"
        accept="image/png"
        multiple
      />
    </div>
  );
};

export default CollectionMenu;
