/* eslint-disable react/no-unescaped-entities */
import React from "react";
import classes from "./attributeOverlay.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";

const AttributeOverlay = ({ attribute, handleSetState }) => {
  const { file, name, description, attributes } = attribute;

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.closeBtn}>
          <CloseIcon className={classes.closeIcon} onClick={() => handleSetState({ showAttribute: false })} />
        </div>

        <div>
          <div className={classes.imageAndDescription}>
            <img className={classes.image} src={URL.createObjectURL(file)} alt="" />
            <div className={classes.nameAndDescription}>
              <div className={classes.name}>{name}</div>
              <div className={classes.description}>{description}</div>
            </div>
          </div>
          <div className={classes.attributeSection}>
            <div className={classes.attributeHeading}>Attributes</div>
            <div className={classes.attributeMenu}>
              {attributes.map(({ rarity, trait_type, value }) => (
                <div className={classes.attribute}>
                  <div className={classes.traitTitle}>{trait_type}</div>
                  <div>
                    Trait: <span className={classes.traitValue}>"{value}"</span>
                  </div>
                  <div>{rarity}% have this trait</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeOverlay;
