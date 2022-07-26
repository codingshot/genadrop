import { useContext, useEffect } from "react";
import { GenContext } from "../../gen-state/gen.context";
import {
  deleteAllTraits,
  deleteTrait,
  renameTrait,
  saveCollectionName,
  saveLayers,
  saveTraits,
} from "./StoreData.script";

const StoreData = () => {
  const { layers, rule, collectionName, sessionId, currentUser, imageAction, layerAction, dispatch } =
    useContext(GenContext);

  useEffect(() => {
    saveCollectionName({ currentUser, sessionId, collectionName });
  }, [currentUser, sessionId, collectionName]);

  useEffect(() => {
    const { type } = layerAction;
    const newLayers = layers.map(({ traits, ...otherLayerProps }) => {
      const newTraits = traits.map(({ image, ...otherTraitProps }) => {
        return { image: "", ...otherTraitProps };
      });
      return { traits: newTraits, ...otherLayerProps };
    });

    if (type !== "order") {
      saveLayers({ currentUser, sessionId, layers: newLayers });
    } else if (type === "order" && false) {
      // saveLayers({ currentUser, sessionId, layers: newLayers });
    }
  }, [layerAction, layers, currentUser, sessionId]);

  useEffect(() => {
    const { type, value } = imageAction;
    switch (type) {
      case "upload":
        saveTraits({ currentUser, sessionId, ...value });
        break;
      case "rename":
        renameTrait({ currentUser, sessionId, ...value });
        break;
      case "delete":
        deleteTrait({ currentUser, sessionId, ...value });
        break;
      case "deleteAll":
        deleteAllTraits({ currentUser, sessionId, id: value });
        break;
      default:
        break;
    }
  }, [imageAction, currentUser, sessionId]);

  return null;
};

export default StoreData;
