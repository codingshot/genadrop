import React, { useRef, useContext, useEffect, useState } from "react";
import classes from "./collection-menu.module.css";
import ArtCard from "../art-card/art-card";
import { GenContext } from "../../gen-state/gen.context";
import { addImage, setCombinations } from "../../gen-state/gen.actions";
import ButtonClickEffect from "../button-effect/button-effect";
import { getCombinations, handleAddBlank, handleFileChange } from "./collection-menu-script";

const CollectionMenu = ({ layer }) => {
  const [state, setState] = useState({
    activeCard: "",
  });
  const { activeCard } = state;
  const { layerTitle, traits, id } = layer;
  const { dispatch, layers } = useContext(GenContext);
  const fileRef = useRef(null);
  const canvas = document.createElement("canvas");

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleBlank = async () => {
    const res = await handleAddBlank({
      layerId: id,
      traits,
      layerTitle,
      canvas,
      img: layers[0].traits[0].image,
    });
    dispatch(addImage(res));
  };

  useEffect(() => {
    dispatch(setCombinations(getCombinations(layers)));
  }, [layers, dispatch]);

  return (
    <div className={classes.container}>
      <section className={classes.layer}>
        <h3 className={classes.header}>{layerTitle}</h3>
        <div className={classes.wrapper}>
          {traits.map((trait, idx) => (
            <ArtCard
              key={idx}
              index={idx}
              layerTitle={layerTitle}
              trait={trait}
              layerId={id}
              setActiveCard={(activeArtCard) => handleSetState({ activeCard: activeArtCard })}
              activeCard={activeCard}
            />
          ))}
        </div>
        <div className={classes.uploadBtnContainer}>
          <button type="button" onClick={() => fileRef.current.click()} className={classes.uploadBtn}>
            upload
          </button>
          {traits[0] && (
            <ButtonClickEffect>
              <button type="button" onClick={handleBlank} className={classes.addBlankBtn}>
                Add blank image
              </button>
            </ButtonClickEffect>
          )}
        </div>
      </section>

      <input
        onChange={(event) => dispatch(addImage(handleFileChange({ layerId: id, event, traits, layerTitle })))}
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
