import React from "react";
import { handleDownload } from "../../../utils/index2";
import { addToCollection, handleDescription, handleRename } from "../preview-script";
import TextEditor from "../text-editor";
import classes from "../preview.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { setNotification, setLoader, setZip } from "../../../gen-state/gen.actions";

const GifCard = ({ gifCardProps, asset }) => {
  const { image, id, name, description, index } = asset;
  const { dispatch, outputFormat, collectionName, handleSetState, gifs } = gifCardProps;

  return (
    <div key={id} className={classes.card}>
      <img className={classes.asset} src={image} alt="" />
      <div className={classes.cardBody}>
        <div className={classes.textWrapper}>
          <TextEditor
            placeholder={name}
            submitHandler={(value) => handleRename({ ...gifCardProps, value, id, index })}
          />
        </div>
        <textarea
          name="description"
          value={description}
          cols="30"
          rows="3"
          placeholder="description"
          onChange={(e) =>
            handleDescription({
              value: e.target.value,
              id,
              index,
            })
          }
        />
        <div className={classes.buttonContainer}>
          <button
            type="button"
            onClick={() =>
              handleDownload({
                window,
                dispatch,
                setLoader,
                setZip,
                setNotification,
                value: [asset],
                name: asset.name,
                outputFormat,
                single: true,
              })
            }
          >
            Download
          </button>
          <button type="button" onClick={() => addToCollection({ ...gifCardProps, gif: asset })}>
            Add to {collectionName || "collection"}
          </button>
        </div>
      </div>
      <div
        onClick={() =>
          handleSetState({
            gifs: gifs.filter((gif) => gif.id !== id),
          })
        }
        className={classes.iconClose}
      >
        <CloseIcon className={classes.closeIcon} />
      </div>
    </div>
  );
};

export default GifCard;
