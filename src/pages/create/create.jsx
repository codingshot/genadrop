import LayerOrders from "../../components/layerorders/layerorders";
import CollectionDescription from "../../components/description/collection-description";
import CollectionOverview from "../../components/overview/collection-overview";
import classes from "./create.module.css";
import { useEffect, useState } from "react";
import CollectionNameModal from "../../components/Collection-Name-Modal/CollectionNameModal";
import { handleAddSampleLayers } from "../../utils";
import { useContext } from "react";
import { GenContext } from "../../gen-state/gen.context";
import CreateGuide from "../../components/create-guide/create-guide";

const Create = () => {
  const { dispatch } = useContext(GenContext);
  const [toggleGuide, setGuide] = useState(false);

  const handleSample = () => {
    handleAddSampleLayers({ dispatch });
  };

  const handleTutorial = () => {
    setGuide(true);
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <CollectionNameModal />
      <CreateGuide toggleGuide={toggleGuide} setGuide={setGuide} />
      <div className={classes.details}>
        <div className={classes.autoSave}>
          <div></div>
        </div>
        <div className={classes.guide}>
          <div>Need help?</div>
          <div onClick={handleSample}>Try our samples</div>
          <div onClick={handleTutorial}>Watch tutorial</div>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.layer_overview}>
          <LayerOrders />
          <CollectionOverview />
        </div>
        <CollectionDescription />
      </div>
    </div>
  );
};

export default Create;
