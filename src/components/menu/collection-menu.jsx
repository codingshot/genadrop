import React, { useRef, useContext, useEffect, useState } from "react";
import classes from "./collection-menu.module.css";
import ArtCard from "../art-card/art-card";
import { GenContext } from "../../gen-state/gen.context";
import { addImage, setCombinations } from "../../gen-state/gen.actions";
import ButtonClickEffect from "../button-effect/button-effect";
import { getCombinations, handleAddBlank, handleFileChange, handleAddTemplates } from "./collection-menu-script";

const CollectionMenu = ({ layer }) => {
  const [state, setState] = useState({
    activeCard: "",
  });
  const { activeCard } = state;
  const { layerTitle, traits, id } = layer;
  const { dispatch, layers } = useContext(GenContext);
  const fileRef = useRef(null);
  const [templateImages, setTemplateImages] = useState({
    pointr: 0,
    imgs: [
      "https://cdn.iconscout.com/icon/free/png-256/reddit-3771063-3147680.png",
      "https://cdn2.iconfinder.com/data/icons/elon-musk-1/128/Elon_musk_artificial_entrepreneur_face_intelligence_tesla-128.png",
    ],
  });

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleBlank = async () => {
    let canvas = document.createElement("canvas");
    const res = await handleAddBlank({
      layerId: id,
      traits,
      layerTitle,
      canvas,
      img: layers[0].traits[0].image,
    });
    dispatch(addImage(res));
  };

  const handleTemplates = async () => {
    // for (let img of templateImages){
    //   let newCanvas = document.createElement("canvas");
    //   const res = await handleAddTemplates({
    //     layerId: id,
    //     traits,
    //     layerTitle,
    //     canvas: newCanvas,
    //     img: img,
    //     imgName: img,
    //   });
    //   if (res) dispatch(addImage(res));
    // }

    let newCanvas = document.createElement("canvas");
    let indicator = templateImages.pointr;
    let templateImage = templateImages.imgs[indicator];
    newCanvas.id = templateImage;
    console.log("New Canvas: ", newCanvas);
    const res = await handleAddTemplates({
      layerId: id,
      traits,
      layerTitle,
      canvas: newCanvas,
      img: templateImage,
      imgName: templateImage,
    });
    console.log("response: ", res);
    if (res) {
      dispatch(addImage(res));
    }
    if (indicator < templateImages.imgs.length - 1) {
      indicator++;
    }
    setTemplateImages({
      pointr: indicator,
      imgs: templateImages.imgs,
    });
  };

  useEffect(() => {
    dispatch(setCombinations(getCombinations(layers)));
  }, [layers, dispatch]);

  return (
    <div className={classes.container}>
      <section className={classes.layer}>
        <h3 className={classes.header}>{layerTitle}</h3>
        {/* list of images */}
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
          <ButtonClickEffect>
            <button type="button" onClick={handleTemplates} className={classes.addBlankBtn}>
              Add Template Images
            </button>
          </ButtonClickEffect>
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
