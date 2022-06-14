import React, { useState, useContext } from "react";
import AssetOverview from "../../components/Asset-Overview/AssetOverview";
import classes from "./Create.module.css";
import { GenContext } from "../../gen-state/gen.context";
import iconHelp from "../../assets/icon-help.svg";
import CreateDemo from "../../components/Create-Demo/CreateDemo";
import AssetDescription from "../../components/Asset-Description/AssetDescription";
import AssetLayerOrder from "../../components/Asset-Layer-Order/AssetLayerOrder";

const Create = () => {
  const { didMount } = useContext(GenContext);
  const [toggleGuide, setGuide] = useState(!didMount);

  return (
    <div className={classes.container}>
      <div onClick={() => setGuide(true)} className={`${classes.iconContainer} ${!toggleGuide && classes.active}`}>
        <img className={classes.icon} src={iconHelp} alt="" />
      </div>
      <CreateDemo toggleGuide={toggleGuide} setGuide={setGuide} />
      <div className={classes.layer_overview}>
        <AssetLayerOrder />
        <AssetOverview />
      </div>
      <AssetDescription />
    </div>
  );
};

export default Create;
