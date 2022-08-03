import { useContext, useEffect } from "react";
import { GenContext } from "../../gen-state/gen.context";
import {
  deleteAllTraits,
  deleteTrait,
  renameTrait,
  saveCollectionName,
  saveLayers,
  saveNftLayers,
  saveTraits,
} from "./StoreData.script";

const StoreData = () => {
  const {
    dispatch,
    layers,
    nftLayers,
    rule,
    collectionName,
    sessionId,
    currentUser,
    imageAction,
    layerAction,
    upgradePlan,
  } = useContext(GenContext);

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
    } else if (type === "order") {
      saveLayers({ currentUser, sessionId, layers: newLayers });
    }
  }, [layerAction, layers, currentUser, sessionId]);

  useEffect(() => {
    const nftTraits = [];
    const newNftLayers = nftLayers.map(({ image, id, attributes, ...otherLayerProps }) => {
      nftTraits.push({ image, id });
      return { image: "", id, attributes, ...otherLayerProps };
    });
    saveNftLayers({ currentUser, sessionId, nftLayers: newNftLayers, nftTraits });
  }, [nftLayers, currentUser, sessionId]);

  useEffect(() => {
    const { type, value } = imageAction;
    switch (type) {
      case "upload":
        saveTraits({ dispatch, currentUser, sessionId, ...value });
        break;
      case "rename":
        renameTrait({ dispatch, currentUser, sessionId, ...value });
        break;
      case "delete":
        deleteTrait({ dispatch, currentUser, sessionId, ...value });
        break;
      case "deleteAll":
        deleteAllTraits({ dispatch, currentUser, sessionId, id: value });
        break;
      default:
        break;
    }
  }, [imageAction, currentUser, sessionId]);

  useEffect(() => {
    if (currentUser && sessionId && upgradePlan) {
      const newLayers = layers.map(({ traits, ...otherLayerProps }) => {
        const newTraits = traits.map(({ image, ...otherTraitProps }) => {
          return { image: "", ...otherTraitProps };
        });
        return { traits: newTraits, ...otherLayerProps };
      });
      layers.forEach(({ id, traits }, i) => {
        traits.forEach(async (trait, j) => {
          await saveTraits({ dispatch, currentUser, sessionId, id, traits: [trait] });
        });
      });
      saveLayers({ currentUser, sessionId, layers: newLayers });
    }
  }, [currentUser, sessionId, upgradePlan]);

  return null;
};

export default StoreData;
