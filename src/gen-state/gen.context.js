import { useReducer, createContext } from 'react';
import { genReducer, INITIAL_STATE } from './gen.reducer';

export const GenContext = createContext();

const GenContextProvider = ({ children }) => {

  const [state, dispatch] = useReducer(genReducer, INITIAL_STATE)

  const { layers,
    preview,
    mintAmount,
    nftLayers,
    combinations,
    isLoading,
    mintInfo,
    currentDnaLayers,
    collectionName,
    outputFormat
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
      dispatch
    }}>
      {children}
    </GenContext.Provider>
  )
}

export default GenContextProvider;