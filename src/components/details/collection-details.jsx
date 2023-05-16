/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect, useState } from "react";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./collection-details.module.css";

const CollectionDetails = () => {
  const { preview, layers } = useContext(GenContext);
  const [description, setDescription] = useState([]);

  useEffect(() => {
    const result = [];
    layers.forEach(({ layerTitle: name, traits }) => {
      traits.forEach(({ traitTitle, Rarity }) => {
        preview.forEach(({ layerTitle, imageName }) => {
          if (name === layerTitle && traitTitle === imageName) {
            result.push({ layerTitle: name, traitTitle, Rarity });
          }
        });
      });
    });

    setDescription(result);
  }, [preview, layers]);

  return (
    <div className={classes.container}>
      <h4>Attributes</h4>

      <div className={classes.content}>
        {description.map(({ layerTitle, traitTitle, Rarity }, index) => (
          <p key={index}>
            <span>{`[${layerTitle}]`}</span>
            <span>{traitTitle}</span>
            <span>Rarity {Rarity}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default CollectionDetails;
