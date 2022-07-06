import { useState } from "react";
import classes from "./AssetCard.module.css";

const AssetCard = ({ cardProps }) => {
  const { image, id, name, description } = cardProps;

  const [state, setState] = useState({
    nValue: name,
    dValue: "",
    isEdit: true,
  });

  const { nValue, dValue, isEdit } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleEditInput = () => {
    handleSetState({ isEdit: !isEdit });
  };

  return (
    <div className={classes.container}>
      <img src={image} alt="" />
      <div className={classes.detailsContainer}>
        <div className={classes.inputContainer}>
          <input disabled={!isEdit} onChange={(nValue) => handleSetState({ nValue })} type="text" value={nValue} />
          <div onClick={handleEditInput}>{isEdit ? "E" : "S"}</div>
        </div>
        <textarea onChange={(dValue) => handleSetState({ dValue })} value={dValue}></textarea>
        <div className={classes.btnContainer}>
          <div className={classes.download}>Download</div>
          <div className={classes.generate}>Generate New</div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
