import React, { useState, useContext } from "react";
import { updateLayer } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./layer.module.css";
import {ReactComponent as DeleteIcon} from "../../assets/icon-delete.svg";
import {ReactComponent as DragIcon } from "../../assets/icon-drag.svg";
import {ReactComponent as EditIcon } from "../../assets/icon-edit.svg";
import {ReactComponent as MarkIconDark } from "../../assets/icon-mark.svg";

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
          <DragIcon alt="" />
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
              <MarkIconDark alt="" />
            </div>
          ) : (
            <div onClick={() => handleEdit(name)} className={classes.editBtn}>
              <EditIcon alt="" />
            </div>
          )}
        </div>
      </div>
      <div className={classes.trait}>{trait}</div>
      <div onClick={click} className={classes.deleteBtn}>
        <DeleteIcon alt="" />
      </div>
    </div>
  );
};

export default Layer;
