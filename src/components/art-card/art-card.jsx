import React, { useContext, useState, useEffect } from "react";
import { addPreview, removeImage, removePreview, updateImage, updatePreview } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./art-card.module.css";
import { ReactComponent as CheckActiveIcon } from "../../assets/icon-check-active.svg";
import { ReactComponent as CheckIcon } from "../../assets/icon-check.svg";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { ReactComponent as EditIconDark } from "../../assets/icon-edit-dark.svg";
import { ReactComponent as MarkIconDark } from "../../assets/icon-mark-dark.svg";

const ArtCard = ({ layerTitle, trait, setActiveCard, activeCard, layerId, index }) => {
  const [state, setState] = useState({
    prompt: "",
    inputValue: {
      name: trait.traitTitle,
      rarity: trait.Rarity,
    },
    previousValue: "",
  });
  const { prompt, inputValue, previousValue } = state;
  const { image, traitTitle, Rarity } = trait;
  const { dispatch, preview, isRule } = useContext(GenContext);

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleAddPreview = (name, imageFile) => {
    dispatch(addPreview({ layerId, layerTitle, imageName: name, imageFile }));
    setActiveCard(index);
  };

  const handleRemove = () => {
    dispatch(removePreview({ layerId, layerTitle, imageName: traitTitle }));
    dispatch(removeImage({ layerId, layerTitle, traitTitle }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    handleSetState({ inputValue: { ...inputValue, [name]: value } });
  };

  const handleRename = (e, imageFile) => {
    e.preventDefault();
    preview.forEach((item) => {
      if (item.layerId === layerId && item.imageName === previousValue) {
        dispatch(updatePreview({ layerId, layerTitle, imageName: inputValue.name, imageFile }));
      }
    });
    handleSetState({ prompt: "" });
    dispatch(
      updateImage({
        layerId,
        layerTitle,
        image,
        traitTitle: inputValue.name,
        Rarity: Number(inputValue.rarity) > 100 ? "100" : Number(inputValue.rarity) < 1 ? "1" : inputValue.rarity,
      })
    );
  };

  const handlePrompt = (value) => {
    handleSetState({ prompt: value });
    setActiveCard(index);
    handleSetState({ previousValue: traitTitle });
  };

  useEffect(() => {
    if (activeCard !== traitTitle) handleSetState({ prompt: "" });
  }, [activeCard, traitTitle]);

  useEffect(() => {
    if (!preview.length) {
      setActiveCard(-1);
    }
  }, [preview]);

  return (
    <div className={`${classes.container} ${activeCard === index ? classes.active : classes.inActive}`}>
      <div className={classes.action}>
        {!isRule ? (
          <i />
        ) : activeCard === index ? (
          <CheckActiveIcon alt="" />
        ) : (
          <CheckIcon alt="" onClick={() => handleAddPreview(traitTitle, image)} />
        )}
        <CloseIcon onClick={handleRemove} className={classes.closeIcon} />
      </div>
      <div onClick={() => handleAddPreview(traitTitle, image)} className={classes.imageContainer}>
        <img className={classes.image} src={URL.createObjectURL(image)} alt="avatar" />
      </div>
      <div className={classes.details}>
        <div>
          {prompt !== "name" ? (
            <div className={classes.inputText}>
              <div>{traitTitle}</div>
              <EditIconDark onClick={() => handlePrompt("name")} alt="" />
            </div>
          ) : (
            <div className={classes.editInput}>
              <form onSubmit={(e) => handleRename(e, image)}>
                <input autoFocus type="text" name="name" value={inputValue.name} onChange={handleChange} />
              </form>
              <MarkIconDark onClick={(e) => handleRename(e, image)} alt="" />
            </div>
          )}
        </div>

        <div>
          {prompt !== "rarity" ? (
            <div className={classes.inputText}>
              <div>Rarity: {Rarity}</div>
              <EditIconDark onClick={() => handlePrompt("rarity")} alt="" />
            </div>
          ) : (
            <div className={classes.editInput}>
              <form onSubmit={handleRename}>
                <input
                  autoFocus
                  type="number"
                  min="0"
                  max="100"
                  name="rarity"
                  value={inputValue.rarity}
                  onChange={handleChange}
                />
              </form>
              <MarkIconDark onClick={handleRename} alt="" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtCard;
