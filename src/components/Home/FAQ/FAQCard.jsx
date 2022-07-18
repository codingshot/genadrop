import React from "react";
import classes from "./FAQCard.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/close-icon.svg";
import { ReactComponent as OpenIcon } from "../../../assets/open-icon.svg";

const FQACard = ({ dropdown, id, handleSetState, FAQ: { question, answer } }) => {
  const handleDropdown = () => {
    if (String(id) === dropdown) return handleSetState({ dropdown: "" });
    handleSetState({ dropdown: String(id) });
  };

  return (
    <div className={classes.container}>
      <div onClick={handleDropdown} className={`${classes.question} ${dropdown === String(id) && classes.active}`}>
        <p className={classes.title}>{question}</p>
        <span>{dropdown === String(id) ? <CloseIcon alt="" /> : <OpenIcon alt="" />}</span>
      </div>
      <div className={`${classes.answer} ${dropdown === String(id) && classes.active}`}>{answer}</div>
    </div>
  );
};

export default FQACard;
