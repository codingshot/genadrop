import React from "react";
import { handleDownload } from "../../../utils/index2";
import { addGif, handleDelete, handleDeleteAndReplace, handleDescription, handleRename } from "../preview-script";
import TextEditor from "../text-editor";
import classes from "../preview.module.css";
import { ReactComponent as CheckIcon } from "../../../assets/check-solid.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { setNotification, setLoader, setZip } from "../../../gen-state/gen.actions";

const ArtCard = ({ previewProps, asset }) => {
  const { image, id, name, description, index } = asset;
  const { gifImages, gifShow, dispatch, outputFormat, currentPlan } = previewProps;

  return (
    <div className={`${classes.card} ${gifImages.filter((e) => e.id === id).length > 0 ? classes.cardActive : ""}`}>
      <img className={classes.asset} src={image} alt="" />
      <div className={classes.cardBody}>
        <div className={classes.textWrapper}>
          <TextEditor
            placeholder={name}
            submitHandler={(value) => handleRename({ ...previewProps, value, id, index })}
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
              description: e.target.value,
              id,
              index,
              dispatch,
            })
          }
        />
        <div className={classes.buttonContainer}>
          <button
            type="button"
            className={classes.nftDonwload}
            onClick={() =>
              handleDownload({
                window,
                dispatch,
                currentPlan,
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
          {image.split(",")[0] !== "data:image/gif;base64" && (
            <button type="button" onClick={() => handleDeleteAndReplace({ ...previewProps, id, index })}>
              Generate New
            </button>
          )}
        </div>
      </div>
      {!gifShow && (
        <div onClick={() => handleDelete({ dispatch, id })} className={classes.iconClose}>
          <CloseIcon className={classes.closeIcon} />
        </div>
      )}
      {gifShow && (
        <div
          onClick={() => addGif({ ...previewProps, asset })}
          className={`${classes.iconClose} ${gifImages.filter((e) => e.id === id).length > 0 ? classes.cheked : ""}`}
        >
          <CheckIcon fill={gifImages.filter((e) => e.id === id).length > 0 ? "#ffffff" : "#D1D4D8"} />
        </div>
      )}
    </div>
  );
};

export default ArtCard;
