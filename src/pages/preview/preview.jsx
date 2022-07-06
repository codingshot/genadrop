import { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import Display from "./Display/Display";
import Nav from "./Nav/Nav";
import classes from "./preview.module.css";
import Sidebar from "./Sidebar/Sidebar";

const Preview = () => {
  const {
    nftLayers,
    currentDnaLayers,
    dispatch,
    combinations,
    mintAmount,
    mintInfo,
    collectionName,
    collectionDescription,
    outputFormat,
    rule,
    layers,
    promptAsset,
    imageQuality,
  } = useContext(GenContext);

  const [state, setState] = useState({
    enableAllDescription: true,
    duration: "",
    gifShow: null,
    toggleGuide: false,
    gifs: [],
    gifImages: [],
    editorAction: { index: "", id: "" },
  });

  const { enableAllDescription, gifShow, gifs, gifImages, duration, toggleGuide } = state;

  const ipfsRef = useRef(null);
  const arweaveRef = useRef(null);
  const history = useHistory();
  const canvas = document.createElement("canvas");

  // useEffect(() => {
  //   dispatch(setMintInfo(""));
  // }, [dispatch, mintAmount]);

  // useEffect(() => {
  //   if (promptAsset) {
  //     dispatch(deleteAsset(promptAsset));
  //     dispatch(setMintAmount(mintAmount - 1));
  //     dispatch(promptDeleteAsset(null));
  //   }
  // }, [promptAsset]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <Nav />
        <div className={classes.displayWrapper}>
          <Sidebar />
          <Display nftLayers={nftLayers} />
        </div>
      </div>
    </div>
  );
};

export default Preview;
