import { getDefaultName } from "../utils";

export const addLayer = (layers, layerToAdd) => {
  const result = layers.find((layer) => layer.layerTitle === layerToAdd.layerTitle);
  if (result) return layers;
  return [...layers, layerToAdd];
};

export const removeLayer = (layers, layerToRemove) =>
  layers.filter((layer) => layer.layerTitle !== layerToRemove.layerTitle);

export const updateLayer = (layers, layerToUpdate) => {
  const result = layers.find((layer) => layer.layerTitle === layerToUpdate.layerTitle);
  if (result) return layers;
  return layers.map((layer) =>
    layer.id === layerToUpdate.id ? { ...layer, layerTitle: layerToUpdate.layerTitle } : layer
  );
};

export const addImage = (layers, imageObj) => {
  const newLayers = layers.map((layer) => {
    if (layer.id === imageObj.layerId) {
      return {
        ...layer,
        traits: imageObj.traits,
        traitsAmount: imageObj.traits.length,
      };
    }
    return layer;
  });
  return newLayers;
};

export const removeImage = (layers, imageObj) => {
  const newLayers = layers.map((layer) => {
    if (layer.id === imageObj.layerId) {
      const { traits } = layer;
      const newTraits = traits.filter(({ traitTitle }) => traitTitle !== imageObj.traitTitle);
      return { ...layer, traits: newTraits, traitsAmount: newTraits.length };
    }
    return layer;
  });
  return newLayers;
};

export const updateImage = (layers, imageObj) => {
  const newLayers = layers.map((layer) => {
    if (layer.id === imageObj.layerId) {
      const { traits } = layer;
      const newTraits = traits.map((trait) => {
        if (trait.image.name === imageObj.image.name) {
          return {
            traitTitle: imageObj.traitTitle,
            Rarity: imageObj.Rarity,
            image: imageObj.image,
          };
        }
        return trait;
      });
      return { ...layer, traits: newTraits, traitsAmount: newTraits.length };
    }
    return layer;
  });
  return newLayers;
};

export const addPreview = (preview, { layerId, layerTitle, imageName, imageFile }) => {
  let newPreview = [];
  const result = preview.find((item) => item.layerId === layerId);
  if (result) {
    newPreview = preview.map((item) => {
      if (item.layerId === layerId) {
        return { layerId, layerTitle, imageName, imageFile };
      }
      return item;
    });
  } else {
    return [...preview, { layerId, layerTitle, imageName, imageFile }];
  }
  return newPreview;
};

export const removePreview = (preview, { layerId, imageName }) => {
  const result = preview.find((item) => item.layerId === layerId);
  if (!result) return preview;
  return preview.filter((item) => !(item.layerId === layerId && item.imageName === imageName));
};

export const updatePreview = (preview, { layerId, layerTitle, imageName }) => {
  const newPreview = preview.map((pre) => {
    if (pre.layerId === layerId) {
      return { layerId, layerTitle, imageName };
    }
    return pre;
  });
  return newPreview;
};

export const deleteAsset = (nftLayers, id) =>
  nftLayers
    .filter((layer) => layer.id !== id)
    .map((layer, idx) => ({ ...layer, name: `${layer.name.split("#")[0]} ${getDefaultName(idx + 1)}`.trim() }));

export const renameAsset = (nftLayers, value) =>
  nftLayers.map((layer) => (layer.id === value.id ? { ...layer, name: value.name } : layer));

export const addDescription = (nftLayers, value) =>
  nftLayers.map((layer) => (layer.id === value.id ? { ...layer, description: value.description } : layer));

export const deleteRule = (rule, ruleToDelete) =>
  rule.filter((rl) => JSON.stringify(rl) !== JSON.stringify(ruleToDelete));
