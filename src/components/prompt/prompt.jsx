import React, { useState } from "react";
import classes from "./prompt.module.css";

const Prompt = ({ handleAddLayer, setPrompt }) => {
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
        <button type="submit">Add</button>
        <button onClick={() => setPrompt(false)} type="button">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Prompt;
