/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
import { v4 as uuid } from "uuid";
import {
  setCurrentDnaLayers,
  setNftLayers,
  setNotification,
  setLoader,
  setLayerAction,
} from "../../gen-state/gen.actions";
import { getDefaultName, handleImage } from "../../utils";

export const createDna = (layers) => {
  const getPercentage = (rarity, total) => {
    const result = (parseInt(rarity) / total) * 100;
    return Math.floor(result) ? Math.floor(result) : 1;
  };

  function shuffle(array) {
    for (let i = 0; i < 100; i += 1) {
      for (let x = array.length - 1; x > 0; x -= 1) {
        const j = Math.floor(Math.random() * (x + 1));
        [array[x], array[j]] = [array[j], array[x]];
      }
    }
    return array;
  }

  const newLayers = layers
    .filter((layer) => layer.traits.length)
    .map((layer) => {
      const totalTraits = layer.traits.map((trait) => parseInt(trait.Rarity)).reduce((acc, curr) => acc + curr);
      const newTraits = layer.traits.map((trait) => Array(getPercentage(trait.Rarity, totalTraits)).fill(trait)).flat();
      return { ...layer, traits: shuffle(newTraits) };
    });
  return newLayers.reverse();
};

export const isUnique = (attributes, attr, rule) => {
  const parseAttrToRule = attr.map((p) => ({
    layerTitle: p.trait_type,
    imageName: p.imageName,
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
  const { dispatch, setLoader, layers, rule, mintAmount, collectionName } = props;
  const newLayers = [];
  const newAttributes = [];
  let uniqueIndex = 0;

  const uniqueLayerCallback = (resolve) => {
    setTimeout(() => {
      dispatch(
        setLoader(
          `preparing ${newAttributes.length} of ${mintAmount} assets 
removing ${uniqueIndex} duplicates`
        )
      );

      const attr = [];
      layers.forEach(({ layerTitle, traits, id }) => {
        const randNum = Math.floor(Math.random() * traits.length);
        const { traitTitle, Rarity, image } = traits[randNum];
        attr.push({
          trait_type: layerTitle,
          imageName: traitTitle.replace(".png", ""),
          rarity: Rarity,
          image,
          id,
        });
      });

      if (isUnique(newAttributes, attr, rule)) {
        newAttributes.push([...attr]);
      } else {
        uniqueIndex += 1;
      }
      resolve();
    }, 0);
  };

  for (let i = 0; i < mintAmount + uniqueIndex; i += 1) {
    await new Promise(uniqueLayerCallback);
  }

  newAttributes.forEach((attr, id) => {
    newLayers.push({
      id: uuid(),
      name: `${collectionName} ${getDefaultName(id + 1)}`.trim(),
      description: "",
      image: "image",
      attributes: attr,
    });
  });

  return newLayers;
};

export const generateArt = async (props) => {
  const { layers, canvas, image, dispatch, setLoader, imageQuality } = props;
  const uniqueImages = [];
  for (const [index, { attributes, id }] of layers.entries()) {
    dispatch(setLoader(`generating ${index + 1} of ${layers.length}`));
    const images = [];
    attributes.forEach((attr) => {
      images.push(attr.image);
    });
    await handleImage({ images, canvas, image });
    const imageUrl = canvas.toDataURL("image/webp", imageQuality);
    uniqueImages.push({ id, imageUrl });
  }
  dispatch(setLoader(""));
  return uniqueImages;
};

export const parseLayers = (props) => {
  const { uniqueLayers, arts } = props;
  return uniqueLayers.map(({ attributes, id, ...otherLayerProps }) => {
    const newAttributes = attributes.map(({ image, ...otherAttrProps }) => ({ ...otherAttrProps }));
    for (const art of arts) {
      if (art.id === id) {
        return { ...otherLayerProps, id, attributes: newAttributes, image: art.imageUrl };
      }
    }
    return { attributes: newAttributes, id, ...otherLayerProps };
  });
};

export const getFirstLayerWithTrait = (layers) => {
  return layers.find((layer) => layer.traits.length);
};

export const handleGenerate = async (generateProps) => {
  let startTime = performance.now();
  const { isRule, mintAmount, combinations, layers, collectionName, dispatch, rule, canvasRef, imageQuality } =
    generateProps;

  if (isRule) {
    return dispatch(
      setNotification({
        message: "Finish adding conflict rule and try again",
        type: "warning",
      })
    );
  }
  if (mintAmount <= 0 || !mintAmount) {
    return dispatch(
      setNotification({
        message: "Set amount to generate",
        type: "warning",
      })
    );
  }
  if (!combinations) {
    return dispatch(
      setNotification({
        message: "Upload images and try again",
        type: "warning",
      })
    );
  }
  if (mintAmount > combinations) {
    return dispatch(
      setNotification({
        message: "Cannot generate more than the possible combinations",
        type: "warning",
      })
    );
  }
  dispatch(setNftLayers([]));
  const dnaLayers = createDna(layers);
  const uniqueLayers = await createUniqueLayer({
    dispatch,
    setNotification,
    setLoader,
    layers: dnaLayers,
    mintAmount,
    rule,
    collectionName,
  });

  const arts = await generateArt({
    dispatch,
    setLoader,
    layers: uniqueLayers,
    canvas: canvasRef.current,
    image: getFirstLayerWithTrait(layers).traits[0].image,
    imageQuality,
  });

  dispatch(setCurrentDnaLayers(dnaLayers));
  dispatch(setNftLayers(parseLayers({ uniqueLayers, arts })));
  dispatch(
    setLayerAction({
      type: "generate",
    })
  );
  dispatch(
    setNotification({
      message: "Done! Click on the preview button to view assets.",
      type: "success",
    })
  );
  const endTime = performance.now();
  console.log(`Call to generate collection took ${(endTime - startTime) / 1000} seconds`);
};
