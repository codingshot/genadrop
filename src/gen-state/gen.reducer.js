/* eslint-disable default-param-last */
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
  proposedChain: null,
  account: "",
  connector: null,
  isRule: false,
  rule: [],
  collections: {},
  singleNfts: [],
  algoCollections: {},
  singleAlgoNfts: {},
  auroraCollections: [],
  polygonCollections: [],
  celoCollections: [],
  singleAuroraNfts: [],
  singleCeloNfts: [],
  singleArbitrumNfts: [],
  singleNearNfts: [],
  singlePolygonNfts: [],
  activeCollection: null,
  notification: {
    message: "",
    type: "", // warning|error|success|default
  },
  switchWalletNotification: false,
  clipboardMessage: "",
  loaderMessage: "",
  didMount: false,
  graphCollections: [],
  mainnet: process.env.REACT_APP_ENV_STAGING === "false",
  prompt: null,
  promptAsset: null,
  promptLayer: null,
  promptRules: null,
  toggleWalletPopup: false,
  imageQuality: 0.5, // high:1|medium:0.5|low:0.2,
  zip: {},
  connectFromMint: {
    isComingSoon: null,
    chainId: null,
  },
  currentUser: null,
  imageAction: {
    type: "", // upload|rename|delete|deleteAll
    value: {},
  },
  layerAction: {
    type: "", // add|delete|order|rename,
  },
  sessionId: "",
  sessions: [],
  toggleSessionModal: false,
  toggleCollectionNameModal: false,
  currentPlan: "free", // free|noobs|geeks|ogs
  upgradePlan: false,
  actionProgress: {
    totalCount: 0,
    resetCount: true,
  },
  proposedPlan: "",
  minter: "",
  toggleUpgradeModal: "",
  searchContainer: null,
  isUser: null,
  priceFeed: null,
};

export const genReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case genActionTypes.SET_LAYERS:
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
    case genActionTypes.CLEAR_LAYERS:
      return {
        ...state,
        layers: [],
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
    case genActionTypes.SET_OVERLAY:
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

    case genActionTypes.SET_PROPOSED_CHAIN:
      return {
        ...state,
        proposedChain: action.payload,
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
    case genActionTypes.SET_ALGO_COLLECTIONS:
      return {
        ...state,
        algoCollections: action.payload,
      };
    case genActionTypes.SET_CELO_SINGLE_NFT:
      return {
        ...state,
        singleCeloNfts: action.payload,
      };
    case genActionTypes.SET_AURORA_COLLECTIONS:
      return {
        ...state,
        auroraCollections: action.payload,
      };
    case genActionTypes.SET_CELO_COLLECTIONS:
      return {
        ...state,
        celoCollections: action.payload,
      };
    case genActionTypes.SET_POLYGON_COLLECTIONS:
      return {
        ...state,
        polygonCollections: action.payload,
      };
    case genActionTypes.GRAPH_COLLECTIONS:
      return {
        ...state,
        graphCollections: action.payload,
      };
    case genActionTypes.SET_SINGLE_NFTS:
      return {
        ...state,
        singleNfts: action.payload,
      };
    case genActionTypes.SET_ALGO_SINGLE_NFTS:
      return {
        ...state,
        singleAlgoNfts: action.payload,
      };
    case genActionTypes.SET_ALL_NFTS:
      return {
        ...state,
        allChainsNfts: action.payload,
      };
    case genActionTypes.SET_AURORA_SINGLE_NFTS:
      return {
        ...state,
        singleAuroraNfts: action.payload,
      };
    case genActionTypes.SET_POLYGON_SINGLE_NFTS:
      return {
        ...state,
        singlePolygonNfts: action.payload,
      };
    case genActionTypes.SET_NEAR_SINGLE_NFTS:
      return {
        ...state,
        singleNearNfts: action.payload,
      };
    case genActionTypes.SET_ARBITRUM_SINGLE_NFTS:
      return {
        ...state,
        singleArbitrumNfts: action.payload,
      };
    case genActionTypes.SET_AVAX_SINGLE_NFTS:
      return {
        ...state,
        singleAvaxNfts: action.payload,
      };
    case genActionTypes.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };
    case genActionTypes.SET_SWITCH_WALLET_NOTIFICATION:
      return {
        ...state,
        switchWalletNotification: action.payload,
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
    case genActionTypes.TOGGLE_WALLET_POPUP:
      return {
        ...state,
        toggleWalletPopup: action.payload,
      };
    case genActionTypes.SET_ACTIVE_COLLECTION:
      return {
        ...state,
        activeCollection: action.payload,
      };
    case genActionTypes.SET_IMAGE_QUALITY:
      return {
        ...state,
        imageQuality: action.payload,
      };
    case genActionTypes.SET_ZIP:
      return {
        ...state,
        zip: action.payload,
      };
    case genActionTypes.CONNECT_FROM_MINT:
      return {
        ...state,
        connectFromMint: action.payload,
      };
    case genActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case genActionTypes.SET_IMAGE_ACTION:
      return {
        ...state,
        imageAction: action.payload,
      };
    case genActionTypes.SET_LAYER_ACTION:
      return {
        ...state,
        layerAction: action.payload,
      };
    case genActionTypes.SET_CURRENT_SESSION:
      return {
        ...state,
        sessionId: action.payload,
      };
    case genActionTypes.SET_SESSION:
      return {
        ...state,
        sessions: action.payload,
      };
    case genActionTypes.TOGGLE_SESSION_MODAL:
      return {
        ...state,
        toggleSessionModal: action.payload,
      };
    case genActionTypes.TOGGLE_COLLECTION_NAME_MODAL:
      return {
        ...state,
        toggleCollectionNameModal: action.payload,
      };
    case genActionTypes.SET_CURRENT_PLAN:
      return {
        ...state,
        currentPlan: action.payload,
      };
    case genActionTypes.SET_PROPOSED_PLAN:
      return {
        ...state,
        proposedPlan: action.payload,
      };
    case genActionTypes.SET_UPGRADE_PLAN:
      return {
        ...state,
        upgradePlan: action.payload,
      };
    case genActionTypes.SET_ACTION_PROGRESS:
      return {
        ...state,
        actionProgress: action.payload,
      };
    case genActionTypes.SET_MINTER:
      return {
        ...state,
        minter: action.payload,
      };
    case genActionTypes.TOGGLE_UPGRADE_MODAL:
      return {
        ...state,
        toggleUpgradeModal: action.payload,
      };
    case genActionTypes.SET_SEARCH_cONTAINER:
      return {
        ...state,
        searchContainer: { ...state.searchContainer, ...action.payload },
      };
    case genActionTypes.SET_PRICE_FEED:
      return {
        ...state,
        priceFeed: { ...state.priceFeed, ...action.payload },
      };
    case genActionTypes.SET_IS_USER:
      return {
        ...state,
        isUser: action.payload,
      };
    default:
      return state;
  }
};
