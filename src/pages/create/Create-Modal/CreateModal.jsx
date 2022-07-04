import classes from "./CreateModal.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { useState } from "react";
import { useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import { setCollectionName } from "../../../gen-state/gen.actions";

const CreateModal = ({ modal, closeModal }) => {
  const [inputValue, setInputValue] = useState("");
  const { dispatch } = useContext(GenContext);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = () => {
    if (!inputValue) return;
    dispatch(setCollectionName(inputValue));
    handleClose();
  };

  const handleClose = () => {
    closeModal();
  };

  return (
    <div className={`${classes.container} ${modal && classes.active}`}>
      <div className={classes.wrapper}>
        <CloseIcon onClick={handleClose} className={classes.closeBtn} />
        <div className={classes.content}>
          <h3>Let’s get cracking!</h3>
          <h6>Every Collection is Unique</h6>
          <p>
            Input any awesome collection name you want and click continue <br /> Don’t worry, you can always change it
            later.
          </p>
          <div className={classes.inputContainer}>
            <label> Collection name </label>
            <input value={inputValue} onChange={handleChange} type="text" placeholder="Minority_Drop" />
          </div>
          <button onClick={handleClick}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
