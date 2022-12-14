import React from "react";
import { useState } from "react";
import classes from "./ai.module.css";

const AI = () => {
  const [wordCount, setWordCount] = useState(0);

  const handleAiDesc = (e) => {
    // e.target.value.length;
    // console.log({ value: e.target.value, number: String(e.target.value).length });
    setWordCount(String(e.target.value).trim().length);
  };
  return (
    <main className={classes.aiMain}>
      <section className={classes.wrapper || classes.aiLeft}>
        <form className={classes.promptForm}>
          <div className={classes.promptFormTop}>
            <h2 className={classes.promtFormTitle}>Enter prompt</h2>
            <span className={classes.descWordCount}>{wordCount}/200</span>
          </div>
          <input type="text" className={classes.wrapper || classes.aiTextInput} onChange={handleAiDesc} />
          <section className={classes.artStyleSection}>
            <h2 className={classes.artStyle}>Art Style</h2>
            <main className={classes.artStyleList}></main>
          </section>
          <button className={classes.wrapper || classes.createImageBtn}>Create Image</button>
        </form>
      </section>
      <section className={classes.aiRight}>
        <form className={classes.previewSizeForm}>
          <section className={classes.imageSizeSection}>
            <label htmlFor="height">
              <span>Height</span>
              <input type="number" className={classes.sizeInput} name="height" /> <span>px</span>
            </label>
            <label htmlFor="width">
              <span>Width</span>
              <input type="number" className={classes.sizeInput} name="width" /> <span>px</span>
            </label>
          </section>
          <output className={classes.artPreview} />
        </form>
      </section>
    </main>
  );
};

export default AI;
