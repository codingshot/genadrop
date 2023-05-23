/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
import React, { useEffect, useState, useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import classes from "./ProgressBar.module.css";
import { ReactComponent as CloudIcon } from "../../../assets/icon-cloud.svg";

const ProgressBar = () => {
  const [counter, setCounter] = useState({ count: 1, percentageCount: 100 });
  const { actionProgress } = useContext(GenContext);

  useEffect(() => {
    const { totalCount, resetCount } = actionProgress;
    if (totalCount) {
      setCounter((counter) => {
        let percentageCount = (counter.count / totalCount) * 100;
        let count = counter.count + 1;
        return { count, percentageCount: parseInt(percentageCount) };
      });
    } else if (resetCount) {
      setCounter({ count: 1, percentageCount: 100 });
    }
  }, [actionProgress]);

  return (
    <div className={classes.container}>
      <CloudIcon /> {counter.count > 1 ? `${counter.percentageCount}%` : "saved"}
    </div>
  );
};

export default ProgressBar;
