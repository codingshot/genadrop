/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from "react";
import { async } from "regenerator-runtime";
import { useHistory } from "react-router-dom";
import classes from "./ai.module.css";
import { ReactComponent as Download } from "../../../assets/mint-ai-page/download-simple.svg";
import { ReactComponent as Reload } from "../../../assets/mint-ai-page/icon-reload.svg";
import { ReactComponent as BackArrow } from "../../../assets/arrow-left-stretched.svg";
import { setNotification, setOverlay } from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";

const AI = () => {
  const [wordCount, setWordCount] = useState(0);
  const [imageDimension, setImageDimension] = useState(256);
  const [promptText, setPromptText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { dispatch } = useContext(GenContext);
  const [generated, setGenerated] = useState(false);
  const [imageBlob, setImageBlob] = useState("");

  const history = useHistory();

  const handleAiDesc = (e) => {
    setPromptText(e.target.value);
    setWordCount(String(promptText.trim().length));
  };

  const imageDimensionChangeHandler = (e) => {
    setImageDimension(e.target.value.trim());
  };

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

        await fetch(
          `${process.env.REACT_APP_TWITTER_BACKEND}genImage`,
          getReqOptions({
            prompt: promptText,
            n: 1,
            size: String(`${512}x${512}`),
          })
        )
          .then(async (response) => {
            if (!response.ok) {
              dispatch(setOverlay(false));
              setGenerated(false);
              dispatch(setNotification({ message: "Image could not be generated", type: "error" }));
            }

            return response.json();
          })
          .then((data) => {
            setImageUrl(data.data.data[0]?.url);
            dispatch(setNotification({ message: "Preparing your image", type: "success" }));
            fetch(
              `${process.env.REACT_APP_TWITTER_BACKEND}singleImage`,
              getReqOptions({
                uri: data?.data?.data[0].url,
              })
            ).then(async (response) => {
              const blob = await response.blob();
              setImageBlob(blob);
              dispatch(setOverlay(false));
              dispatch(setNotification({ message: "Ready to mint", type: "success" }));
            });
            setGenerated(true);
          });
      } catch (error) {
        dispatch(setNotification({ message: "Image could not be generated please try another prompt", type: "error" }));
        console.log(error);
      }
    }
  };

  const SUGGESTIONS = [
    "Sunset Cliffs",
    "Fire and water",
    "Never ending flower",
    "DNA Torna",
    "An oak tree",
    "Cat on Bycicle",
  ];

  const suggestedPrompts = SUGGESTIONS.map((item, id) => (
    <li
      id={id}
      className={classes.suggestionItem}
      onClick={() => {
        setPromptText(item);
        setWordCount(String(item.length));
      }}
    >
      {item}
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
      {generated && (
        <nav className={classes.aiPageNav} onClick={navigateBackHandler}>
          <span className={classes.aiPageNavMain}>
            <BackArrow className={classes.aiPageNavBackArrow} />
            <span>Back to creation</span>
          </span>
        </nav>
      )}
      <main className={classes.aiMain}>
        <section className={classes.wrapper || classes.aiLeft}>
          {generated ? (
            <div className={classes.successPart}>
              <h2 className={classes.successPartHeading}>Mint Image</h2>
              <p className={classes.successMainText}>
                This generated image will be minted as NTF on any of the supported blockchain you select on the next
                step
              </p>
            </div>
          ) : (
            <form className={classes.promptForm} onSubmit={formSubmitHandler}>
              <div className={classes.promptFormTop}>
                <h2 className={classes.promtFormTitle}>Enter prompt</h2>
                <span className={classes.descWordCount}>{wordCount}/200</span>
              </div>
              <input
                type="text"
                className={`${classes.wrapper} ${classes.aiTextInput}`}
                onChange={handleAiDesc}
                onBlur={handleAiDesc}
                value={promptText}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
              <ul className={classes.aiPromptSuggestions}>{suggestedPrompts}</ul>
              <section className={classes.artStyleSection}>
                <h2 className={classes.artStyle}>Art Style</h2>
                <main className={classes.artStyleList} />
              </section>
              <button
                type="submit"
                className={`${classes.wrapper} ${classes.createImageBtn} ${
                  wordCount > 0 ? classes.createImageBtn_active : classes.createImageBtn_inactive
                }`}
              >
                Create Image
              </button>
            </form>
          )}
          {generated && (
            <div className={classes.mintBtns}>
              <button
                type="submit"
                className={`${classes.wrapper} ${classes.createImageBtn} ${classes.createImageBtn_active}`}
                style={{ margin: "1em 0.5em" }}
                onClick={aiMintHandler}
              >
                Mint
              </button>
              <button
                type="submit"
                className={`${classes.wrapper} ${classes.createImageBtn} ${classes.createImageBtn_active}`}
                style={{ margin: "1em 0.5em" }}
                onClick={generateIamgeRequest}
              >
                Regenerate
              </button>
            </div>
          )}
        </section>
        <form className={classes.previewSizeForm}>
          {generated ? (
            <p className={classes.successMessage}>Successfully generated image!</p>
          ) : (
            <section className={classes.imageSizeSection}>
              <h2 className={classes.aiPreviewHeading}>Preview Image</h2>
              <div className={classes.sizesMain}>
                <label htmlFor="height" className={classes.sizeLabel}>
                  <span>Height</span>
                  <span className={classes.sizeInWrapper}>
                    <input type="text" className={classes.sizeInput} name="height" value={imageDimension} />{" "}
                    <span>px</span>
                  </span>
                </label>
                <label htmlFor="width" className={classes.sizeLabel}>
                  <span>Width</span>
                  <span className={classes.sizeInWrapper}>
                    <input
                      type="text"
                      value={imageDimension}
                      onChange={imageDimensionChangeHandler}
                      className={classes.sizeInput}
                      name="width"
                      placeholder="A pink cat painting a black dog in space"
                    />{" "}
                    <span>px</span>
                  </span>
                </label>
              </div>
            </section>
          )}
          <output
            className={classes.artPreview}
            style={{ backgroundImage: `url(${imageUrl})`, width: imageDimension, height: imageDimension }}
          />
          {generated && (
            <button type="submit" className={`${classes.wrapper} ${classes.imageDownloadBtn}`} onClick={downloadImage}>
              <Download />
              <span>Download</span>
            </button>
          )}
        </form>
      </main>
    </>
  );
};

export default AI;
