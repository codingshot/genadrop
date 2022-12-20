/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from "react";
import classes from "./ai.module.css";
import { ReactComponent as Download } from "../../../assets/mint-ai-page/download-simple.svg";
import { ReactComponent as Reload } from "../../../assets/mint-ai-page/icon-reload.svg";
import { ReactComponent as BackArrow } from "../../../assets/arrow-left-stretched.svg";
import { async } from "regenerator-runtime";
import { setOverlay } from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";

const AI = () => {
  const [wordCount, setWordCount] = useState(0);
  const [imageDimension, setImageDimension] = useState(256);
  const [downloadStatus, setDownloadStatus] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { dispatch } = useContext(GenContext);
  const [generated, setGenerated] = useState(false);

  const handleAiDesc = (e) => {
    setPromptText(e.target.value);
    setWordCount(String(promptText.trim().length));
  };

  const imageDimensionChangeHandler = (e) => {
    setImageDimension(e.target.value.trim());
  };

  const imageDownloadHandler = (e) => {
    e.preventDefault();
    setDownloadStatus(!downloadStatus);
    alert("Download");
    // downloadImage();
  };

  // const downloadImage = async () => {
  //   const url =
  //     "https://oaidalleapiprodscus.blob.core.windows.net/private/org-VLqvuP3nE8JYj21Vy2JDoovx/user-OfbTsDfpcsqhy0CDvImWDAuV/img-glKvMPTUlAkzugybaoSBa7Qq.png";
  //   await fetch(url, {
  //     mode: "no-cors",
  //   })
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const blobUrl = window.URL.createObjectURL(blob);
  //       console.table({ blobURL: blobUrl });
  //       const a = document.createElement("a");
  //       a.download = `genadrop-ai-@${Date.now()}.jpg`;
  //       a.href = blobUrl;
  //       a.click();
  //       a.remove();
  //     });
  // };
  // eslint-disable-next-line no-shadow

  const formSubmitHandler = (e) => {
    e.preventDefault();

    console.table({ prompt: promptText, size: imageDimension });
    generateIamgeRequest();
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: promptText,
      n: 1,
      size: String(`${imageDimension}x${imageDimension}`),
    }),
  };

  const generateIamgeRequest = async () => {
    if (promptText === "") {
      alert("Please Enter prompt");
    } else {
      try {
        dispatch(setOverlay(true));

        await fetch("https://twitter-api-weber77.vercel.app/genImage", requestOptions)
          .then(async (response) => {
            if (!response.ok) {
              dispatch(setOverlay(false));
              setGenerated(false);
              throw new Error("That image could not be generated");
            }

            return response.json();
          })
          .then((data) => {
            dispatch(setOverlay(false));
            // console.log(data.data.data[0].url);
            // console.log(data.data.data[0].url.headers);
            setImageUrl(data.data.data[0]?.url);
            setGenerated(true);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // useEffect(() => {
  //   generateIamgeRequest();
  // }, []);

  const SUGGESTIONS = [
    "Sunset Cliffs",
    "Fire and water",
    "Never ending flower",
    "DNA Torna",
    "An oak tree",
    "Cat on Bycicle",
  ];

  const suggestedPrompts = SUGGESTIONS.map((item, id) => (
    <li id={id} className={classes.suggestionItem} onClick={() => setPromptText(item)}>
      {item}
    </li>
  ));

  const navigateBackHandler = () => {
    setGenerated(false);
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
                <main className={classes.artStyleList}></main>
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
            <button
              type="submit"
              className={`${classes.wrapper} ${classes.createImageBtn} ${classes.createImageBtn_active}`}
              style={{ margin: "1em 0.5em" }}
            >
              Mint
            </button>
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
            <button
              type="submit"
              className={`${classes.wrapper} ${classes.imageDownloadBtn}`}
              onClick={imageDownloadHandler}
            >
              {downloadStatus ? <Reload /> : <Download />}
              <span>Download</span>
            </button>
          )}
        </form>
      </main>
    </>
  );
};

export default AI;
