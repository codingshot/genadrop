import React from "react";
import classes from "./Partner.module.css";

const Partner = () => {
  return (
    <div className={classes.container}>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSexslat5Sca-I0M0Tmrq0HFNo8Z4JXDKfeMUIJ7kcaWoQvzBA/viewform?embedded=true"
        width="100%"
        // height="70vh"
        frameBorder="0"
        title="form"
        className={classes.form}
      >
        Loading…
      </iframe>
    </div>
  );
};

export default Partner;
