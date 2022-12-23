import React, { useState } from "react";
import classes from "./FAQ.module.css";
import FQACard from "./FAQCard";
import { FAQS } from "./script";

const FQA = () => {
  const [state, setState] = useState({
    dropdown: "",
  });
  const { dropdown } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.heading}>Frequently Asked Questions</div>
        <div className={classes.FQAs}>
          {FAQS.map((FAQ, index) => (
            <FQACard key={FAQ.id} FAQ={FAQ} id={index} dropdown={dropdown} handleSetState={handleSetState} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FQA;
