/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import axios from "axios";
import { v4 as uuid } from "uuid";
import {
  addDescription,
  promptDeleteAsset,
  renameAsset,
  setCollectionDescription,
  setCollectionName,
  setLoader,
  setMintInfo,
  setNftLayers,
  setNotification,
  setOutputFormat,
  setPrompt,
} from "../../gen-state/gen.actions";
import { getDefaultName, handleImage } from "../../utils";

export const isUnique = (attributes, attr, rule) => {
  const parseAttrToRule = attr.map((p) => ({
    layerTitle: p.trait_type,
    imageName: p.imageName,
  }));
  attr = attr.map(({ image, ...otherAttrs }) => otherAttrs);
  const att_str = JSON.stringify(attr);
  for (const _attr of attributes) {
    const _attr_str = JSON.stringify(_attr);
    if (_attr_str === att_str) return false;
  }
  let result;
  for (const rl of rule) {
    result = rl.every((el) => {
      let singleRule = {
        layerTitle: el.layerTitle,
        imageName: el.imageName,
      };
      if (JSON.stringify(parseAttrToRule).includes(JSON.stringify(singleRule))) {
        return true;
      }
      return false;
    });
    if (result === true) return false;
  }
  return true;
};

export const createUniqueLayer = async (props) => {
  const {
    dispatch,
    setLoader,
    layers,
    rule,
    nftLayers,
    collectionName,
    collectionDescription,
    index,
    currentPage,
    id,
  } = props;
  const newLayersCopy = [...nftLayers];
  let newAttributes = [];
  let uniqueIndex = 1;
  const prevAttributes = newLayersCopy.map(({ attributes }) => attributes);

  const uniqueCall = (resolve) => {
    dispatch(setLoader(`removing ${uniqueIndex} duplicates`));
    const attribute = [];
    layers.forEach(({ layerTitle, traits, id }) => {
      const randNum = Math.floor(Math.random() * traits.length);
      const { traitTitle, Rarity, image } = traits[randNum];
      attribute.push({
        trait_type: layerTitle,
        imageName: traitTitle.replace(".png", ""),
        rarity: Rarity,
        image,
        id,
      });
    });
    if (isUnique(prevAttributes, attribute, rule)) {
      newAttributes = [...attribute];
    } else {
      uniqueIndex += 1;
    }

    setTimeout(() => {
      resolve();
    }, 0);
  };
  for (let i = 0; i < uniqueIndex; i += 1) {
    const promise = new Promise(uniqueCall);
    // eslint-disable-next-line no-await-in-loop
    await promise;
  }

  dispatch(setLoader(""));
  return {
    id,
    name: `${collectionName} ${getDefaultName(index + 1 + (currentPage * 20 - 20))}`.trim(),
    description: collectionDescription,
    image: "image",
    attributes: newAttributes,
  };
};

export const generateArt = async (props) => {
  const { layer, canvas, image, imageQuality } = props;
  const images = [];
  layer.attributes.forEach((attr) => {
    images.push(attr.image);
  });
  await handleImage({ images, canvas, image });
  const imageUrl = canvas.toDataURL("image/webp", imageQuality);
  return { id: layer.id, imageUrl };
};

export const handleDeleteAndReplace = async (deleteAndReplaceProps) => {
  const {
    id,
    index,
    currentPage,
    currentDnaLayers,
    dispatch,
    combinations,
    rule,
    mintAmount,
    collectionName,
    collectionDescription,
    imageQuality,
    layers,
    nftLayers,
    canvas,
  } = deleteAndReplaceProps;

  if (!currentDnaLayers)
    return dispatch(
      setNotification({
        type: "error",
        message: "Sorry! you need to generate a new collection to use this feature",
      })
    );
  if (!(combinations - mintAmount)) {
    dispatch(setMintInfo("You have no possible combinations. Delete some art to use this feature."));
    dispatch(
      setNotification({
        message: "You have no possible combinations. Delete some art to use this feature.",
        type: "warning",
      })
    );
  } else {
    dispatch(setLoader("generating..."));
    dispatch(setMintInfo(""));
    const uniqueLayer = await createUniqueLayer({
      dispatch,
      setLoader,
      collectionName,
      collectionDescription,
      index,
      currentPage,
      layers: currentDnaLayers,
      rule,
      nftLayers,
      id,
      mintAmount,
    });
    const art = await generateArt({
      dispatch,
      setLoader,
      layer: uniqueLayer,
      canvas,
      image: layers[0].traits[0].image,
      imageQuality,
    });
    const newLayers = nftLayers.map((asset) => {
      if (asset.id === uniqueLayer.id) {
        let attributes = uniqueLayer.attributes;
        attributes = attributes.map(({ image, ...otherAttrProps }) => ({ ...otherAttrProps }));
        return { ...uniqueLayer, attributes, image: art.imageUrl };
      }
      return asset;
    });
    dispatch(setLoader(""));
    dispatch(setNftLayers(newLayers));
  }
};

