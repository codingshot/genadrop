import React, { useState } from "react";
import classes from "./text-editor.module.css";
import editIcon from "../../assets/icon-edit.svg";
import markIcon from "../../assets/icon-mark.svg";

const TextEditor = ({ placeholder, submitHandler, invert }) => {
  const [state, setState] = useState({
    value: "",
    editor: false,
  });

  const { value, editor } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitHandler(value);
    handleSetState({ editor: false, value: "" });
  };

  return (
    <div className={`${classes.container} ${invert && classes.invert}`}>
      {editor ? (
        <form onSubmit={handleSubmit}>
          <input autoFocus type="text" value={value} onChange={(e) => handleSetState({ value: e.target.value })} />
          <button type="submit">
            <img src={markIcon} alt="" />
          </button>
        </form>
      ) : (
        <div>
          <p>{placeholder}</p>
          <button type="button" onClick={() => handleSetState({ editor: true, value: placeholder })}>
            <img src={editIcon} alt="" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
