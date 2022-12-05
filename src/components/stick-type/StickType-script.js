import React from "react";
import classes from "./StickType.module.css";
import { ReactComponent as Blunt } from "../../assets/stick_type/blunt.svg";
import { ReactComponent as Joint } from "../../assets/stick_type/joint.svg";
import { ReactComponent as Spliff } from "../../assets/stick_type/spliff.svg";
import { ReactComponent as Cigarette } from "../../assets/stick_type/cigarette.svg";
import Cigar from "../../assets/stick_type/cigar.svg";

const typeCards = [
  {
    title: "Blunt",
    description: "Blunt is a roll of cannabis inside a cigar or blunt wrap.",
    icon: <Blunt className={classes.bluntIcon} />,
  },
  {
    title: "Spliff",
    description: "Spliff is made with a rolling paper filled with tobacco & cannabis mixed together.",
    icon: <Spliff className={classes.spliffIcon} />,
  },
  {
    title: "Cigar",
    description: "A roll of tobacco wrapped in leaf tobacco or in a substance that contains tobacco.",
    icon: <img src={Cigar} alt="" />,
  },
  {
    title: "Cigarette",
    description: "Cigarette is a thin cylinder of finely cut tobacco rolled in paper for smoking.",
    icon: <Cigarette className={classes.cigaretteIcon} />,
  },
  {
    title: "Joint",
    description: "Small and portable & consist of cannabis rolled up inside a thin rolling paper.",
    icon: <Joint className={classes.spliffIcon} />,
  },
];

export default typeCards;
