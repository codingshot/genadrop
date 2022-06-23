import { useState } from "react";
import classes from "./DateFilter.module.css";

const DateFilter = () => {
  const [activeDuration, setActiveDuration] = useState("24hours");

  const handleClick = (duration) => {
    setActiveDuration(duration);
  };

  return (
    <div className={classes.container}>
      <div className={`${activeDuration === "24hours" && classes.active}`} onClick={() => handleClick("24hours")}>
        24 Hours
      </div>
      <div className={`${activeDuration === "7days" && classes.active}`} onClick={() => handleClick("7days")}>
        7 Days
      </div>
      <div className={`${activeDuration === "30days" && classes.active}`} onClick={() => handleClick("30days")}>
        30 Days
      </div>
    </div>
  );
};

export default DateFilter;
