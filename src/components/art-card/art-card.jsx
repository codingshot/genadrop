/* eslint-disable prefer-const */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-restricted-syntax */
import React, { useContext, useState, useEffect } from "react";
import {
  addPreview,
  removeImage,
  removePreview,
  setImageAction,
  updateImage,
  updatePreview,
} from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./art-card.module.css";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { ReactComponent as EditIcon } from "../../assets/icon-edit.svg";
import { ReactComponent as MarkIcon } from "../../assets/icon-mark.svg";
import RadioButton from "./radio-Button/radioButton";

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
    for (let p of preview) {
      if (JSON.stringify(p) === JSON.stringify({ layerId, layerTitle, imageName: name, imageFile })) {
        dispatch(removePreview({ layerId, layerTitle, imageName: name }));
        setActiveCard(-1);
        return;
      }
    }
    dispatch(addPreview({ layerId, layerTitle, imageName: name, imageFile }));
    setActiveCard(index);
  };

  const handleRemove = () => {
    console.log("delete trait starts");
    dispatch(removePreview({ layerId, layerTitle, imageName: traitTitle }));
    dispatch(removeImage({ layerId, layerTitle, traitTitle }));
    dispatch(
      setImageAction({
        type: "delete",
        value: {
          id: layerId,
          traitTitle,
        },
      })
    );
    console.log("delete trait ends");
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
    if (prompt === "name" && previousValue !== inputValue.name) {
      dispatch(
        setImageAction({
          type: "rename",
          value: {
            id: layerId,
            oldName: previousValue,
            newName: inputValue.name,
            image,
          },
        })
      );
    }
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
          <CloseIcon onClick={handleRemove} className={classes.closeIcon} />
        ) : (
          <RadioButton active={activeCard === index} onClick={() => handleAddPreview(traitTitle, image)} />
        )}
      </div>
      <div onClick={() => handleAddPreview(traitTitle, image)} className={classes.imageContainer}>
        <img className={classes.image} src={URL.createObjectURL(image)} alt="avatar" />
      </div>
      <div className={classes.details}>
        <div>
          {prompt !== "name" ? (
            <div className={classes.inputText}>
              <div>{traitTitle}</div>
              <EditIcon onClick={() => handlePrompt("name")} className={classes.editIcon} />
            </div>
          ) : (
            <div className={classes.editInput}>
              <form onSubmit={(e) => handleRename(e, image)}>
                <input autoFocus type="text" name="name" value={inputValue.name} onChange={handleChange} />
              </form>
              <MarkIcon onClick={(e) => handleRename(e, image)} className={classes.editIcon} />
            </div>
          )}
        </div>

        <div>
          {prompt !== "rarity" ? (
            <div className={classes.inputText}>
              <div>Rarity: {Rarity}</div>
              <EditIcon onClick={() => handlePrompt("rarity")} className={classes.editIcon} />
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
              <MarkIcon className={classes.editIcon} onClick={handleRename} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtCard;
