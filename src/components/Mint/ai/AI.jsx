/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import classes from "./ai.module.css";
import { ReactComponent as RefreshIcon } from "../../../assets/mint-ai-page/refresh_icon.svg";

import { setNotification, setOverlay } from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";
import cartonist from "../../../assets/ai-art-style/cartoonist.png";
import paint from "../../../assets/ai-art-style/paint.png";
import retrofuturism from "../../../assets/ai-art-style/retrofuturism.png";
import surreal from "../../../assets/ai-art-style/surreal.png";
import throwback from "../../../assets/ai-art-style/throwback.png";
import NotIcon from "../../../assets/ai-art-style/not-icon.svg";
import { ReactComponent as PlusIcon } from "../../../assets/ai-mint-plus.svg";
import { ReactComponent as PreviewImageIcon } from "../../../assets/ai-preview.svg";
import axios from "axios";

const AI = () => {
  const [wordCount, setWordCount] = useState(0);
  // const [imageDimension, setImageDimension] = useState(256);
  const [promptText, setPromptText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { dispatch } = useContext(GenContext);
  const [generated, setGenerated] = useState(false);
  const [imageBlob, setImageBlob] = useState("");
  // const [isStyleSelected, setIsStyleSelected] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);
  const [load, setLoad] = useState(false);

  const history = useHistory();

  const aiDescHandler = (e) => {
    setPromptText(e.target.value);
    setWordCount(String(promptText.trim().length));
  };

  // const imageDimensionChangeHandler = (e) => {
  //   setImageDimension(e.target.value.trim());
  // };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    generateIamgeRequest();
  };

  const downloadImage = async (e) => {
    e.preventDefault();
    dispatch(setOverlay(true));

    const blobUrl = window.URL.createObjectURL(imageBlob);
    const a = document.createElement("a");
    a.download = `genadrop-ai-@${Date.now()}.png`;
    a.href = blobUrl;
    a.click();
    a.remove();
    dispatch(setOverlay(false));
  };

  const getReqOptions = (data) => {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  };

  const generateIamgeRequest = async () => {
    setLoad(true);

    if (promptText === "") {
      dispatch(
        setNotification({
          message: "Please Enter prompt",
          type: "warning",
        })
      );
    } else {
      try {
        dispatch(setOverlay(true));

        console.log("LAVENDER", promptText)

        const gen_image = await axios.post(
          `${process.env.REACT_APP_BACKEND}/generate-image`,
          {
            prompt: promptText,
            n: 1,
            size: String(`${512}x${512}`),
          },
          {
            auth: {
              username: process.env.REACT_APP_USERNAME,
              password: process.env.REACT_APP_PASSWORD,
            },
          }
        );

        if (gen_image.status !== 200) {
          dispatch(setOverlay(false));
          setGenerated(false);
          dispatch(setNotification({ message: "Image could not be generated", type: "error" }));
        }

        const res_data = gen_image.data;
        console.log("AFTERSHAVE...", res_data);
        setImageUrl(res_data.content[0].url);
        dispatch(setNotification({ message: "Preparing your image", type: "success" }));

        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND}/blob`,
          {
            imageUri: res_data.content[0].url,
            fileName: promptText,
          },
          {
            auth: {
              username: process.env.REACT_APP_USERNAME,
              password: process.env.REACT_APP_PASSWORD,
            },
          }
        );
        const ui8A = new Uint8Array(Object.values(response.data.content));
        const blob = new File([ui8A], "AIGenerated", { type: "PNG" });
        //await axios.get(res_data.content[0].url, { responseType: 'blob' });
        setImageBlob(blob);
        dispatch(setOverlay(false));
        dispatch(setNotification({ message: "Ready to mint", type: "success" }));
        setTimeout(() => {
          setLoad(false);
        }, 5000);
        setGenerated(true);

        // await fetch(
        //   `${process.env.REACT_APP_TWITTER_BACKEND}genImage`,
        //   getReqOptions({
        //     prompt: promptText,
        //     n: 1,
        //     size: String(`${512}x${512}`),
        //   })
        // )
        //   .then(async (response) => {
        //     if (!response.ok) {
        //       dispatch(setOverlay(false));
        //       setGenerated(false);
        //       dispatch(setNotification({ message: "Image could not be generated", type: "error" }));
        //     }

        //     return response.json();
        //   })
        //   .then((data) => {
        //     setImageUrl(data.data.data[0]?.url);
        //     dispatch(setNotification({ message: "Preparing your image", type: "success" }));
        //     fetch(
        //       `${process.env.REACT_APP_TWITTER_BACKEND}singleImage`,
        //       getReqOptions({
        //         uri: data?.data?.data[0].url,
        //       })
        //     ).then(async (response) => {
        //       const blob = await response.blob();
        //       setImageBlob(blob);
        //       dispatch(setOverlay(false));
        //       dispatch(setNotification({ message: "Ready to mint", type: "success" }));
        //       setTimeout(() => {
        //         setLoad(false);
        //       }, 5000);
        //     });
        //     setGenerated(true);
        //   });
      } catch (error) {
        dispatch(setNotification({ message: "Image could not be generated please try another prompt", type: "error" }));
        console.log(error);
      }
    }
  };

  const SUGGESTIONS = [
    "A giant donught on the road close to a  mountain",
    "Photo of a futuristic car in the garage",
    "A couple riding a dolphin on the race track",
    "a cow riding a bike through Miami streets",
  ];

  const artStyles = [
    { styleImage: NotIcon, styleName: "No Style" },
    { styleImage: surreal, styleName: "Surreal" },
    { styleImage: paint, styleName: "Painting" },
    { styleImage: retrofuturism, styleName: "Retro-futuristic" },
    { styleImage: throwback, styleName: "Throw back" },
    { styleImage: cartonist, styleName: "Cartoonist" },
  ];

  // const artStyleClickHandler = () => {
  //   setIsStyleSelected(true);
  //   alert("clicked here");
  // };

  useEffect(() => {
    setComingSoon(true);
  }, []);

  const artStyleList = artStyles.map((artStyle, key) => {
    return (
      <span className={classes.artIndStyle}>
        <div className={classes.artStyleArea}>
          <img
            src={artStyle.styleImage}
            alt={artStyle.styleName}
            className={`${classes.artStyle} ${key === 0 && classes.noArtStyle} ${
              key > 0 && comingSoon && classes.lowBrightness
            }`}
          />
          {key > 0 && comingSoon && (
            <div className={classes.comingSoonOverlay}>
              <span className={`${classes.comingSoonText}`}>Coming Soon</span>
            </div>
          )}
        </div>
        <p className={`${key > 0 && comingSoon && classes.comingSoon}`}>{artStyle.styleName}</p>
      </span>
    );
  });
  const suggestedPrompts = SUGGESTIONS.map((item, id) => (
    <li
      id={id}
      className={classes.suggestionItem}
      onClick={() => {
        setPromptText(item);
        setWordCount(String(item.length));
      }}
    >
      <span>{item}</span>
      <PlusIcon />
    </li>
  ));

  const navigateBackHandler = () => {
    setGenerated(false);
  };

  const aiMintHandler = () => {
    const aiData = {
      image: imageBlob,
      title: promptText,
      imageUrl,
      attributes: {
        0: { trait_type: "File Type", value: "PNG" },
        1: { trait_type: "Category", value: "AI" },
      },
    };
    history.push("/mint/ai/minter", { data: JSON.stringify(aiData) });
  };
  return (
    <>
      <header className={classes.aiPageHeader}>
        <h2>Create Art with A.I</h2>
        <p>With our AI, you can easily create unique works of art just by describing the vision in your mind.</p>
      </header>
      <main className={classes.aiMain}>
        <section className={classes.peviewSizeSection}>
          {load ? (
            <div style={{ width: "98%" }} className={classes.loader}>
              <Skeleton count={1} height={10} className={classes.loaderWidth} />
              <Skeleton count={1} height={405} className={classes.loaderWidth} />
              <Skeleton count={1} height={10} className={classes.loaderWidth} />
            </div>
          ) : (
            <div className={classes.artPreview} style={{ backgroundImage: `url(${imageUrl})` }}>
              {generated ? (
                <button
                  type="submit"
                  className={`${classes.wrapper} ${classes.imageDownloadBtn} ${classes.createImageBtn} ${classes.createImageBtn_active}`}
                  onClick={generateIamgeRequest}
                >
                  <span className={classes.downloadText}>Regenerate</span>
                  <RefreshIcon />
                </button>
              ) : (
                <div className={classes.defaultPreviewContent}>
                  <PreviewImageIcon />
                  <p>Generated images will appear here!</p>
                </div>
              )}
            </div>
          )}
        </section>
        <section className={`${classes.wrapper} ${classes.aiLeft}`}>
          <form className={classes.promptForm} onSubmit={formSubmitHandler}>
            <div className={classes.promptFormTop}>
              <h3 className={classes.promtFormTitle}>Describe the image you want to see</h3>
              <span className={classes.descWordCount}>{wordCount}/200</span>
            </div>
            <textarea
              name="prompt"
              id="prompt"
              className={`${classes.wrapper} ${classes.aiTextInput}`}
              value={promptText}
              onChange={aiDescHandler}
              onBlur={aiDescHandler}
              cols="6"
              rows="10"
              placeholder="E.g: A man in a blue Suite"
              autoFocus
            />
            <section className={classes.aiInspirationSection}>
              <h3 className={classes.promtFormTitle}>Need Inspiration?</h3>
              <ul className={classes.aiPromptSuggestions}>{suggestedPrompts}</ul>
            </section>
            {/* <section className={classes.artStyleSection}>
              <h2 className={classes.artStyleTitle}>Art Style</h2>
              <main className={classes.artStyleList}>{artStyleList}</main>
            </section> */}
            <div className={classes.createBtn}>
              {!generated && (
                <button
                  type="submit"
                  className={`${classes.wrapper} ${classes.createImageBtn} ${classes.topMintBtn} ${
                    wordCount > 0 ? classes.createImageBtn_active : classes.createImageBtn_inactive
                  }`}
                >
                  Create Image
                </button>
              )}
            </div>
          </form>
          {generated && (
            <div className={classes.footerBtn}>
              <div className={`${classes.mintBtns} ${classes.fixedBtns}`}>
                <button
                  type="submit"
                  className={`${classes.wrapper} ${classes.createImageBtn} ${classes.createImageBtn_active}`}
                  style={{ margin: "1em 0.5em" }}
                  onClick={aiMintHandler}
                >
                  Mint Image
                </button>
              </div>
              <button
                type="submit"
                className={`${classes.wrapper} ${classes.downloadBtn}`}
                style={{ margin: "1em 0.5em" }}
                onClick={downloadImage}
              >
                Download
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default AI;
