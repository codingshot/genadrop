import { useReducer, createContext } from 'react';
import { genReducer, INITIAL_STATE } from './gen.reducer';

export const GenContext = createContext();

const GenContextProvider = ({ children }) => {

  const [state, dispatch] = useReducer(genReducer, INITIAL_STATE)

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
    account,
    rule,
    isRule,
    collections,
    notification,
    clipboardMessage,
    loaderMessage,
    collectionDescription,
    didMount
  } = state;

  // console.log("preview => ", preview);
  // console.log("layers => ", layers );
  // console.log("mintAmount =>", mintAmount)
  // console.log("nftLayers => ", nftLayers)
  // console.log("combinations => ", combinations)
  // console.log("isLoading => ", isLoading)
  // console.log("isLoading => ", mintInfo)
  // console.log("currentDnaLayers => ", currentDnaLayers)
  // console.log("collectionName =>", collectionName)
  // console.log("connector => ", connector)
  // console.log("account =>", account)
  // console.log("rule =>", rule)
  // console.log("isRule =>", isRule)
  // console.log("collections =>", collections)
  // console.log("notification =>", notification);
  // console.log("clipboardMessage =>", clipboardMessage);
  // console.log("loaderMessage =>", loaderMessage);
  // console.log("collectionDescription =>", collectionDescription);
  // console.log("didMount =>", didMount);

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
      account,
      rule,
      isRule,
      collections,
      notification,
      clipboardMessage,
      loaderMessage,
      collectionDescription,
      didMount,
      dispatch
    }}>
      {children}
    </GenContext.Provider>
  )
}

export default GenContextProvider;