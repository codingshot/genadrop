import React, { useContext, useState } from "react";
import { setDidMout } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./createUseGuide.module.css";
import image0 from "../../assets/create-use-guide0.svg";
import image1 from "../../assets/create-use-guide1.svg";
import image2 from "../../assets/create-use-guide2.svg";
import image3 from "../../assets/create-use-guide3.svg";
import image4 from "../../assets/create-use-guide4.svg";
import image5 from "../../assets/create-use-guide5.svg";
import image6 from "../../assets/create-use-guide6.svg";
import image7 from "../../assets/create-use-guide7.svg";
import closeIcon from "../../assets/icon-close.svg";
import rightArrow from "../../assets/icon-arrow-right-long.svg";
import leftArrow from "../../assets/icon-arrow-left-long.svg";

const createGuideIntro = {
  title: "Welcome to Genadrop",
  "sub-title":
    "The easy and Robust No Code art generating tool that gives you quality and unique art. Let's work you through the process.",
  preview: image0,
};

const createUseGuide = {
  1: {
    title: "Add layers",
    "sub-title":
      "Click on the 'Add Layer' button to create layers for your art. Examples of layers can be the Eye layer, head layer, background layer, etc. Yep!",
    preview: image1,
  },
  2: {
    title: "Upload assets",
    "sub-title":
      " Use the upload button to add the images associated with the layer names you created in the previous step. For example, eyes uploaded to the eye layer, and heads uploaded to the head layer. Yes. Looks simple right?",
    preview: image2,
  },
  3: {
    title: "Re-order layers",
    "sub-title":
      "Re-order layers to suit your design/art. You can Re-order layers by simply dragging a layer to the top or bottom on the layers panel and seeing results on the preview panel.",
    preview: image3,
  },
  4: {
    title: "Rename layers and assets",
    "sub-title":
      "Click on the edit icon to rename your assets and layers. Also, you can change the asset rarities. Rarities determine how rare each asset will be in a collection.",
    more: "Note, Layers, asset names, and rarities are used to build the metadata for an asset/collection and cannot change after running the ‘generate’ command.",
    preview: image4,
  },
  5: {
    title: "Set conflict rule",
    "sub-title":
      "Setting conflict rules for images means that the selected set of images cannot form a generative art.",
    preview: image5,
  },
  6: {
    title: "Input number of arts to generate",
    "sub-title": "Input the number of arts you want to generate from the total combinations.",
    preview: image6,
  },
  7: {
    title: "Generate arts",
    "sub-title":
      "Click on the generate button to generate your arts. Also, go to the preview by clicking on the preview button, do other checks, and download your asset or collection for minting. Thank you!",
    preview: image7,
  },
};

const guideLength = Object.keys(createUseGuide).length;

const CreatePageUseGuide = ({ toggleGuide, setGuide }) => {
  const { dispatch } = useContext(GenContext);
  const [state, setState] = useState({
    pointer: 1,
    showGuide: false,
  });

  const { pointer, showGuide } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const handleCancel = () => {
    dispatch(setDidMout(true));
    setGuide(false);
    handleSetState({ pointer: 1 });
  };
  const handleNext = () => {
    if (pointer === guideLength) {
      return handleCancel();
    }
    handleSetState({ pointer: pointer + 1 });
  };

  const handlePrev = () => {
    if (pointer <= 1) return;
    handleSetState({ pointer: pointer - 1 });
  };

  const control = (
    <div className={classes.control}>
      <div className={classes.indicator}>
        {Array(guideLength)
          .fill(null)
          .map((_, idx) => (
            <span
              key={idx}
              onClick={() => handleSetState({ pointer: idx + 1 })}
              className={`${idx + 1 === pointer && classes.active}`}
            />
          ))}
      </div>
      {pointer > 1 && (
        <button type="button" onClick={handlePrev} className={`${classes.prev} ${pointer > 1 && classes.active}`}>
          <img src={leftArrow} alt="" />
          prev{" "}
        </button>
      )}

      {pointer < guideLength ? (
        <button
          type="button"
          onClick={handleNext}
          className={`${classes.next} ${pointer < guideLength && classes.active}`}
        >
          next <img src={rightArrow} alt="" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleCancel}
          className={`${classes.next} ${pointer < guideLength && classes.active}`}
        >
          close{" "}
        </button>
      )}
    </div>
  );

  const content = (
    <div className={classes.content}>
      <div className={classes.title}>{createUseGuide[pointer].title}</div>
      <div className={classes.subTitle}>{createUseGuide[pointer]["sub-title"]}</div>
      {createUseGuide[pointer].more && <div className={classes.more}>{createUseGuide[pointer].more}</div>}
      <img className={classes.preview} src={createUseGuide[pointer].preview} alt="" />
    </div>
  );

  const intro = (
    <div className={classes.content}>
      <div className={classes.title}>{createGuideIntro.title}</div>
      <div className={classes.subTitle}>{createGuideIntro["sub-title"]}</div>
      <img className={classes.preview} src={createGuideIntro.preview} alt="" />
    </div>
  );

  const introControl = (
    <div className={classes.introControl}>
      <button type="button" onClick={handleCancel}>
        cancel
      </button>
      <button type="button" onClick={() => handleSetState({ showGuide: true })}>
        Get started
      </button>
    </div>
  );

  return (
    <div className={`${classes.container} ${toggleGuide && classes.active}`}>
      <div className={classes.guideContainer}>
        {showGuide && (
          <div className={classes.closeIconContainer}>
            <img onClick={handleCancel} className={classes.close} src={closeIcon} alt="" />
          </div>
        )}
        {showGuide ? content : intro}
        {showGuide ? control : introControl}
      </div>
    </div>
  );
};

export default CreatePageUseGuide;
