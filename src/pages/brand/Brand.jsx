import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import classes from "./Brand.module.css";
// color palettes
import {
  accentDarkGray,
  accentLightGray,
  brandcolor,
  fonts, // different font weights
  logos,
} from "./Brand-script";
// assets
import zipFile from "../../assets/brand/Genadrop-Logos.zip";
import { ReactComponent as BrandBg } from "../../assets/brand/brand-bg.svg";
import { ReactComponent as CopyIcon } from "../../assets/copy-solid.svg";
import { ReactComponent as CheckSolid } from "../../assets/check-solid.svg";
import { ReactComponent as DownloadArrow } from "../../assets/icon-arrow-down-long.svg";

const Brand = () => {
  const [state, setState] = useState({
    isCopied: false,
  });
  const { isCopied } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const onCopyText = () => {
    handleSetState({ isCopied: true });
    setTimeout(() => {
      handleSetState({ isCopied: false });
    }, 500);
  };
  return (
    <>
      <div className={classes.topBg}>
        <BrandBg />
      </div>
      <div className={classes.container}>
        <div className={classes.title}>
          GenaDrop <span> Brand Kit</span>
        </div>
        <div className={classes.description}>
          Download our assets if you want to create anything with our brand name on it. These files will help us define
          and build a consistent brand presence and experience across the world.
        </div>
        <div className={classes.downloadBtnWrapper}>
          <a href={zipFile} download>
            Download Logos
          </a>
          <a
            href="https://drive.google.com/file/d/1yM0OPmSxQSrzgLX7ABndGnqETTPYHCpo/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            Download Fonts
          </a>
        </div>
        <div className={classes.subHeader}>
          Logos <p />
        </div>
        <div className={classes.description}>
          Genadrop Design system is designed as a single source of truth for Genadrop’s applicaitons by Minority
          Programmers product design team.
        </div>
        <div className={classes.logoWrapper}>
          {logos.map((logo) => (
            <div key={logo.title}>
              <p>{logo.title}</p>
              <a href={logo.donwnload} download>
                {logo.logo}
                <DownloadArrow style={{ fill: logo.color }} />
              </a>
            </div>
          ))}
        </div>
        <div className={classes.subHeader}>
          Color Palettes <p />
        </div>
        <div className={classes.description}>
          Genadrop Design system is designed as a single source of truth for Genadrop’s applicaitons by Minority
          Programmers product design team.
        </div>
        <div className={classes.colorSubHeader}>Brand Color</div>
        <div className={classes.colorPalaett}>
          {brandcolor.map((color) => (
            <CopyToClipboard text={color} onCopy={onCopyText} key={color}>
              <div style={{ background: color }}>
                <p>{color}</p>
                {!isCopied ? <CopyIcon /> : <CheckSolid />}
              </div>
            </CopyToClipboard>
          ))}
        </div>
        <div className={classes.colorSubHeader}>Accent Dark Gray</div>
        <div className={`${classes.colorPalaett} ${classes.darkColorPalaett}`}>
          {accentDarkGray.map((color) => (
            <CopyToClipboard text={color} onCopy={onCopyText} key={color}>
              <div style={{ background: color }}>
                <p>{color}</p>
                {!isCopied ? <CopyIcon /> : <CheckSolid />}
              </div>
            </CopyToClipboard>
          ))}
        </div>
        <div className={classes.colorSubHeader}>Accent Dark Gray</div>
        <div className={`${classes.colorPalaett} ${classes.whiteColorPalaett}`}>
          {accentLightGray.map((color) => (
            <CopyToClipboard text={color} onCopy={onCopyText} key={color}>
              <div style={{ background: color }}>
                <p>{color}</p>
                {!isCopied ? <CopyIcon /> : <CheckSolid />}
              </div>
            </CopyToClipboard>
          ))}
        </div>
        <div className={classes.subHeader}>
          Typography <p />
        </div>
        <div className={classes.description}>
          Genadrop Design system is designed as a single source of truth for Genadrop’s applicaitons by Minority
          Programmers product design team.
        </div>
        <div className={`${classes.downloadBtnWrapper} ${classes.fontsDownload}`}>
          <a
            href="https://drive.google.com/file/d/1yM0OPmSxQSrzgLX7ABndGnqETTPYHCpo/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            Download Fonts
          </a>
        </div>
        <div className={classes.fonts}>
          {fonts.map((font) => (
            <div key={font.name}>
              <p>{font.name}</p>
              <div style={{ fontWeight: font.font_weight }}> SF Pro Display</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Brand;