export const generateGif = (generateGifProps) => {
  const { duration, gifImages, gifs, collectionName, handleSetState, dispatch } = generateGifProps;

  if (duration < 0 || !duration) {
    dispatch(
      setNotification({
        message: "please enter a valid duration.",
        type: "error",
      })
    );
    return;
  }
  if (gifImages.length < 2) {
    dispatch(
      setNotification({
        message: "please select the images.",
        type: "error",
      })
    );
    return;
  }
  const urls = gifImages.map((img) => img.image);
  const attributes = [];
  gifImages.map((img) => {
    return img.attributes.map((attribute) => {
      attributes.push(attribute);
      return attribute;
    });
  });
  dispatch(setLoader("generating..."));

  axios.post(`https://gif-generator-api.herokuapp.com/`, { urls, duration }).then((res) => {
    dispatch(setLoader(""));
    handleSetState({
      gifs: [
        ...gifs,
        {
          id: uuid(),
          attributes,
          description: "",
          image: res.data.data,
          name: `${collectionName} ${getDefaultName(gifs.length + 1)}`.trim(),
        },
      ],
    });
    handleSetState({ gifShow: false, toggleGuide: true, gifImages: [], duration: "" });
    dispatch(setLoader(""));
  });
};

export const addToCollection = (addToCollectionProps) => {
  const { gif, gifs, nftLayers, collectionName, handleSetState, dispatch } = addToCollectionProps;
  const updatedGifs = gifs.filter((img) => gif.id !== img.id);
  const newLayers = [gif, ...nftLayers].map((asset, idx) => ({
    ...asset,
    name:
      asset.name === `${collectionName} ${getDefaultName(idx)}`.trim() ||
      asset.name === `${collectionName} ${getDefaultName(gifs.indexOf(gif) + 1)}`.trim()
        ? `${collectionName} ${getDefaultName(idx + 1)}`.trim()
        : asset.name,
  }));
  dispatch(setNftLayers(newLayers));
  dispatch(
    setNotification({
      message: "added to the collection.",
      type: "success",
    })
  );
  handleSetState({ gifs: updatedGifs });
};

export const addGif = (addGifProps) => {
  const { asset, gifImages, handleSetState } = addGifProps;
  if (gifImages.filter((e) => e.id === asset.id).length > 0) {
    const newImgs = gifImages.filter((e) => e.id !== asset.id);
    handleSetState({ gifImages: newImgs });
  } else {
    handleSetState({ gifImages: [...gifImages, asset] });
  }
};

export const addAllGifs = (addGifProps) => {
  const { gifs, nftLayers, collectionName, handleSetState, dispatch } = addGifProps;

  const newLayers = [...gifs, ...nftLayers].map((asset, idx) => ({
    ...asset,
    name:
      asset.name === `${collectionName} ${getDefaultName(idx + 1 - gifs.length)}`.trim()
        ? `${collectionName} ${getDefaultName(idx + 1)}`.trim()
        : asset.name,
  }));
  dispatch(setNftLayers(newLayers));
  dispatch(
    setNotification({
      message: "added to the collection.",
      type: "success",
    })
  );
  handleSetState({
    toggleGuide: false,
    gifs: [],
  });
};

export const handleFormatChange = (formatProps) => {
  const { val, dispatch, ipfsRef, arweaveRef } = formatProps;
  if (val === "ipfs") {
    ipfsRef.current.checked = true;
    dispatch(setOutputFormat("ipfs"));
  } else if (val === "arweave") {
    arweaveRef.current.checked = true;
    dispatch(setOutputFormat("arweave"));
  }
};

export const handleCollectionDescription = (descriptionProps) => {
  const { event, enableAllDescription, nftLayers, dispatch } = descriptionProps;
  if (enableAllDescription) {
    const newLayers = nftLayers.map((asset) => ({
      ...asset,
      description: event.target.value,
    }));
    dispatch(setNftLayers(newLayers));
  }
  dispatch(setCollectionDescription(event.target.value));
};

export const handleRename = (renameProps) => {
  const { id, value, index, dispatch, collectionName } = renameProps;
  if (!value) {
    dispatch(
      renameAsset({
        id,
        name: `${collectionName} ${getDefaultName(index + 1)}`.trim(),
      })
    );
  } else {
    dispatch(renameAsset({ id, name: value }));
  }
};

export const handleCollectionName = async (collectionNameProps) => {
  const { value, nftLayers, dispatch } = collectionNameProps;
  dispatch(setCollectionName(value));
  const newLayers = nftLayers.map((asset, idx) => ({
    ...asset,
    name: `${value} ${getDefaultName(idx + 1)}`.trim(),
  }));
  dispatch(setNftLayers(newLayers));
};

export const handleDelete = ({ dispatch, id }) => {
  dispatch(setPrompt(promptDeleteAsset(id)));
};

export const handleDescription = ({ dispatch, id, description }) => {
  dispatch(addDescription({ id, description }));
};
