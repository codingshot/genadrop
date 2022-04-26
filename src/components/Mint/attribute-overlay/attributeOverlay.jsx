import { useEffect } from "react";
import classes from "./attributeOverlay.module.css";
import closeIcon from "../../../assets/icon-close.svg";

const AttributeOverlay = ({ attribute, handleSetState }) => {
  const { file, name, description, attributes } = attribute;

  useEffect(() => {
    console.log(attribute);
  }, [attribute]);

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.closeBtn}>
          <img onClick={() => handleSetState({ showAttribute: false })} src={closeIcon} alt="" />
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
                  <div>{trait_type}</div>
                  <div>{value}</div>
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
