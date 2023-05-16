import React, { useState } from "react";
import classes from "./text-editor.module.css";
import { ReactComponent as EditIcon } from "../../assets/icon-edit.svg";
import { ReactComponent as MarkIcon } from "../../assets/icon-mark.svg";

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
          <input type="text" value={value} onChange={(e) => handleSetState({ value: e.target.value })} />
          <button type="submit">
            <MarkIcon className={classes.editIcon} />
          </button>
        </form>
      ) : (
        <div>
          <p>{placeholder}</p>
          <button type="button" onClick={() => handleSetState({ editor: true, value: placeholder })}>
            <EditIcon className={classes.editIcon} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
