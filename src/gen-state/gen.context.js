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
    account,
    rule,
    isRule,
    collections,
    singleNfts,
    notification,
    clipboardMessage,
    loaderMessage,
    collectionDescription,
    didMount,
    mainnet,
    prompt,
    promptAsset,
    promptLayer,
    promptRules,
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
        account,
        rule,
        isRule,
        collections,
        notification,
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
        dispatch,
      }}
    >
      {children}
    </GenContext.Provider>
  );
};

export default GenContextProvider;
