import genActionTypes from "./gen.types";

export const orderLayers = (layers) => ({
  type: genActionTypes.ORDER_LAYERS,
  payload: layers,
});

export const addLayer = (layer) => ({
  type: genActionTypes.ADD_LAYER,
  payload: layer,
});

export const removeLayer = (layer) => ({
  type: genActionTypes.REMOVE_LAYER,
  payload: layer,
});

export const updateLayer = (layer) => ({
  type: genActionTypes.UPDATE_LAYER,
  payload: layer,
});

export const addImage = (image) => ({
  type: genActionTypes.ADD_IMAGE,
  payload: image,
});

export const updateImage = (image) => ({
  type: genActionTypes.UPDATE_IMAGE,
  payload: image,
});

export const removeImage = (imageObj) => ({
  type: genActionTypes.REMOVE_IMAGE,
  payload: imageObj,
});

export const setPreview = (preview) => ({
  type: genActionTypes.SET_PREVIEW,
  payload: preview,
});

export const addPreview = (item) => ({
  type: genActionTypes.ADD_PREVIEW,
  payload: item,
});

export const removePreview = (item) => ({
  type: genActionTypes.REMOVE_PREVIEW,
  payload: item,
});

export const updatePreview = (item) => ({
  type: genActionTypes.UPDATE_PREVIEW,
  payload: item,
});

export const clearPreview = () => ({
  type: genActionTypes.CLEAR_PREVIEW,
});

export const setMintAmount = (amount) => ({
  type: genActionTypes.SET_MINT_AMOUNT,
  payload: amount,
});

export const setNftLayers = (layers) => ({
  type: genActionTypes.SET_NFT_LAYERS,
  payload: layers,
});

export const setCombinations = (val) => ({
  type: genActionTypes.SET_COMBINATIONS,
  payload: val,
});

export const setLoading = (val) => ({
  type: genActionTypes.SET_LOADING,
  payload: val,
});

export const setMintInfo = (val) => ({
  type: genActionTypes.SET_MINT_INFO,
  payload: val,
});

export const deleteAsset = (asset) => ({
  type: genActionTypes.DELETE_ASSET,
  payload: asset,
});

export const setCurrentDnaLayers = (layers) => ({
  type: genActionTypes.SET_CURRENT_DNA_LAYERS,
  payload: layers,
});

export const renameAsset = (val) => ({
  type: genActionTypes.RENAME_ASSET,
  payload: val,
});

export const setCollectionName = (name) => ({
  type: genActionTypes.SET_COLLECTION_NAME,
  payload: name,
});

export const setCollectionDescription = (description) => ({
  type: genActionTypes.SET_COLLECTION_DESCRIPTION,
  payload: description,
});

export const addDescription = (val) => ({
  type: genActionTypes.ADD_DESCRIPTION,
  payload: val,
});

export const setOutputFormat = (format) => ({
  type: genActionTypes.SET_OUTPUT_FORMAT,
  payload: format,
});

export const setConnector = (connector) => ({
  type: genActionTypes.SET_CONNECTOR,
  payload: connector,
});

export const setChainId = (chainId) => ({
  type: genActionTypes.SET_CHAIN_ID,
  payload: chainId,
});

export const setAccount = (account) => ({
  type: genActionTypes.SET_ACCOUNT,
  payload: account,
});

export const setConflictRule = (state) => ({
  type: genActionTypes.SET_CONFLICT_RULE,
  payload: state,
});

export const addRule = (rule) => ({
  type: genActionTypes.ADD_RULE,
  payload: rule,
});

export const clearRule = () => ({
  type: genActionTypes.CLEAR_RULE,
});

export const deleteRule = (rule) => ({
  type: genActionTypes.DELETE_RULE,
  payload: rule,
});

export const setCollections = (collections) => ({
  type: genActionTypes.SET_COLLECTIONS,
  payload: collections,
});

export const setSingleNfts = (nfts) => ({
  type: genActionTypes.SET_SINGLE_NFTS,
  payload: nfts,
});

export const setNotification = (notification) => ({
  type: genActionTypes.SET_FEEDBACK,
  payload: notification,
});

export const setClipboard = (message) => ({
  type: genActionTypes.SET_CLIPBOARD,
  payload: message,
});

export const setLoader = (message) => ({
  type: genActionTypes.SET_LOADER,
  payload: message,
});

export const setDidMout = (isMount) => ({
  type: genActionTypes.SET_DID_MOUNT,
  payload: isMount,
});

export const setMainnet = (mainnet) => ({
  type: genActionTypes.SET_MAINNET,
  payload: mainnet,
});

export const setPrompt = (prompt) => ({
  type: genActionTypes.SET_PROMPT,
  payload: prompt,
});

export const promptDeleteAsset = (asset) => ({
  type: genActionTypes.PROMPT_DELETE_ASSET,
  payload: asset,
});

export const promptDeleteLayer = (layer) => ({
  type: genActionTypes.PROMPT_DELETE_LAYER,
  payload: layer,
});

export const promptDeleteRules = (rules) => ({
  type: genActionTypes.PROMPT_DELETE_RULES,
  payload: rules,
});
