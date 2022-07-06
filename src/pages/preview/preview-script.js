import { getDefaultName, handleImage } from "../../utils";

export const isUnique = (attributes, attr, rule) => {
  const parseAttrToRule = attr.map((p) => ({
    layerTitle: p.trait_type,
    imageName: p.value,
  }));
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
    setTimeout(() => {
      dispatch(setLoader(`removing ${uniqueIndex} duplicates`));
      const attribute = [];
      layers.forEach(({ layerTitle, traits }) => {
        const randNum = Math.floor(Math.random() * traits.length);
        const { traitTitle, Rarity, image } = traits[randNum];
        attribute.push({
          trait_type: layerTitle,
          value: traitTitle.replace(".png", ""),
          rarity: Rarity,
          image,
        });
      });
      if (isUnique(prevAttributes, attribute, rule)) {
        newAttributes = [...attribute];
      } else {
        uniqueIndex += 1;
      }
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

export const handleDeleteAndReplace = async (id, index, currentPageD) => {
  if (!(combinations - rule.length - mintAmount)) {
    dispatch(setMintInfo("  cannot generate asset from 0 combination"));
  } else {
    dispatch(setLoader("generating..."));
    dispatch(setMintInfo(""));
    const newLayer = await createUniqueLayer({
      dispatch,
      setLoader,
      collectionName,
      collectionDescription,
      index,
      currentPage: currentPageD,
      layers: currentDnaLayers,
      rule,
      nftLayers,
      id,
      mintAmount,
    });
    const art = await generateArt({
      dispatch,
      setLoader,
      layer: newLayer,
      canvas,
      image: layers[0].traits[0].image,
      imageQuality,
    });
    const newLayers = nftLayers.map((asset) =>
      asset.id === newLayer.id ? { ...newLayer, image: art.imageUrl } : asset
    );
    dispatch(setLoader(""));
    dispatch(setNftLayers(newLayers));
  }
};

export const handleRename = (input) => {
  if (!input.value) {
    dispatch(
      renameAsset({
        id: input.id,
        name: `${collectionName} ${getDefaultName(input.index + 1)}`.trim(),
      })
    );
  } else {
    dispatch(renameAsset({ id: input.id, name: input.value }));
  }
};

export const handleCollectionName = async (value) => {
  dispatch(setCollectionName(value));
  const newLayers = nftLayers.map((asset, idx) => ({
    ...asset,
    name: `${value} ${getDefaultName(idx + 1)}`.trim(),
  }));
  dispatch(setNftLayers(newLayers));

  // The code below needs cross-examination

  // try {
  //   dispatch(setLoader("saving..."));
  //   const names = await getCollectionsNames();
  //   const isUnique = names.find((name) => name.toLowerCase() === value.toLowerCase());
  //   if (isUnique) {
  //     dispatch(
  //       setNotification({
  //         message: `${value} already exist. try choose another name`,
  //         type: "warning",
  //       })
  //     );
  //   } else {
  //     dispatch(setCollectionName(value));
  //     const newLayers = nftLayers.map((asset, idx) => ({
  //       ...asset,
  //       name: `${value} ${getDefaultName(idx + 1)}`.trim(),
  //     }));
  //     dispatch(setNftLayers(newLayers));
  //   }
  // } catch (error) {
  //   dispatch(
  //     setNotification({
  //       message: "could not save your collection name, please try again.",
  //       type: "error",
  //     })
  //   );
  // }
  // dispatch(setLoader(""));
};

export const handleCollectionDescription = (event) => {
  if (enableAllDescription) {
    const newLayers = nftLayers.map((asset) => ({
      ...asset,
      description: event.target.value,
    }));
    dispatch(setNftLayers(newLayers));
  }
  dispatch(setCollectionDescription(event.target.value));
};

export const handleFormatChange = (val) => {
  if (val === "ipfs") {
    ipfsRef.current.checked = true;
    dispatch(setOutputFormat("ipfs"));
  } else if (val === "arweave") {
    arweaveRef.current.checked = true;
    dispatch(setOutputFormat("arweave"));
  }
};

export const addGif = (asset) => {
  if (gifImages.filter((e) => e.id === asset.id).length > 0) {
    const newImgs = gifImages.filter((e) => e.id !== asset.id);
    handleSetState({ gifImages: newImgs });
  } else {
    handleSetState({ gifImages: [...gifImages, asset] });
  }
};

export const generateGif = () => {
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
// GIFs Model
export const handleCancel = () => handleSetState({ toggleGuide: false });

export const addToCollection = (gif) => {
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

export const addAllGifs = () => {
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

export const handleSetState = (payload) => {
  setState((states) => ({ ...states, ...payload }));
};

export const handleDelete = (val) => {
  dispatch(setPrompt(promptDeleteAsset(val)));
};

export const handleDescription = (input) => {
  dispatch(addDescription({ id: input.id, description: input.value }));
};
