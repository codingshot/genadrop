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
    <div className={classes.container}>
      <div onClick={handleDropdown} className={classes.question}>
        <span>Q.</span>
        <p className={classes.title}>{question}</p>
        <span>{dropdown === String(id) ? <img src={closeIcon} alt="" /> : <img src={openIcon} alt="" />}</span>
      </div>
      <div className={`${classes.answer} ${dropdown === String(id) && classes.dropdown}`}>
        <span>A.</span>
        <p>
          {id === 0 ? (
            <a target="_blank" rel="noreferrer" href="https://www.genadrop.com/docs">
              {answer}
            </a>
          ) : (
            answer
          )}
        </p>
      </div>
    </div>
  );
};

export default FQACard;
