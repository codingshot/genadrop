/* eslint-disable consistent-return */
import React, { useEffect, useState, useContext } from "react";
import classes from "./CollectionNameModal.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import { setCollectionName, setLayerAction, setToggleCollectionNameModal } from "../../../gen-state/gen.actions";

const CollectionNameModal = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);

  const { dispatch, collectionName, toggleCollectionNameModal, currentUser, toggleSessionModal, isLoading } =
    useContext(GenContext);

  const handleChange = (e) => {
    setError(false);
    setInputValue(e.target.value);
  };

  const handleClose = () => {
    setInputValue("");
    dispatch(setToggleCollectionNameModal(false));
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!inputValue) return setError(true);
    dispatch(setCollectionName(inputValue));
    dispatch(
      setLayerAction({
        type: "name",
      })
    );
    handleClose();
  };

  useEffect(() => {
    if (toggleSessionModal || isLoading || !currentUser) {
      dispatch(setToggleCollectionNameModal(false));
    } else if (!collectionName && currentUser) {
      dispatch(setToggleCollectionNameModal(true));
    }
  }, [collectionName, currentUser, toggleSessionModal, isLoading]);

  return (
    <div className={`${classes.container} ${toggleCollectionNameModal && classes.active}`}>
      <div className={classes.wrapper}>
        {/* <CloseIcon onClick={handleClose} className={classes.closeBtn} /> */}
        <form onSubmit={handleClick} className={classes.content}>
          <h3>Let’s get cracking!</h3>
          <h6>Every Collection is Unique</h6>
          <p>
            Input any awesome collection name you want and click continue <br /> Don’t worry, you can always change it
            later.
          </p>
          <div className={`${classes.inputContainer} ${error && classes.error}`}>
            <label> Collection name </label>
            <input value={inputValue} onChange={handleChange} type="text" placeholder="Minority_Drop" />
          </div>
          <div className={`${classes.errorMessage} ${error && classes.error}`}>Enter collection name</div>
          <button type="button" className={`${inputValue && classes.active}`} onClick={handleClick}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollectionNameModal;
