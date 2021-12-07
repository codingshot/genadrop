export const createDna = layers => {

  const getPercentage = (rarity, total) => {
    let result = (parseInt(rarity) / total) * 100;
    return Math.floor(result)
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


export const addLayer = (layers, layerToAdd) => {
  let result = layers.find(layer => layer.layerTitle.toLowerCase() === layerToAdd.layerTitle.toLowerCase())
  if (result) return layers;
  return [...layers, layerToAdd];
}

export const removeLayer = (layers, layerToRemove) => {
  return layers.filter(layer => layer.layerTitle.toLowerCase() !== layerToRemove.layerTitle.toLowerCase())
}

export const addImage = (layers, imageObj) => {
  let newLayers = layers.map(layer => {
    if (layer.layerTitle.toLowerCase() === imageObj.layerTitle.toLowerCase()) {
      return { ...layer, traits: imageObj.traits, traitsAmount: imageObj.traits.length }
    } else {
      return layer
    }
  })
  return newLayers
}

export const removeImage = (layers, imageObj) => {
  let newLayers = layers.map(layer => {
    if (layer.layerTitle === imageObj.layerTitle) {
      const { traits } = layer;
      let newTraits = traits.filter(({ traitTitle }) => traitTitle !== imageObj.traitTitle);
      return { ...layer, traits: newTraits, traitsAmount: newTraits.length }
    } else {
      return layer
    }
  })
  return newLayers
}

export const updateImage = (layers, imageObj) => {
  let newLayers = layers.map(layer => {
    if (layer.layerTitle === imageObj.layerTitle) {
      const { traits } = layer;
      let newTraits = traits.map(trait => {
        if (trait.image.name === imageObj.image.name) {
          return { traitTitle: imageObj.traitTitle, Rarity: imageObj.Rarity, image: imageObj.image }
        } else {
          return trait
        }
      })
      return { ...layer, traits: newTraits, traitsAmount: newTraits.length }
    } else {
      return layer
    }
  })
  return newLayers
}

export const addPreview = (preview, { layerTitle, imageName }) => {
  let result = preview.find(item => item.layerTitle === layerTitle);
  let newPreview = [];
  if (result) {
    newPreview = preview.map(item => {
      if (item.layerTitle === layerTitle) {
        return { layerTitle, imageName }
      } else {
        return item
      }
    })
  } else {
    return [...preview, { layerTitle, imageName }]
  }
  return newPreview
}

export const removePreview = (preview, { layerTitle, imageName }) => {
  let result = preview.find(item => item.layerTitle === layerTitle);
  if (!result) return preview
  return preview.filter(item => !(item.layerTitle === layerTitle && item.imageName === imageName))
}

export const updatePreview = (preview, { layerTitle, imageName }) => {
  let newPreview = preview.map(pre => {
    if (pre["layerTitle"] === layerTitle) {
      return { layerTitle, imageName }
    } else {
      return pre
    }
  })

  return newPreview
}

export const deleteAsset = (nftLayers, id) => {
  return nftLayers.filter(layer => layer.id !== id)
}

export const renameAsset = (nftLayers, value) => {
  return nftLayers.map(layer => (
    layer.id === value.id ? { ...layer, name: value.name } : layer
  ))
}








