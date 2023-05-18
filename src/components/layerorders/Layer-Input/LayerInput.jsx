/* eslint-disable jsx-a11y/no-autofocus */
import React, { useState } from "react";
import classes from "./LayerInput.module.css";

const LayerInput = ({ handleAddLayer, setPrompt }) => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddLayer(value);
    setPrompt(false);
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <input onChange={handleChange} autoFocus type="text" value={value} />
      <div className={classes.buttons}>
        <button className={classes.add} type="submit">
          Add
        </button>
        <button className={classes.cancel} onClick={() => setPrompt(false)} type="button">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LayerInput;
