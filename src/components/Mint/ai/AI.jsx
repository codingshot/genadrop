/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import classes from "./ai.module.css";
import { ReactComponent as Download } from "../../../assets/mint-ai-page/download-simple.svg";
import { ReactComponent as Reload } from "../../../assets/mint-ai-page/icon-reload.svg";
import Loader from "../../Loader/Loader";
import { async } from "regenerator-runtime";

const AI = () => {
  const [wordCount, setWordCount] = useState(0);
  const [imageDimension, setImageDimension] = useState(256);
  const [downloadStatus, setDownloadStatus] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleAiDesc = (e) => {
    setPromptText(e.target.value);
    setWordCount(String(e.target.value).trim().length);
  };

  const imageDimensionChangeHandler = (e) => {
    setImageDimension(e.target.value.trim());
  };

  const imageDownloadHandler = (e) => {
    e.preventDefault();
    setDownloadStatus(true);
    alert("Download");
    downloadImage(imageUrl);
  };

  const downloadImage = async (url) => {
    await fetch(url, {
      mode: "no-cors",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = `genadrop-ai-@${Date.now()}.jpg`;
        a.href = blobUrl;
        a.click();
        a.remove();
      });
  };
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
    try {
      fetch("https://twitter-api-weber77.vercel.app/genImage", requestOptions).then(async (response) => {
        // if (!response.ok) {
        //   throw new Error("That image could not be generated");
        // }

        const data = await response.json();
        console.log(data.data.data[0].url);

        setImageUrl(data.data.data[0].url);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    generateIamgeRequest();
  }, []);

  return (
    <main className={classes.aiMain}>
      <section className={classes.wrapper || classes.aiLeft}>
        <form className={classes.promptForm} onSubmit={formSubmitHandler}>
          <div className={classes.promptFormTop}>
            <h2 className={classes.promtFormTitle}>Enter prompt</h2>
            <span className={classes.descWordCount}>{wordCount}/200</span>
          </div>
          <input
            type="text"
            className={`${classes.wrapper} ${classes.aiTextInput}`}
            onChange={handleAiDesc}
            value={promptText}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <section className={classes.artStyleSection}>
            <h2 className={classes.artStyle}>Art Style</h2>
            <main className={classes.artStyleList}></main>
          </section>
          <button type="submit" className={`${classes.wrapper} ${classes.createImageBtn}`}>
            Create Image
          </button>
        </form>
      </section>
      <form className={classes.previewSizeForm}>
        <section className={classes.imageSizeSection}>
          <h2 className={classes.aiPreviewHeading}>Preview Image</h2>
          <div className={classes.sizesMain}>
            <label htmlFor="height" className={classes.sizeLabel}>
              <span>Height</span>
              <span className={classes.sizeInWrapper}>
                <input type="text" className={classes.sizeInput} name="height" value={imageDimension} /> <span>px</span>
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
        <Loader />
        <output
          className={classes.artPreview}
          style={{ backgroundImage: `url(${imageUrl})`, width: imageDimension, height: imageDimension }}
        />
        <button
          type="submit"
          className={`${classes.wrapper} ${classes.imageDownloadBtn}`}
          onClick={imageDownloadHandler}
        >
          {downloadStatus ? <Reload /> : <Download />}
          <span>Download</span>
        </button>
      </form>
    </main>
  );
};

export default AI;
