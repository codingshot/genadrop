import React from "react";
import classes from "./Brand.module.css";
// color palettes
import {
  accentDarkGray,
  accentLightGray,
  brandcolor,
  // different font weights
  fonts,
} from "./Brand-script";
// assets
import zipFile from "../../assets/brand/Genadrop-Logos.zip";
import { ReactComponent as BrandBg } from "../../assets/brand/brand-bg.svg";
import { ReactComponent as WhiteLogo } from "../../assets/brand/white-logo.svg";
import { ReactComponent as MainLogo } from "../../assets/brand/main-logo.svg";
import { ReactComponent as BlackLogo } from "../../assets/brand/black-logo.svg";

const Brand = () => {
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
          <div>
            <p>Main Logo</p>
            <MainLogo />
          </div>
          <div>
            <p>White Logo</p>
            <WhiteLogo />
          </div>
          <div>
            <p>Black Logo</p>
            <BlackLogo />
          </div>
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
            <div style={{ background: color }}>{color}</div>
          ))}
        </div>
        <div className={classes.colorSubHeader}>Accent Dark Gray</div>
        <div className={`${classes.colorPalaett} ${classes.darkColorPalaett}`}>
          {accentDarkGray.map((color) => (
            <div style={{ background: color }}>{color}</div>
          ))}
        </div>
        <div className={classes.colorSubHeader}>Accent Dark Gray</div>
        <div className={`${classes.colorPalaett} ${classes.whiteColorPalaett}`}>
          {accentLightGray.map((color) => (
            <div style={{ background: color }}>{color}</div>
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
            <div>
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
