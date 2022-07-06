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

  useEffect(() => {
    if (!window.sessionStorage.isCreateModal) {
      setModal(true);
      window.sessionStorage.isCreateModal = true;
    }
  }, []);

  return (
    <div className={classes.container}>
      <CreateModal modal={modal} closeModal={closeModal} />
      <div className={classes.layer_overview}>
        <LayerOrders isCreateModal={modal} />
        <CollectionOverview />
      </div>
      <CollectionDescription />
    </div>
  );
};

export default Create;
