import React, { useContext } from "react";
import { setImageAction, setLayerAction, setPrompt } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./prompt.module.css";

const DeletePrompt = () => {
  const { prompt, dispatch } = useContext(GenContext);

  const handleAccept = () => {
    console.log("delete all-trait starts");
    dispatch(prompt);
    dispatch(setPrompt(null));
    dispatch(
      setImageAction({
        type: "deleteAll",
        value: prompt.payload.id,
      })
    );
    dispatch(
      setLayerAction({
        type: "delete",
      })
    );
    console.log("delete all-trait ends");
  };

  const handleReject = () => {
    dispatch(setPrompt(null));
  };

  return (
    <div className={`${classes.container} ${prompt && classes.isActive}`}>
      <div className={classes.wrapper}>
        <p>Are you sure you want to delete?</p>
        <div className={classes.action}>
          <button type="button" onClick={handleReject} className={classes.reject}>
            Cancel
          </button>
          <button type="button" onClick={handleAccept} className={classes.accept}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePrompt;
