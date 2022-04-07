import React, { useState, useRef } from "react";
import classes from "./copy.module.css";
import copyIcon from "../../assets/icon-copy.svg";

const Copy = ({ message, placeholder }) => {
  const [copied, setCopy] = useState(false);

  const copyRef = useRef(null);

  const handleCopy = (props) => {
    const { navigator, copy } = props;
    copy.select();
    copy.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(copy.value);
  };

  return (
    <div
      className={classes.container}
      onMouseDown={() => setCopy(true)}
      onMouseUp={() => setCopy(false)}
      onClick={() => handleCopy({ navigator, copy: copyRef.current })}
    >
      <span>{placeholder}</span>
      <img src={copyIcon} alt="" className={`${classes.copyIcon} ${copied && classes.active}`} />
      <input style={{ display: "none" }} ref={copyRef} type="text" defaultValue={message} />
    </div>
  );
};

export default Copy;
