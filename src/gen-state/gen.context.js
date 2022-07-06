import React, { useReducer, createContext } from "react";
import { genReducer, INITIAL_STATE } from "./gen.reducer";

export const GenContext = createContext();

const GenContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(genReducer, INITIAL_STATE);

  const {
    layers,
    preview,
    mintAmount,
    nftLayers,
    combinations,
    isLoading,
    mintInfo,
    currentDnaLayers,
    collectionName,
    outputFormat,
    connector,
    chainId,
    proposedChain,
    account,
    rule,
    isRule,
    collections,
    algoCollections,
    auroraCollections,
    polygonCollections,
    singleAuroraNfts,
    singleAlgoNfts,
    singlePolygonNfts,
    graphCollections,
    singleNfts,
    notification,
    switchWalletNotification,
    clipboardMessage,
    loaderMessage,
    collectionDescription,
    didMount,
    mainnet,
    prompt,
    promptAsset,
    promptLayer,
    promptRules,
    toggleWalletPopup,
    activeCollection,
    imageQuality,
    zip,
  } = state;

  return (
    <GenContext.Provider
      value={{
        layers,
        preview,
        mintAmount,
        nftLayers,
        combinations,
        isLoading,
        mintInfo,
        currentDnaLayers,
        collectionName,
        outputFormat,
        connector,
        chainId,
        proposedChain,
        account,
        graphCollections,
        rule,
        isRule,
        collections,
        notification,
        switchWalletNotification,
        clipboardMessage,
        loaderMessage,
        collectionDescription,
        didMount,
        mainnet,
        singleNfts,
        prompt,
        promptAsset,
        promptLayer,
        promptRules,
        algoCollections,
        auroraCollections,
        polygonCollections,
        singleAuroraNfts,
        singleAlgoNfts,
        singlePolygonNfts,
        toggleWalletPopup,
        activeCollection,
        imageQuality,
        zip,
        dispatch,
      }}
    >
      {children}
    </GenContext.Provider>
  );
};

export default GenContextProvider;
