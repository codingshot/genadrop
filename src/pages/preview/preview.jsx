/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect, useState } from "react";
import classes from "./preview.module.css";
import { GenContext } from "../../gen-state/gen.context";
import { deleteAsset, setMintAmount, setMintInfo, promptDeleteAsset } from "../../gen-state/gen.actions";
import Sidebar from "./sidebar/sidebar";
import ArtCard from "./art-card/artCard";
import Navbar from "./navbar/navbar";
import SelectedGifArt from "./selected-gif-art/selectedGifArt";
import PageControl from "./page-control/pageControl";
import GifModal from "./gif-modal/gifModal";
import SubscriptionNotification from "../../components/Subscription-Notification/SubscriptionNotification";

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
    currentPlan,
  } = useContext(GenContext);

  const [state, setState] = useState({
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,
    enableAllDescription: true,
    duration: "",
    gifShow: null,
    toggleGuide: false,
    gifs: [],
    gifImages: [],
    editorAction: { index: "", id: "" },
  });

  const {
    currentPage,
    paginate,
    currentPageValue,
    enableAllDescription,
    gifShow,
    gifs,
    gifImages,
    duration,
    toggleGuide,
  } = state;

  const canvas = document.createElement("canvas");

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const previewProps = {
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
    enableAllDescription,
    gifShow,
    gifs,
    gifImages,
    duration,
    toggleGuide,
    canvas,
    currentPage,
    currentPageValue,
    paginate,
    currentPlan,
    handleSetState,
  };

  const handlePrev = () => {
    if (currentPage <= 1) return;
    handleSetState({ currentPage: currentPage - 1 });
    document.documentElement.scrollTop = 0;
  };

  const handleNext = () => {
    if (currentPage >= Object.keys(paginate).length) return;
    handleSetState({ currentPage: currentPage + 1 });
    document.documentElement.scrollTop = 0;
  };

  const handleGoto = () => {
    if (currentPageValue < 1 || currentPageValue > Object.keys(paginate).length) return;
    handleSetState({ currentPage: Number(currentPageValue) });
    document.documentElement.scrollTop = 0;
  };

  useEffect(() => {
    dispatch(setMintInfo(""));
  }, [dispatch, mintAmount]);

  useEffect(() => {
    const countPerPage = 20;
    const numberOfPages = Math.ceil(nftLayers.length / countPerPage);
    let startIndex = 0;
    let endIndex = startIndex + countPerPage;
    const paginateObj = {};
    for (let i = 1; i <= numberOfPages; i += 1) {
      paginateObj[i] = nftLayers.slice(startIndex, endIndex);
      startIndex = endIndex;
      endIndex = startIndex + countPerPage;
    }
    handleSetState({ paginate: paginateObj });
  }, [nftLayers]);

  useEffect(() => {
    if (promptAsset) {
      dispatch(deleteAsset(promptAsset));
      dispatch(setMintAmount(mintAmount - 1));
      dispatch(promptDeleteAsset(null));
    }
  }, [promptAsset]);

  return (
    <div className={classes.wrapper}>
      <SubscriptionNotification />
      <Navbar navbarProps={previewProps} />
      <div className={classes.container}>
        <Sidebar sidebarProps={previewProps} />
        <div className={classes.display}>
          <div className={classes.preview}>
            {Object.keys(paginate).length
              ? paginate[currentPage].map((asset, index) => {
                  return <ArtCard key={index} asset={{ index, ...asset }} previewProps={previewProps} />;
                })
              : null}
          </div>
          {gifShow && gifImages.length > 0 && <SelectedGifArt selectedProps={previewProps} />}
        </div>
      </div>
      <PageControl controProps={{ handleNext, handlePrev, handleGoto, ...previewProps }} />
      <GifModal modalProps={{ ...previewProps }} />
    </div>
  );
};

export default Preview;
