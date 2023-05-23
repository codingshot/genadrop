/* eslint-disable consistent-return */
import React from "react";
import classes from "./FAQCard.module.css";
import closeIcon from "../../../assets/close-icon.svg";
import openIcon from "../../../assets/open-icon.svg";

const FQACard = ({ dropdown, id, handleSetState, FAQ: { question, answer } }) => {
  const handleDropdown = () => {
    if (String(id) === dropdown) return handleSetState({ dropdown: "" });
    handleSetState({ dropdown: String(id) });
  };

  return (
    <div onClick={handleDropdown} className={classes.container}>
      <div className={`${classes.question} ${dropdown === String(id) && classes.active}`}>
        <p className={classes.title}>{question}</p>
        <span>{dropdown === String(id) ? <img src={closeIcon} alt="" /> : <img src={openIcon} alt="" />}</span>
      </div>
      <div className={`${classes.answer} ${dropdown === String(id) && classes.active}`}>{answer}</div>
    </div>
  );
};

export default FQACard;
