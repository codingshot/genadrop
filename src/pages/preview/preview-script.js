import { v4 as uuid } from 'uuid';
import { handleImage } from '../../components/utils';

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
  const { layers, rule, nftLayers, deleteId } = props;
  let newLayersCopy = [...nftLayers];
  let newAttributes = [];
  let uniqueIndex = 1;
  const prevAttributes = newLayersCopy.map(({ attributes }) => attributes);

  for (let i = 0; i < uniqueIndex; i++) {
    let attribute = [];
    layers.forEach(({ layerTitle, traits }) => {
      let randNum = Math.floor(Math.random() * traits.length)
      let { traitTitle, Rarity, image } = traits[randNum]
      attribute.push({
        trait_type: layerTitle,
        value: traitTitle,
        rarity: Rarity,
        image: image
      })
    })

    if (isUnique(prevAttributes, attribute, rule)) {
      newAttributes = [...attribute]
    } else {
      uniqueIndex++;
    }
  }

  const _newLayers = newLayersCopy.map(layer => {
    if (layer.id === deleteId) {
      return {
        id: uuid(),
        image: "image",
        attributes: newAttributes
      }
    } else {
      return layer
    }
  })

  return _newLayers;
}

export const generateArt = async props => {
  const { layers, canvas, image } = props;
  const uniqueImages = [];
  for (let { attributes, id } of layers) {
    const images = [];
    attributes.forEach(attr => {
      images.push(attr.image)
    })
    await handleImage({images, canvas, image});
    const imageUrl = canvas.toDataURL();
    uniqueImages.push({ id, imageUrl })
  }
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

export const getAweaveFormat = nftLayers => {
  return nftLayers.map((layer, idx) => (
    {
      name: layer.name ? layer.name : `_${idx}`,
      image: "image.png",
      description: layer.description,
      attributes: layer.attributes.map(({ trait_type, value, rarity }) => (
        { trait_type, value, rarity }
      )),
      symbol: '',
      seller_fee_basis_points: '',
      external_url: "",
      collection: {
        name: layer.name ? layer.name : `_${idx}`,
        family: ""
      },
      properties: {
        creators: [
          {
            address: "",
            share: 100
          }
        ]
      }
    }
  ))
}

export const getIpfsFormat = nftLayers => {
  return nftLayers.map((layer, idx) => (
    {
      name: layer.name ? layer.name : `_${idx}`,
      image: "image.png",
      description: layer.description,
      attributes: layer.attributes.map(({ trait_type, value, rarity }) => (
        { trait_type, value, rarity }
      ))
    }
  ))
}
