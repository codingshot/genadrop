import React, { useState, useContext } from "react";
import { updateLayer } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./layer.module.css";
import deleteIcon from "../../assets/icon-delete.svg";
import dragIcon from "../../assets/icon-drag.svg";
import editIcon from "../../assets/icon-edit.svg";
import markIconDark from "../../assets/icon-mark.svg";

const Layer = ({ name, trait, click, id, activeInput, setActiveInput }) => {
  const [state, setState] = useState({
    inputValue: "",
  });
  const { inputValue } = state;

  const { dispatch } = useContext(GenContext);

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleRename = () => {
    setActiveInput("");
    if (!inputValue) return;
    dispatch(updateLayer({ layerTitle: inputValue, id }));
  };

  const handleEdit = (nameActive) => {
    setActiveInput(nameActive);
    handleSetState({ inputValue: nameActive });
  };

  return (
    <div className={classes.item}>
      <div className={classes._name}>
        <div className={classes.line}>
          <img src={dragIcon} alt="" />
        </div>
        <div className={classes.renameWrapper}>
          {activeInput === name ? (
            <form onSubmit={handleRename}>
              <input
                className={`${classes.renameInput} ${classes.active}`}
                type="text"
                onChange={(e) => handleSetState({ inputValue: e.target.value })}
                value={inputValue}
                autoFocus
              />
            </form>
          ) : (
            <div className={classes.nameHeader}>{name}</div>
          )}
          {activeInput === name ? (
            <div onClick={handleRename} className={classes.renameBtn}>
              <img src={markIconDark} alt="" />
            </div>
          ) : (
            <div onClick={() => handleEdit(name)} className={classes.editBtn}>
              <img src={editIcon} alt="" />
            </div>
          )}
        </div>
      </div>
      <div className={classes.trait}>{trait}</div>
      <div onClick={click} className={classes.deleteBtn}>
        <img src={deleteIcon} alt="" />
      </div>
    </div>
  );
};

export default Layer;
