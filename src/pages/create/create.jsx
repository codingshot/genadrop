import LayerOrders from "../../components/layerorders/layerorders";
import CollectionDescription from "../../components/description/collection-description";
import CollectionOverview from "../../components/overview/collection-overview";
import classes from "./create.module.css";
import CreateModal from "./Create-Modal/CreateModal";
import { useEffect, useState } from "react";

const Create = () => {
  const [modal, setModal] = useState(false);
  const closeModal = () => {
    setModal(false);
  };

  const handleSample = () => {};

  const handleTutorial = () => {};

  useEffect(() => {
    setTimeout(() => {
      if (!window.localStorage.storedCollectionName) {
        setModal(true);
      }
    }, 0);
  }, []);

  return (
    <div className={classes.container}>
      <CreateModal modal={modal} closeModal={closeModal} />
      <div className={classes.details}>
        <div>Auto save...</div>
        <div className={classes.guide}>
          <div>Need help?</div>
          <div onClick={handleSample}>Try our samples</div>
          <div onClick={handleTutorial}>Watch tutorial</div>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.layer_overview}>
          <LayerOrders isCreateModal={modal} />
          <CollectionOverview />
        </div>
        <CollectionDescription />
      </div>
    </div>
  );
};

export default Create;
