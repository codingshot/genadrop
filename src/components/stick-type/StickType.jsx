import React from "react";
import moment from "moment";
import typeCards from "./StickType-script";
import { ReactComponent as TypeIcon } from "../../assets/stick_type/type-icon.svg";
import { setZip } from "../../gen-state/gen.actions";
import { capitalizeFirstLetter, getFileFromBase64 } from "../mint-webcam/Capture/Capture-script";
import classes from "./StickType.module.css";

const StickType = ({ seshProps }) => {
  const { img, attributes, onlyCamera, dispatch, pathname, history } = seshProps;

  const handleMintStick = (type) => {
    let mintType;
    const imgResult = getFileFromBase64(img, "Image", "image/png");
    if (onlyCamera) {
      mintType = capitalizeFirstLetter(pathname);
    }

    dispatch(
      setZip({
        name: `PROOF OF SESH: {${type.title}} ${moment().format("MM/DD/YYYY")}`,
        file: imgResult,
        type: mintType,
        attributes: {
          ...attributes,
          smoking_stick: { trait_type: "smoking stick", value: type.title },
        },
      })
    );
    history.push("/mint/1of1");
  };

  return (
    <div className={`${classes.container} `}>
      <div className={classes.popupWrapper}>
        <div className={classes.card}>
          <div className={classes.heading}>
            <h3>A Smoking Stick was detected</h3>
            <p>Pick the stick that you just scanned</p>
          </div>

          <div className={classes.wrapper}>
            {typeCards.map((type) => (
              <div className={classes.typeCard} onClick={() => handleMintStick(type)}>
                <div className={classes.icon}>{type.icon}</div>
                <div className={classes.content}>
                  <div className={classes.typeIcon}>
                    <TypeIcon />
                  </div>
                  <div className={classes.text}>
                    <div className={classes.title}>{type.title}</div>
                    <div className={classes.cardDesc}>{type.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default StickType;
// handleSetState({
//   stickType: `PROOF OF SESH: {${type.title}} ${moment().format("MM/DD/YYYY")}`,
//   attributes: {
//     ...attributes,
//     smoking_stick: { trait_type: "smoking stick", value: type.title },
//   },
// });
