import classes from "./GenerateModal.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { useContext, useEffect } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import { useState } from "react";
import { setMintAmount } from "../../../gen-state/gen.actions";
import { handleGenerate } from "../collection-description-script";
import { useHistory } from "react-router-dom";

const GenerateModal = ({ modal, combinations, closeModal, generateProps, nftLayers }) => {
  const [inputValue, setInputValue] = useState("0");
  const [error, setError] = useState("");
  const [isGenerate, setGenereate] = useState(false);

  const { dispatch } = useContext(GenContext);
  const history = useHistory();

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setError("");
  };

  const handleClick = () => {
    if (inputValue <= "0") return setError("Invalid input");
    if (inputValue > combinations) return setError("Number of arts cannot be greater than the possible combinations");
    dispatch(setMintAmount(parseInt(inputValue)));
    handleGenerate({ ...generateProps, mintAmount: parseInt(inputValue) });
    setGenereate(true);
  };

  const handlePreview = () => {
    handleClose();
    setInputValue("0");
    history.push("./preview");
  };

  const handleClose = () => {
    closeModal(false);
  };

  useEffect(() => {
    setGenereate(false);
  }, [modal]);

  return (
    <div className={`${classes.container} ${modal && classes.active}`}>
      <div className={classes.wrapper}>
        <CloseIcon onClick={handleClose} className={classes.closeBtn} />
        <div className={classes.content}>
          <h3>Time to see your artworks!</h3>
          <p>Input the number of artwork you wish to generate</p>
          <div>COMBINATIONS: {combinations}</div>
          <div className={classes.inputContainer}>
            <label> Number of artwork </label>
            <input
              disabled={nftLayers.length ? true : false}
              type="number"
              min="0"
              max={combinations}
              value={inputValue}
              onChange={handleChange}
              placeholder="Ex: 1000"
            />
            <div className={`${classes.error} ${error && classes.active}`}>{error}</div>
          </div>
          {!isGenerate ? (
            <button className={`${classes.btn_1} ${Number(inputValue) && classes.active}`} onClick={handleClick}>
              Continue
            </button>
          ) : nftLayers.length ? (
            <button onClick={handlePreview} className={classes.btn_2}>
              Preview collection
            </button>
          ) : (
            <div className={classes.btn_3}>
              <span>Generating...</span>
              <div className={classes.loaderIcon} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateModal;
