import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { GenContext } from "../../gen-state/gen.context";
import {
  constructLayers,
  deleteAllTraits,
  deleteTrait,
  fetchCollectionName,
  fetchLayers,
  fetchTraits,
  renameTrait,
  saveCollectionName,
  saveLayers,
  saveTraits,
} from "./StoreData.script";

const StoreData = () => {
  const { layers, rule, collectionName, sessionId, user, imageAction, layerAction, dispatch } = useContext(GenContext);

  const mountRef = useRef(false);

  useEffect(() => {
    saveCollectionName({ user, sessionId, collectionName });
  }, [user, sessionId, collectionName]);

  useEffect(() => {
    if (!mountRef.current) return;
    const { type } = layerAction;
    const newLayers = layers.map(({ traits, ...otherLayerProps }) => {
      const newTraits = traits.map(({ image, ...otherTraitProps }) => {
        return { image: "", ...otherTraitProps };
      });
      return { traits: newTraits, ...otherLayerProps };
    });

    if (type !== "order") {
      saveLayers({ user, sessionId, layers: newLayers });
    } else if (type === "order" && false) {
      // saveLayers({ user, sessionId, layers: newLayers });
    }
  }, [layerAction, layers, user, sessionId]);

  useEffect(() => {
    if (!mountRef.current) return;
    const { type, value } = imageAction;
    switch (type) {
      case "upload":
        saveTraits({ user, sessionId, ...value });
        break;
      case "rename":
        renameTrait({ user, sessionId, ...value });
        break;
      case "delete":
        deleteTrait({ user, sessionId, ...value });
        break;
      case "deleteAll":
        deleteAllTraits({ user, sessionId, id: value });
        break;
      default:
        break;
    }
  }, [imageAction, user, sessionId]);

  const runFetch = async () => {
    console.log("fetching starts...");

    try {
      const result = await Promise.all([
        fetchCollectionName({ user, sessionId }),
        fetchLayers({ user, sessionId }),
        fetchTraits({ user, sessionId }),
      ]);
      const [storedCollectionName, storedLayers, storedTraits] = result;
      constructLayers({ dispatch, storedCollectionName, storedLayers, storedTraits });
    } catch (error) {
      console.log(error);
    }

    console.log("fetching ends...");

    mountRef.current = true;
  };

  useEffect(() => {
    runFetch();
  }, [user, sessionId]);

  return (
    <button
      onClick={() => runFetch()}
      style={{ background: "red", position: "fixed", top: "8em", left: "4em", zIndex: "9000" }}
    >
      fetch data
    </button>
  );
};

export default StoreData;
