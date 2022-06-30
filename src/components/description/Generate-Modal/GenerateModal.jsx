import classes from "./GenerateModal.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";

const GenerateModal = ({ modal }) => {
  return (
    <div className={`${classes.container} ${modal && classes.active}`}>
      <div className={classes.wrapper}>
        <CloseIcon className={classes.closeBtn} />
        <div className={classes.content}>
          <div>Time to see your artworks!</div>
          <div>Input the number of artwork you wish to generate</div>
          <div>COMBINATIONS: {"2222"}</div>
          <div className={classes.inputContainer}>
            <label> Number of artwork </label>
            <input type="text" placeholder="Ex: 1000" />
          </div>
          <button>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default GenerateModal;
