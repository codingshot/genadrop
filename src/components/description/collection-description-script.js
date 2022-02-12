import { v4 as uuid } from 'uuid';
import { getDefaultDescription, getDefaultName, handleImage } from '../../utils';

export const createDna = layers => {
  const getPercentage = (rarity, total) => {
    let result = (parseInt(rarity) / total) * 100;
    return Math.floor(result) ? Math.floor(result) : 1
  }

  function shuffle(array) {
    for (let i = 0; i < 100; i++) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    return array
  }

  const newLayers = layers.map(layer => {
    const totalTraits = (layer.traits.map(trait => parseInt(trait.Rarity))).reduce((acc, curr) => acc + curr);
    const newTraits = (layer.traits.map(trait => Array(getPercentage(trait.Rarity, totalTraits)).fill(trait))).flat();
    return { ...layer, traits: shuffle(newTraits) }
  })
  return newLayers.reverse();
}

export const isUnique = (attributes, attr, rule) => {
  let parseAttrToRule = attr.map(p => ({ layerTitle: p.trait_type, imageName: p.value }))
  let att_str = JSON.stringify(attr);
  for (let _attr of attributes) {
    let _attr_str = JSON.stringify(_attr);
    if (_attr_str === att_str) return false;
  };
  let result;
  for (let rl of rule) {
    result = rl.every(el => {
      if (JSON.stringify(parseAttrToRule).includes(JSON.stringify(el))) return true;
      return false;
    });

    if (result === true) return false;
  };
  return true
}

export const createUniqueLayer = props => {
  const { dispatch, setLoader, setFeedback, layers, mintAmount, rule, collectionName } = props;
  const newLayers = [];
  const newAttributes = [];
  let uniqueIndex = 0;

  for (let i = 0; i < (mintAmount + uniqueIndex); i++) {
    let attr = [];
    layers.forEach(({ layerTitle, traits }) => {
      let randNum = Math.floor(Math.random() * traits.length)
      let { traitTitle, Rarity, image } = traits[randNum]
      attr.push({
        trait_type: layerTitle,
        value: traitTitle,
        rarity: Rarity,
        image: image
      })
    })

    if (isUnique(newAttributes, attr, rule)) {
      newAttributes.push([...attr])
      // dispatch(setLoader(`preparing ${newAttributes.length} of ${mintAmount}`))
      console.log(`preparing ${newAttributes.length} of ${mintAmount}`);
    } else {
      uniqueIndex++;
      console.log(`

      removing ${uniqueIndex} duplicates
      
      `);
      // dispatch(setLoader(`removing ${uniqueIndex} duplicates`))
    }
  }
  newAttributes.forEach((attr, id) => {
    newLayers.push({
      id: uuid(),
      name: getDefaultName(id + 1),
      description: getDefaultDescription(collectionName, id + 1),
      image: "image",
      attributes: attr
    })
  })

  return newLayers;
}

export const generateArt = async props => {
  const { layers, canvas, image, dispatch, setLoader } = props;
  const uniqueImages = [];
  for (let [index, { attributes, id }] of layers.entries()) {
    dispatch(setLoader(`generating ${index + 1} of ${layers.length}`))
    const images = [];
    attributes.forEach(attr => {
      images.push(attr.image)
    })
    await handleImage({ images, canvas, image });
    const imageUrl = canvas.toDataURL();
    uniqueImages.push({ id, imageUrl })
  }
  dispatch(setLoader(''))
  return uniqueImages;
}

export const parseLayers = props => {
  const { uniqueLayers, arts } = props;
  return uniqueLayers.map(layer => {
    for (let art of arts) {
      if (art.id === layer.id) {
        return { ...layer, image: art.imageUrl }
      }
    }
    return layer
  })
}