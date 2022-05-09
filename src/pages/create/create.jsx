import React, { useState, useContext } from "react";
import LayerOrders from "../../components/layerorders/layerorders";
import CollectionDescription from "../../components/description/collection-description";
import CollectionOverview from "../../components/overview/collection-overview";
import classes from "./create.module.css";
import { GenContext } from "../../gen-state/gen.context";
import iconHelp from "../../assets/icon-help.svg";
import CreateGuide from "../../components/create-guide/create-guide";

const Create = () => {
  const { didMount } = useContext(GenContext);
  const [toggleGuide, setGuide] = useState(!didMount);

  return (
    <div className={classes.container}>
      <div onClick={() => setGuide(true)} className={`${classes.iconContainer} ${!toggleGuide && classes.active}`}>
        <img className={classes.icon} src={iconHelp} alt="" />
      </div>
      <CreateGuide toggleGuide={toggleGuide} setGuide={setGuide} />
      <div className={classes.layer_overview}>
        <LayerOrders />
        <CollectionOverview />
      </div>
      <CollectionDescription />
    </div>
  );
};

export default Create;
