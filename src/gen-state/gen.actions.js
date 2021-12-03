import genActionTypes from './gen.types';

export const orderLayers = layers => ({
  type: genActionTypes.ORDER_LAYERS,
  payload: layers
});

export const addLayer = layer => ({
  type: genActionTypes.ADD_LAYER,
  payload: layer
});

export const removeLayer = layer => ({
  type: genActionTypes.REMOVE_LAYER,
  payload: layer
});

export const updateLayer = layer => ({
  type: genActionTypes.UPDATE_LAYER,
  payload: layer
});

export const addImage = image => ({
  type: genActionTypes.ADD_IMAGE,
  payload: image
});

export const updateImage = image => ({
  type: genActionTypes.UPDATE_IMAGE,
  payload: image
});

export const removeImage = imageObj => ({
  type: genActionTypes.REMOVE_IMAGE,
  payload: imageObj
});

export const addPreview = item => ({
  type: genActionTypes.ADD_PREVIEW,
  payload: item
});

export const removePreview = item => ({
  type: genActionTypes.REMOVE_PREVIEW,
  payload: item
});

export const updatePreview = item => ({
  type: genActionTypes.UPDATE_PREVIEW,
  payload: item
})

export const setMintAmount = amount => ({
  type: genActionTypes.SET_MINT_AMOUNT,
  payload: amount
})

export const setNftLayers = layers => ({
  type: genActionTypes.SET_NFT_LAYERS,
  payload: layers
})

export const setCombinations = val => ({
  type: genActionTypes.SET_COMBINATIONS,
  payload: val
})

export const setLoading = val => ({
  type: genActionTypes.SET_LOADING,
  payload: val
})

export const setMintInfo = val => ({
  type: genActionTypes.SET_MINT_INFO,
  payload: val
})

export const deleteAsset = asset => ({
  type: genActionTypes.DELETE_ASSET,
  payload: asset
})

export const setCurrentDnaLayers = layers => ({
  type: genActionTypes.SET_CURRENT_DNA_LAYERS,
  payload: layers
})

export const renameAsset = val => ({
  type: genActionTypes.RENAME_ASSET,
  payload: val
})

export const setCollectionName = name => ({
  type: genActionTypes.SET_COLLECTION_NAME,
  payload: name
})