import genActionTypes from "./gen.types";

export const setLayers = (layers) => ({
  type: genActionTypes.SET_LAYERS,
  payload: layers,
});

export const addLayer = (layer) => ({
  type: genActionTypes.ADD_LAYER,
  payload: layer,
});

export const setGraphCollection = (collections) => ({
  type: genActionTypes.GRAPH_COLLECTIONS,
  payload: collections,
});

export const removeLayer = (layer) => ({
  type: genActionTypes.REMOVE_LAYER,
  payload: layer,
});

export const updateLayer = (layer) => ({
  type: genActionTypes.UPDATE_LAYER,
  payload: layer,
});

export const clearLayers = () => ({
  type: genActionTypes.CLEAR_LAYERS,
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

export const setOverlay = (state) => ({
  type: genActionTypes.SET_OVERLAY,
  payload: state,
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

export const setProposedChain = (chain) => ({
  type: genActionTypes.SET_PROPOSED_CHAIN,
  payload: chain,
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

export const setAlgoCollections = (collections) => ({
  type: genActionTypes.SET_ALGO_COLLECTIONS,
  payload: collections,
});

export const setAuroraCollections = (collections) => ({
  type: genActionTypes.SET_AURORA_COLLECTIONS,
  payload: collections,
});

export const setCeloCollections = (collections) => ({
  type: genActionTypes.SET_CELO_COLLECTIONS,
  payload: collections,
});

export const setCeloSingleNft = (nfts) => ({
  type: genActionTypes.SET_CELO_SINGLE_NFT,
  payload: nfts,
});

export const setNearSingleNft = (nfts) => ({
  type: genActionTypes.SET_NEAR_SINGLE_NFTS,
  payload: nfts,
});

export const setAvaxSingleNfts = (nfts) => ({
  type: genActionTypes.SET_AVAX_SINGLE_NFTS,
  payload: nfts,
});

export const setArbitrumNfts = (nfts) => ({
  type: genActionTypes.SET_ARBITRUM_SINGLE_NFTS,
  payload: nfts,
});

export const setAllNfts = (nfts) => ({
  type: genActionTypes.SET_ALL_NFTS,
  payload: nfts,
});

export const setPolygonCollections = (collections) => ({
  type: genActionTypes.SET_POLYGON_COLLECTIONS,
  payload: collections,
});

export const setSingleNfts = (nfts) => ({
  type: genActionTypes.SET_SINGLE_NFTS,
  payload: nfts,
});

export const setAlgoSingleNfts = (nfts) => ({
  type: genActionTypes.SET_ALGO_SINGLE_NFTS,
  payload: nfts,
});

export const setAuroraSingleNfts = (nfts) => ({
  type: genActionTypes.SET_AURORA_SINGLE_NFTS,
  payload: nfts,
});

export const setPolygonSingleNfts = (nfts) => ({
  type: genActionTypes.SET_POLYGON_SINGLE_NFTS,
  payload: nfts,
});

export const setNotification = (notification) => ({
  type: genActionTypes.SET_NOTIFICATION,
  payload: notification,
});

export const setSwitchWalletNotification = (notification) => ({
  type: genActionTypes.SET_SWITCH_WALLET_NOTIFICATION,
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

export const setToggleWalletPopup = (state) => ({
  type: genActionTypes.TOGGLE_WALLET_POPUP,
  payload: state,
});

export const setActiveCollection = (collection) => ({
  type: genActionTypes.SET_ACTIVE_COLLECTION,
  payload: collection,
});

export const setImageQuality = (value) => ({
  type: genActionTypes.SET_IMAGE_QUALITY,
  payload: value,
});
export const setZip = (value) => ({
  type: genActionTypes.SET_ZIP,
  payload: value,
});

export const setConnectFromMint = (prop) => ({
  type: genActionTypes.CONNECT_FROM_MINT,
  payload: prop,
});

export const setCurrentUser = (currentUser) => ({
  type: genActionTypes.SET_CURRENT_USER,
  payload: currentUser,
});

export const setImageAction = (action) => ({
  type: genActionTypes.SET_IMAGE_ACTION,
  payload: action,
});

export const setLayerAction = (action) => ({
  type: genActionTypes.SET_LAYER_ACTION,
  payload: action,
});

export const setCurrentSession = (id) => ({
  type: genActionTypes.SET_CURRENT_SESSION,
  payload: id,
});

export const setSession = (session) => ({
  type: genActionTypes.SET_SESSION,
  payload: session,
});

export const setToggleSessionModal = (state) => ({
  type: genActionTypes.TOGGLE_SESSION_MODAL,
  payload: state,
});

export const setToggleCollectionNameModal = (state) => ({
  type: genActionTypes.TOGGLE_COLLECTION_NAME_MODAL,
  payload: state,
});

export const setCurrentPlan = (plan) => ({
  type: genActionTypes.SET_CURRENT_PLAN,
  payload: plan,
});

export const setProposedPlan = (plan) => ({
  type: genActionTypes.SET_PROPOSED_PLAN,
  payload: plan,
});

export const setUpgradePlan = (state) => ({
  type: genActionTypes.SET_UPGRADE_PLAN,
  payload: state,
});

export const setActionProgress = (state) => ({
  type: genActionTypes.SET_ACTION_PROGRESS,
  payload: state,
});

export const setMinter = (minter) => ({
  type: genActionTypes.SET_MINTER,
  payload: minter,
});

export const setToggleUpgradeModal = (state) => ({
  type: genActionTypes.TOGGLE_UPGRADE_MODAL,
  payload: state,
});

export const setSearchContainer = (val) => ({
  type: genActionTypes.SET_SEARCH_cONTAINER,
  payload: val,
});

export const setIsUser = (state) => ({
  type: genActionTypes.SET_IS_USER,
  payload: state,
});

export const setPriceFeed = (state) => ({
  type: genActionTypes.SET_PRICE_FEED,
  payload: state,
});
