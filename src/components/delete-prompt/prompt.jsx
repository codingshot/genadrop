import { useContext } from "react";
import { setPrompt } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./prompt.module.css";

const DeletePrompt = () => {
  const { prompt, dispatch } = useContext(GenContext);

  const handleAccept = () => {
    dispatch(prompt);
    dispatch(setPrompt(null));
  };

  const handleReject = () => {
    dispatch(setPrompt(null));
  };

  return (
    <div className={`${classes.container} ${prompt && classes.isActive}`}>
      <div className={classes.wrapper}>
        <p>Are you sure you want to delete?</p>
        <div className={classes.action}>
          <button onClick={handleReject} className={classes.reject}>
            Cancel
          </button>
          <button onClick={handleAccept} className={classes.accept}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePrompt;
