import React from "react";
import whiteLogo, { ReactComponent as WhiteLogo } from "../../assets/brand/white-logo.svg";
import mainLogo, { ReactComponent as MainLogo } from "../../assets/brand/main-logo.svg";
import blackLogo, { ReactComponent as BlackLogo } from "../../assets/brand/black-logo.svg";

export const brandcolor = [
  "#0D99FF",
  "#2CA6FF",
  "#4AB3FF",
  "#62BDFF",
  "#86CCFF",
  "#AADBFF",
  "#C3E5FF",
  "#DBF0FF",
  "#F3FAFF",
];
export const accentDarkGray = [
  "#0F1D40",
  "#192648",
  "#2C3857",
  "#3A4662",
  "#49536E",
  "#525C76",
  "#5C657D",
  "#656E85",
  "#747C90",
];

export const accentLightGray = [
  "#8C93A3",
  "#959CAB",
  "#A4A9B6",
  "#B2B7C2",
  "#CACDD5",
  "#E2E4E8",
  "#EEEFF2",
  "#F5F6F7",
  "#FAFAFB",
];
export const fonts = [
  {
    font_weight: "700",
    name: "Bold",
  },
  {
    font_weight: "600",
    name: "Semibold",
  },
  {
    font_weight: "500",
    name: "Medium",
  },
  {
    font_weight: "400",
    name: "Regular",
  },
];

export const logos = [
  {
    logo: <MainLogo />,
    donwnload: mainLogo,
    title: "Main Logo",
    color: "var(--main-color)",
  },
  {
    logo: <WhiteLogo />,
    donwnload: whiteLogo,
    title: "White Logo",
    color: "var(--default)",
  },
  {
    logo: <BlackLogo />,
    donwnload: blackLogo,
    title: "Black Logo",
    color: "black",
  },
];
