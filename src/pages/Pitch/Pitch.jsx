import React, { useState } from "react";
import classes from "./Pitch.module.css";
import PitchLock from "../../components/pitch-lock/pitchLock";

const Pitch = () => {
  const [state, setState] = useState({
    locked: true,
    password: "",
    wrongPass: false,
  });
  const { locked } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  return (
    <div className={classes.container}>
      {locked && <PitchLock {...state} handleSetState={handleSetState} />}

      <iframe
        src={`${
          locked
            ? ""
            : "https://docs.google.com/presentation/d/e/2PACX-1vSjj5PddNKaoyCrcZYtNaV7VZJ2005n6eVpkpLIdLDwH-yABJf7HH5ZvISv810WLZcIVfDkntbmrwNI/embed?start=false&loop=false&delayms=3000"
        }`}
        width="100%"
        // height="70vh"
        frameBorder="0"
        title="form"
        allowFullScreen
        className={classes.form}
      >
        Loading…
      </iframe>
    </div>
  );
};

export default Pitch;
