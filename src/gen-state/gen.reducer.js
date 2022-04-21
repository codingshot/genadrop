import genActionTypes from "./gen.types";
import {
  addLayer,
  removeLayer,
  addImage,
  removeImage,
  addPreview,
  removePreview,
  updateImage,
  updatePreview,
  deleteAsset,
  renameAsset,
  updateLayer,
  addDescription,
  deleteRule,
} from "./gen.utils";

export const INITIAL_STATE = {
  layers: [],
  preview: [],
  nftLayers: [],
  combinations: 0,
  mintAmount: 0,
  outputFormat: "ipfs",
  mintInfo: "",
  collectionName: "",
  collectionDescription: "",
  isLoading: false,
  currentDnaLayers: null,
  chainId: "",
  account: "",
  connector: null,
  isRule: false,
  rule: [],
  collections: {},
  singleNfts: [],
  notification: "",
  clipboardMessage: "",
  loaderMessage: "",
  didMount: false,
  mainnet: !process.env.REACT_APP_ENV_STAGING,
  prompt: null,
  promptAsset: null,
  promptLayer: null,
  promptRules: null,
};

export const genReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case genActionTypes.ORDER_LAYERS:
      return {
        ...state,
        layers: action.payload,
      };
    case genActionTypes.ADD_LAYER:
      return {
        ...state,
        layers: addLayer(state.layers, action.payload),
      };
    case genActionTypes.REMOVE_LAYER:
      return {
        ...state,
        layers: removeLayer(state.layers, action.payload),
      };
    case genActionTypes.UPDATE_LAYER:
      return {
        ...state,
        layers: updateLayer(state.layers, action.payload),
      };
    case genActionTypes.ADD_IMAGE:
      return {
        ...state,
        layers: addImage(state.layers, action.payload),
      };
    case genActionTypes.REMOVE_IMAGE:
      return {
        ...state,
        layers: removeImage(state.layers, action.payload),
      };
    case genActionTypes.UPDATE_IMAGE:
      return {
        ...state,
        layers: updateImage(state.layers, action.payload),
      };
    case genActionTypes.SET_PREVIEW:
      return {
        ...state,
        preview: action.payload,
      };
    case genActionTypes.ADD_PREVIEW:
      return {
        ...state,
        preview: addPreview(state.preview, action.payload),
      };
    case genActionTypes.CLEAR_PREVIEW:
      return {
        ...state,
        preview: [],
      };
    case genActionTypes.ADD_RULE:
      return {
        ...state,
        rule: action.payload,
      };
    case genActionTypes.CLEAR_RULE:
      return {
        ...state,
        rule: [],
      };
    case genActionTypes.REMOVE_PREVIEW:
      return {
        ...state,
        preview: removePreview(state.preview, action.payload),
      };
    case genActionTypes.UPDATE_PREVIEW:
      return {
        ...state,
        preview: updatePreview(state.preview, action.payload),
      };
    case genActionTypes.SET_MINT_AMOUNT:
      return {
        ...state,
        mintAmount: action.payload,
      };
    case genActionTypes.SET_NFT_LAYERS:
      return {
        ...state,
        nftLayers: action.payload,
      };
    case genActionTypes.SET_COMBINATIONS:
      return {
        ...state,
        // combinations: Math.ceil((100 / 100) * Number(action.payload)),
        combinations: action.payload,
      };
    case genActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case genActionTypes.SET_MINT_INFO:
      return {
        ...state,
        mintInfo: action.payload,
      };
    case genActionTypes.DELETE_ASSET:
      return {
        ...state,
        nftLayers: deleteAsset(state.nftLayers, action.payload),
      };
    case genActionTypes.SET_CURRENT_DNA_LAYERS:
      return {
        ...state,
        currentDnaLayers: action.payload,
      };
    case genActionTypes.RENAME_ASSET:
      return {
        ...state,
        nftLayers: renameAsset(state.nftLayers, action.payload),
      };
    case genActionTypes.ADD_DESCRIPTION:
      return {
        ...state,
        nftLayers: addDescription(state.nftLayers, action.payload),
      };
    case genActionTypes.SET_COLLECTION_NAME:
      return {
        ...state,
        collectionName: action.payload,
      };
    case genActionTypes.SET_COLLECTION_DESCRIPTION:
      return {
        ...state,
        collectionDescription: action.payload,
      };
    case genActionTypes.SET_OUTPUT_FORMAT:
      return {
        ...state,
        outputFormat: action.payload,
      };
    case genActionTypes.SET_ACCOUNT:
      return {
        ...state,
        account: action.payload,
      };
    case genActionTypes.SET_CHAIN_ID:
      return {
        ...state,
        chainId: action.payload,
      };
    case genActionTypes.SET_CONNECTOR:
      return {
        ...state,
        connector: action.payload,
      };
    case genActionTypes.SET_CONFLICT_RULE:
      return {
        ...state,
        isRule: action.payload,
      };
    case genActionTypes.DELETE_RULE:
      return {
        ...state,
        rule: deleteRule(state.rule, action.payload),
      };
    case genActionTypes.SET_COLLECTIONS:
      return {
        ...state,
        collections: action.payload,
      };
    case genActionTypes.SET_SINGLE_NFTS:
      return {
        ...state,
        singleNfts: action.payload,
      };
    case genActionTypes.SET_FEEDBACK:
      return {
        ...state,
        notification: action.payload,
      };
    case genActionTypes.SET_CLIPBOARD:
      return {
        ...state,
        clipboardMessage: action.payload,
      };
    case genActionTypes.SET_LOADER:
      return {
        ...state,
        loaderMessage: action.payload,
      };
    case genActionTypes.SET_DID_MOUNT:
      return {
        ...state,
        didMount: action.payload,
      };
    case genActionTypes.SET_MAINNET:
      return {
        ...state,
        mainnet: action.payload,
      };
    case genActionTypes.SET_PROMPT:
      return {
        ...state,
        prompt: action.payload,
      };
    case genActionTypes.PROMPT_DELETE_ASSET:
      return {
        ...state,
        promptAsset: action.payload,
      };
    case genActionTypes.PROMPT_DELETE_LAYER:
      return {
        ...state,
        promptLayer: action.payload,
      };
    case genActionTypes.PROMPT_DELETE_RULES:
      return {
        ...state,
        promptRules: action.payload,
      };
    default:
      return state;
  }
};
