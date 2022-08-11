import React, { useRef } from "react";
import { SHA256 } from "crypto-js";
import classes from "./pitchLock.module.css";
import { ReactComponent as IconLock } from "../../assets/icon-lock.svg";

const PitchLock = ({ password, wrongPass, handleSetState }) => {
  const componentRef = useRef();

  const hashed = "1b24e99b1513303da691e9c4310d794ef26ba5794f73896b9481fe7306f3360f";

  const submitPassword = (e) => {
    e.preventDefault();
    const ciphertext = SHA256(password).toString();
    if (ciphertext === hashed) {
      handleSetState({
        locked: false,
      });
    } else {
      handleSetState({
        wrongPass: true,
      });
    }
  };
  return (
    <div className={`${classes.selectContainer} ${classes.active}`}>
      <div className={`${classes.container}`}>
        <div className={classes.card} ref={componentRef}>
          <div className={classes.Icon}>
            <IconLock />
          </div>
          <div className={classes.title}>This link is password protected</div>
          <div className={classes.text}>Please enter the password to view this link</div>
          <form onSubmit={submitPassword}>
            <div className={classes.inputWrapper}>
              {wrongPass && <p>Password Incorrect</p>}
              <input
                type="password"
                className={classes.passInput}
                placeholder="Password"
                onChange={(e) =>
                  handleSetState({
                    password: e.target.value,
                  })
                }
              />
            </div>
            <div className={classes.line} />
            <input type="submit" value="Submit" className={classes.btn} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PitchLock;
