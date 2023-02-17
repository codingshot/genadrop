import React from "react";
import classes from "./StickType.module.css";
import typeCards from "./StickType-script";
import { ReactComponent as TypeIcon } from "../../assets/stick_type/type-icon.svg";
import moment from "moment";

const StickType = ({ handleSetState, attributes }) => {
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
              <div
                className={classes.typeCard}
                onClick={() =>
                  handleSetState({
                    stickType: `PROOF OF SESH: {${type.title}} ${moment().format("DD/MM/YYYY")}`,
                    attributes: {
                      ...attributes,
                      smoking_stick: { trait_type: "smoking stick", value: type.title },
                    },
                  })
                }
              >
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
