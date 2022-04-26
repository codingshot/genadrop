import React, { useContext, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { v4 as uuid } from "uuid";
import classes from "./preview.module.css";
import { GenContext } from "../../gen-state/gen.context";
import {
  addDescription,
  deleteAsset,
  renameAsset,
  setCollectionDescription,
  setCollectionName,
  setNotification,
  setLoader,
  setMintAmount,
  setMintInfo,
  setNftLayers,
  setOutputFormat,
  setPrompt,
  promptDeleteAsset,
} from "../../gen-state/gen.actions";
import { createUniqueLayer, generateArt } from "./preview-script";
import TextEditor from "./text-editor";
import { getDefaultName } from "../../utils";
import { handleDownload } from "../../utils/index2";
import { fetchCollections } from "../../utils/firebase";
import arrowIconLeft from "../../assets/icon-arrow-left.svg";
import closeIcon from "../../assets/icon-close.svg";
import checkIcon from "../../assets/check-solid.svg";
import warnIcon from "../../assets/icon-warn.svg";

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
  } = useContext(GenContext);

  const [state, setState] = useState({
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,
    enableAllDescription: true,
    duration: 0,
    gifShow: null,
    gifImages: [],
    editorAction: { index: "", id: "" },
  });

  const { currentPage, paginate, currentPageValue, enableAllDescription, gifShow, gifImages, duration } = state;
  const ipfsRef = useRef(null);
  const arweaveRef = useRef(null);
  const history = useHistory();
  const canvas = document.createElement("canvas");

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleDeleteAndReplace = async (id, index, currentPageD) => {
    if (!(combinations - rule.length - mintAmount)) {
      dispatch(setMintInfo("  cannot generate asset from 0 combination"));
    } else {
      dispatch(setLoader("generating..."));
      dispatch(setMintInfo(""));
      const newLayer = await createUniqueLayer({
        dispatch,
        setLoader,
        collectionName,
        collectionDescription,
        index,
        currentPage: currentPageD,
        layers: currentDnaLayers,
        rule,
        nftLayers,
        id,
        mintAmount,
      });
      const art = await generateArt({
        dispatch,
        setLoader,
        layer: newLayer,
        canvas,
        image: layers[0].traits[0].image,
      });
      const newLayers = nftLayers.map((asset) =>
        asset.id === newLayer.id ? { ...newLayer, image: art.imageUrl } : asset
      );
      dispatch(setLoader(""));
      dispatch(setNftLayers(newLayers));
    }
  };

  const handleDelete = (val) => {
    dispatch(setPrompt(promptDeleteAsset(val)));
  };

  const handleRename = (input) => {
    if (!input.value) {
      dispatch(
        renameAsset({
          id: input.id,
          name: `${collectionName} ${getDefaultName(input.index + 1)}`.trim(),
        })
      );
    } else {
      dispatch(renameAsset({ id: input.id, name: input.value }));
    }
  };

  const handleDescription = (input) => {
    dispatch(addDescription({ id: input.id, description: input.value }));
  };
  const getCollectionsNames = async () => {
    const collections = await fetchCollections();
    const names = [];
    collections.forEach((col) => {
      names.push(col.name);
    });
    return names;
  };

  const handleCollectionName = async (value) => {
    try {
      dispatch(setLoader("saving..."));
      const names = await getCollectionsNames();
      const isUnique = names.find((name) => name.toLowerCase() === value.toLowerCase());
      if (isUnique) {
        dispatch(
          setNotification({
            message: `${value} already exist. try choose another name`,
            type: "warning",
          })
        );
      } else {
        dispatch(setCollectionName(value));
        const newLayers = nftLayers.map((asset, idx) => ({
          ...asset,
          name: `${value} ${getDefaultName(idx + 1)}`.trim(),
        }));
        dispatch(setNftLayers(newLayers));
      }
    } catch (error) {
      dispatch(
        setNotification({
          message: "could not save your collection name, please try again.",
          type: "error",
        })
      );
    }
    dispatch(setLoader(""));
  };

  const handleCollectionDescription = (event) => {
    if (enableAllDescription) {
      const newLayers = nftLayers.map((asset) => ({
        ...asset,
        description: event.target.value,
      }));
      dispatch(setNftLayers(newLayers));
    }
    dispatch(setCollectionDescription(event.target.value));
  };

  const handleFormatChange = (val) => {
    if (val === "ipfs") {
      ipfsRef.current.checked = true;
      dispatch(setOutputFormat("ipfs"));
    } else if (val === "arweave") {
      arweaveRef.current.checked = true;
      dispatch(setOutputFormat("arweave"));
    }
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

  const addGif = (asset) => {
    if (gifImages.filter((e) => e.id === asset.id).length > 0) {
      const newImgs = gifImages.filter((e) => e.id !== asset.id);
      handleSetState({ gifImages: newImgs });
    } else {
      handleSetState({ gifImages: [...gifImages, asset] });
    }
  };

  const generateGif = () => {
    dispatch(setLoader("generating..."));
    const urls = gifImages.map((img) => img.image);
    const attributes = gifImages.map((img) => img.attributes);
    if (duration < 1) {
      return dispatch(setNotification("please enter a valid duration."));
    }
    if (gifImages.length < 2) {
      return dispatch(setNotification("please select the images."));
    }
    axios.post(`https://gif-generator-api.herokuapp.com/`, { urls, duration }).then((res) => {
      dispatch(setLoader(""));
      dispatch(
        setNftLayers([
          ...nftLayers,
          {
            id: uuid(),
            attributes,
            description: "",
            image: res.data.data,
            name: getDefaultName(nftLayers.length + 1),
          },
        ])
      );
      handleSetState({ gifShow: false });
      dispatch(setLoader(""));
    });
  };

  return (
    <div className={classes.wrapper}>
      <div onClick={() => history.goBack()} className={`${classes.backBtn} ${classes.mobile}`}>
        <img src={arrowIconLeft} alt="" />
      </div>
      <div className={classes.container}>
        <aside className={classes.sidebar}>
          <div className={classes.collectionDetail}>
            <div className={classes.tab}>
              <h3>Collection Name </h3>
            </div>
            <div className={classes.wrapper}>
              <TextEditor
                placeholder={collectionName || "collectionName"}
                submitHandler={handleCollectionName}
                invert
              />
            </div>

            <div className={classes.tab}>
              <h3>Collection Description </h3>
              <div
                onClick={() =>
                  handleSetState({
                    enableAllDescription: !enableAllDescription,
                  })
                }
                className={`${classes.toggleContainer}  ${enableAllDescription && classes.active}`}
              >
                <div className={`${classes.toggle} ${enableAllDescription && classes.active}`} />
              </div>
            </div>
            <div className={classes.wrapper}>
              <textarea
                name="description"
                value={collectionDescription}
                rows="4"
                placeholder="description"
                onChange={handleCollectionDescription}
              />
            </div>
          </div>
          <div className={classes.actionContainer}>
            <h3>Use Format</h3>
            <label htmlFor="ipfs" onClick={() => handleFormatChange("ipfs")}>
              <input
                ref={ipfsRef}
                type="radio"
                name="format"
                value="ipfs"
                defaultChecked
                className={`${classes.radioBtn} ${outputFormat === "ipfs" && classes.clicked}`}
              />
              <p>IPFS</p>
            </label>
            <label htmlFor="arweave" onClick={() => handleFormatChange("arweave")}>
              <input
                ref={arweaveRef}
                type="radio"
                name="format"
                value="arweave"
                className={`${classes.radioBtn} ${outputFormat === "arweave" && classes.clicked}`}
              />
              <p>Arweave</p>
            </label>
            <button className={classes.gifButton} type="button">
              {!gifShow && <span onClick={() => handleSetState({ gifShow: true })}>Genrate GIF</span>}
            </button>

            {gifShow && (
              <div>
                <div className={classes.durationField}>
                  <p>Duration</p>
                  <div>
                    <span>s</span>
                    <input onChange={(e) => handleSetState({ duration: e.target.value })} type="number" />
                  </div>
                </div>
                <div className={classes.mintButtonWrapper}>
                  <button type="button" onClick={generateGif} className={classes.mintBtn}>
                    Done
                  </button>
                  <button type="button" onClick={() => handleSetState({ gifShow: null })} className={classes.cancelBtn}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {/* {gifShow && gifImages.length > 1 && <span>Done</span>}
              {gifShow && <span onClick={() => handleSetState({ gifShow: null })}>Close</span>} */}

            <button
              type="button"
              onClick={() =>
                handleDownload({
                  window,
                  dispatch,
                  setLoader,
                  setNotification,
                  value: nftLayers,
                  name: collectionName,
                  outputFormat,
                })
              }
            >
              Download zip
            </button>
          </div>
        </aside>

        <main className={classes.main}>
          <div className={classes.detailsView}>
            <div onClick={() => history.goBack()} className={classes.backBtn}>
              <img src={arrowIconLeft} alt="" />
            </div>
            <div className={classes.detailsWrapper}>
              <div className={classes.detail}>
                <span>Number of Generative Arts</span>
                <span>{nftLayers.length}</span>
              </div>
              <div className={classes.detail}>
                {mintInfo ? <img src={warnIcon} alt="" /> : null}
                <span>Unused Combinations</span>
                <span>{combinations - mintAmount - rule.length}</span>
              </div>
            </div>
          </div>

          <div className={classes.preview}>
            {Object.keys(paginate).length
              ? paginate[currentPage].map((asset, index) => {
                  const { image, id, name, description } = asset;
                  return (
                    <div key={id} className={classes.card}>
                      <img className={classes.asset} src={image} alt="" />
                      <div className={classes.cardBody}>
                        <div className={classes.textWrapper}>
                          <TextEditor
                            placeholder={name}
                            submitHandler={(value) => handleRename({ value, id, index })}
                          />
                        </div>
                        <textarea
                          name="description"
                          value={description}
                          cols="30"
                          rows="3"
                          placeholder="description"
                          onChange={(e) =>
                            handleDescription({
                              value: e.target.value,
                              id,
                              index,
                            })
                          }
                        />
                        <div className={classes.buttonContainer}>
                          <button
                            type="button"
                            onClick={() =>
                              handleDownload({
                                window,
                                dispatch,
                                setLoader,
                                setNotification,
                                value: [asset],
                                name: asset.name,
                                outputFormat,
                                single: true,
                              })
                            }
                          >
                            Download
                          </button>
                          <button type="button" onClick={() => handleDeleteAndReplace(id, index, currentPage)}>
                            Generate New
                          </button>
                        </div>
                      </div>
                      {!gifShow && (
                        <div onClick={() => handleDelete(id)} className={classes.iconClose}>
                          <img src={closeIcon} alt="" />
                        </div>
                      )}
                      {gifShow && (
                        <div
                          onClick={() => addGif(asset)}
                          className={`${classes.iconClose} ${
                            gifImages.filter((e) => e.id === id).length > 0 ? classes.cheked : ""
                          }`}
                        >
                          <img src={checkIcon} alt="" />
                        </div>
                      )}
                    </div>
                  );
                })
              : null}
          </div>
          {gifShow && gifImages.length > 0 && (
            <div className={classes.galleryGif}>
              {gifImages.map((img) => (
                <div>
                  {gifShow && (
                    <div onClick={() => addGif(img)} className={classes.iconClose}>
                      <img src={closeIcon} alt="" />
                    </div>
                  )}
                  <img src={img.image} alt="gifIMG" />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <div className={classes.paginate}>
        <div onClick={handlePrev} className={classes.pageControl}>
          prev
        </div>
        <div className={classes.pageCount}>
          {currentPage} of {Object.keys(paginate).length}
        </div>
        <div onClick={handleNext} className={classes.pageControl}>
          next
        </div>
        <div onClick={handleGoto} className={classes.pageControl}>
          goto
        </div>
        <input
          type="number"
          value={currentPageValue}
          onChange={(event) => handleSetState({ currentPageValue: event.target.value })}
        />
      </div>
    </div>
  );
};

export default Preview;
