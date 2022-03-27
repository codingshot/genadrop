export const addLayer = (layers, layerToAdd) => {
  let result = layers.find(
    (layer) =>
      layer.layerTitle.toLowerCase() === layerToAdd.layerTitle.toLowerCase()
  );
  if (result) return layers;
  return [...layers, layerToAdd];
};

export const removeLayer = (layers, layerToRemove) => {
  return layers.filter(
    (layer) =>
      layer.layerTitle.toLowerCase() !== layerToRemove.layerTitle.toLowerCase()
  );
};

export const updateLayer = (layers, layerToUpdate) => {
  let result = layers.find(
    (layer) =>
      layer.layerTitle.toLowerCase() === layerToUpdate.layerTitle.toLowerCase()
  );
  if (result) return layers;

  return layers.map((layer) =>
    layer.id === layerToUpdate.id
      ? { ...layer, layerTitle: layerToUpdate.layerTitle }
      : layer
  );
};

export const addImage = (layers, imageObj) => {
  let newLayers = layers.map((layer) => {
    if (layer.layerTitle.toLowerCase() === imageObj.layerTitle.toLowerCase()) {
      return {
        ...layer,
        traits: imageObj.traits,
        traitsAmount: imageObj.traits.length,
      };
    } else {
      return layer;
    }
  });
  return newLayers;
};

export const removeImage = (layers, imageObj) => {
  let newLayers = layers.map((layer) => {
    if (layer.layerTitle === imageObj.layerTitle) {
      const { traits } = layer;
      let newTraits = traits.filter(
        ({ traitTitle }) => traitTitle !== imageObj.traitTitle
      );
      return { ...layer, traits: newTraits, traitsAmount: newTraits.length };
    } else {
      return layer;
    }
  });
  return newLayers;
};

export const updateImage = (layers, imageObj) => {
  let newLayers = layers.map((layer) => {
    if (layer.layerTitle === imageObj.layerTitle) {
      const { traits } = layer;
      let newTraits = traits.map((trait) => {
        if (trait.image.name === imageObj.image.name) {
          return {
            traitTitle: imageObj.traitTitle,
            Rarity: imageObj.Rarity,
            image: imageObj.image,
          };
        } else {
          return trait;
        }
      });
      return { ...layer, traits: newTraits, traitsAmount: newTraits.length };
    } else {
      return layer;
    }
  });
  return newLayers;
};

export const addPreview = (preview, { layerTitle, imageName, imageFile }) => {
  let newPreview = [];
  let result = preview.find((item) => item.layerTitle === layerTitle);
  if (result) {
    newPreview = preview.map((item) => {
      if (item.layerTitle === layerTitle) {
        return { layerTitle, imageName, imageFile };
      } else {
        return item;
      }
    });
  } else {
    return [...preview, { layerTitle, imageName, imageFile }];
  }
  return newPreview;
};

export const removePreview = (preview, { layerTitle, imageName }) => {
  let result = preview.find((item) => item.layerTitle === layerTitle);
  if (!result) return preview;
  return preview.filter(
    (item) => !(item.layerTitle === layerTitle && item.imageName === imageName)
  );
};

export const updatePreview = (preview, { layerTitle, imageName }) => {
  let newPreview = preview.map((pre) => {
    if (pre['layerTitle'] === layerTitle) {
      return { layerTitle, imageName };
    } else {
      return pre;
    }
  });
  return newPreview;
};

export const deleteAsset = (nftLayers, id) => {
  return nftLayers.filter((layer) => layer.id !== id);
};

export const renameAsset = (nftLayers, value) => {
  return nftLayers.map((layer) =>
    layer.id === value.id ? { ...layer, name: value.name } : layer
  );
};

export const addDescription = (nftLayers, value) => {
  return nftLayers.map((layer) =>
    layer.id === value.id ? { ...layer, description: value.description } : layer
  );
};

export const deleteRule = (rule, ruleToDelete) => {
  return rule.filter(
    (rl) => JSON.stringify(rl) !== JSON.stringify(ruleToDelete)
  );
};
