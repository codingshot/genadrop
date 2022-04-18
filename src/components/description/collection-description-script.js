import { v4 as uuid } from "uuid";
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

  const newLayers = layers.map((layer) => {
    const totalTraits = layer.traits.map((trait) => parseInt(trait.Rarity)).reduce((acc, curr) => acc + curr);
    const newTraits = layer.traits.map((trait) => Array(getPercentage(trait.Rarity, totalTraits)).fill(trait)).flat();
    return { ...layer, traits: shuffle(newTraits) };
  });
  return newLayers.reverse();
};

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
  const { dispatch, setLoader, layers, rule, mintAmount, collectionName } = props;
  const newLayers = [];
  const newAttributes = [];
  let uniqueIndex = 0;

  const mintCallback = (resolve) => {
    setTimeout(() => {
      dispatch(
        setLoader(
          `preparing ${newAttributes.length} of ${mintAmount} assets 
removing ${uniqueIndex} duplicates`
        )
      );

      const attr = [];
      layers.forEach(({ layerTitle, traits }) => {
        const randNum = Math.floor(Math.random() * traits.length);
        const { traitTitle, Rarity, image } = traits[randNum];
        attr.push({
          trait_type: layerTitle,
          value: traitTitle.replace(".png", ""),
          rarity: Rarity,
          image,
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
    await new Promise(mintCallback);
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
  const { layers, canvas, image, dispatch, setLoader } = props;
  const uniqueImages = [];
  for (const [index, { attributes, id }] of layers.entries()) {
    dispatch(setLoader(`generating ${index + 1} of ${layers.length}`));
    const images = [];
    attributes.forEach((attr) => {
      images.push(attr.image);
    });
    await handleImage({ images, canvas, image });
    const imageUrl = canvas.toDataURL("image/webp", 1);
    uniqueImages.push({ id, imageUrl });
  }
  dispatch(setLoader(""));
  return uniqueImages;
};

export const parseLayers = (props) => {
  const { uniqueLayers, arts } = props;
  return uniqueLayers.map((layer) => {
    for (const art of arts) {
      if (art.id === layer.id) {
        return { ...layer, image: art.imageUrl };
      }
    }
    return layer;
  });
};
