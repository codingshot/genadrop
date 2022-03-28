import React, { useReducer, createContext } from 'react';

import { genReducer, INITIAL_STATE } from './gen.reducer';

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
  } = state;

  return (
    <GenContext.Provider value={{
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
      singleNfts,
      dispatch
    }}>
      {children}
    </GenContext.Provider>
  );
};

export default GenContextProvider;
