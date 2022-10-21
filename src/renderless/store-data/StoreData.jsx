import { async } from "@firebase/util";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { setImageAction, setLayerAction, setNftLayers, setPriceFeed } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import { getLatestPriceAvax, getLatestPriceCelo, getLatestPriceMatic, getLatestPriceNear } from "../../utils/priceFeed";
import {
  deleteAllTraits,
  deleteTrait,
  renameTrait,
  saveCollectionName,
  saveLayers,
  saveNftLayers,
  saveRules,
  saveTraits,
} from "./StoreData.script";

const StoreData = () => {
  const location = useLocation();

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
    currentPlan,
    priceFeed,
  } = useContext(GenContext);

  const resetLayerAction = () => {
    dispatch(
      setLayerAction({
        type: "",
      })
    );
  };

  // useEffect(async () => {

  //   getLatestPriceCelo(dispatch);
  //   getLatestPriceAvax(dispatch);
  //   getLatestPriceMatic(dispatch);
  //   getLatestPriceNear(dispatch);

  // }, []);

  // useEffect(()=>{
  //   axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=usd`).then((res) => {
  //     const price = Object.values(res.data)[0]?.usd;
  //     dispatch(setPriceFeed({ algorand: price }));
  //   });

  //   axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=aurora-near&vs_currencies=usd`).then((res) => {
  //     const price = Object.values(res.data)[0]?.usd;

  //     dispatch(setPriceFeed({ "aurora-near": price }));
  //   });
  // },[])

  useEffect(() => {
    const { type } = layerAction;
    if (type !== "name") return;
    saveCollectionName({ currentUser, sessionId, collectionName });
    resetLayerAction();
  }, [layerAction, currentUser, sessionId, collectionName]);

  useEffect(() => {
    const { type } = layerAction;
    if ((!type && !imageAction.type) || type === "generate" || type === "loadPreNftLayers") return;
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
    if (location.pathname === "/create/collection" && type !== "rule") {
      dispatch(setNftLayers([]));
    }
    resetLayerAction();
  }, [layerAction, imageAction, layers, currentUser, sessionId]);

  useEffect(() => {
    const nftTraits = [];
    const newNftLayers = nftLayers.map(({ image, id, attributes, ...otherLayerProps }) => {
      nftTraits.push({ image, id });
      return { image: "", id, attributes, ...otherLayerProps };
    });
    saveNftLayers({ currentUser, sessionId, nftLayers: newNftLayers, nftTraits });
    resetLayerAction();
  }, [nftLayers, currentUser, sessionId]);

  useEffect(() => {
    const { type, value } = imageAction;
    if (!type) return;

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

    dispatch(
      setImageAction({
        type: "",
        value: {},
      })
    );
  }, [imageAction, currentUser, sessionId]);

  useEffect(() => {
    const { type } = layerAction;
    if (type !== "rule") return;
    const newRules = rule.map((r) => {
      const iRule = r.map(({ imageFile, ...ir }) => {
        return { imageFile: "", ...ir };
      });
      return iRule;
    });

    const strRules = JSON.stringify(newRules);
    saveRules({ currentUser, sessionId, rules: strRules });
    resetLayerAction();
  }, [layerAction, currentUser, sessionId, rule]);

  useEffect(() => {
    if (currentUser && sessionId && upgradePlan && currentPlan === "free") {
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
      const nftTraits = [];
      const newNftLayers = nftLayers.map(({ image, id, attributes, ...otherLayerProps }) => {
        nftTraits.push({ image, id });
        return { image: "", id, attributes, ...otherLayerProps };
      });
      saveNftLayers({ currentUser, sessionId, nftLayers: newNftLayers, nftTraits });
    }
  }, [currentUser, sessionId, upgradePlan, currentPlan]);

  return null;
};

export default StoreData;
