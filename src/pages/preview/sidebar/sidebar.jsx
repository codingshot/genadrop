/* eslint-disable no-restricted-globals */
import React, { useContext, useRef } from "react";
import GenadropToolTip from "../../../components/Genadrop-Tooltip/GenadropTooltip";
import { handleDownload } from "../../../utils/index2";
import { generateGif, handleCollectionDescription, handleCollectionName, handleFormatChange } from "../preview-script";
import { ReactComponent as CheckIcon } from "../../../assets/check-solid.svg";
import CaretDown from "../../../assets/icon-caret-down.svg";
import CaretUP from "../../../assets/icon-caret-up.svg";
import TextEditor from "../text-editor";
import classes from "../preview.module.css";
import { setNotification, setLoader, setZip, setToggleUpgradeModal } from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";

const Sidebar = ({ sidebarProps }) => {
  const ipfsRef = useRef(null);
  const arweaveRef = useRef(null);
  const { currentPlan } = useContext(GenContext);

  const {
    gifShow,
    handleSetState,
    enableAllDescription,
    outputFormat,
    collectionName,
    collectionDescription,
    dispatch,
    duration,
    nftLayers,
  } = sidebarProps;

  const handleGif = () => {
    if (currentPlan === "free") {
      dispatch(setToggleUpgradeModal(true));
    } else {
      handleSetState({ gifShow: true });
    }
  };

  return (
    <aside className={`${classes.sidebar} ${gifShow && classes.sidebarActive}`}>
      <div className={classes.collectionDetail}>
        <div className={classes.tab}>
          <h3>Collection Name </h3>
        </div>
        <div className={classes.wrapper}>
          <TextEditor
            placeholder={collectionName || ""}
            submitHandler={(value) => handleCollectionName({ ...sidebarProps, value })}
            invert
          />
        </div>

        <div className={classes.tab}>
          <h3>Collection Description </h3>
          <div
            onClick={() =>
              handleSetState({
                enableAllDescription: !enableAllDescription,
              })
            }
            className={`${classes.toggleContainer}  ${enableAllDescription && classes.active}`}
          >
            <div className={`${classes.toggle} ${enableAllDescription && classes.active}`} />
          </div>
        </div>
        <textarea
          name="description"
          value={collectionDescription}
          rows="4"
          placeholder="description"
          onChange={(event) => handleCollectionDescription({ ...sidebarProps, event })}
        />
      </div>
      <div className={classes.actionContainer}>
        <div className={classes.foramtWrapper}>
          <h3>Use Format</h3>
          <label
            htmlFor="ipfs"
            onClick={() => handleFormatChange({ ...sidebarProps, ipfsRef, arweaveRef, val: "ipfs" })}
          >
            <input
              ref={ipfsRef}
              type="radio"
              name="format"
              value="ipfs"
              defaultChecked
              className={`${classes.radioBtn} ${outputFormat === "ipfs" && classes.clicked}`}
            />
            <p>IPFS</p>
            <GenadropToolTip
              fill="white"
              content="IPFS is a peer-to-peer (p2p) storage network for storing and sharing data."
            />
          </label>
          <label
            htmlFor="arweave"
            onClick={() => handleFormatChange({ ...sidebarProps, ipfsRef, arweaveRef, val: "arweave" })}
          >
            <input
              ref={arweaveRef}
              type="radio"
              name="format"
              value="arweave"
              className={`${classes.radioBtn} ${outputFormat === "arweave" && classes.clicked}`}
            />
            <p>Arweave</p>
          </label>
        </div>
        <div className={classes.btnWrapper}>
          {!gifShow && (
            <button onClick={handleGif} className={classes.gifButton} type="button">
              Genrate GIF
            </button>
          )}
        </div>

        {gifShow && (
          <div className={classes.durationWrapper}>
            <div className={classes.durationField}>
              <div className={classes.durationLabel} />
              <div className={classes.durationInput}>
                <input
                  onChange={(e) => handleSetState({ duration: e.target.valueAsNumber })}
                  placeholder="set duration"
                  value={duration}
                  type="number"
                />
                <div className={classes.numberCounter}>
                  <p style={{ opacity: isNaN(duration) || duration === "" ? 0 : 1 }}>Sec</p>
                  <div className={classes.verticalLine} />
                  <div className={classes.inputArrows}>
                    <img
                      onClick={() =>
                        handleSetState({
                          duration: duration ? duration + 1 : 1,
                        })
                      }
                      src={CaretUP}
                      alt="count-up"
                    />
                    <img
                      onClick={() =>
                        handleSetState({
                          duration: duration ? (duration - 1 <= 0 ? 0 : duration - 1) : 0,
                        })
                      }
                      src={CaretDown}
                      alt="count-down"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.mintButtonWrapper}>
              <button type="button" onClick={() => handleSetState({ gifShow: null })} className={classes.cancelBtn}>
                Cancel
              </button>
              <button type="button" onClick={() => generateGif({ ...sidebarProps })} className={classes.mintBtn}>
                <CheckIcon /> Done
              </button>
            </div>
          </div>
        )}
        <div className={classes.btnWrapper}>
          <button
            type="button"
            onClick={() =>
              handleDownload({
                window,
                dispatch,
                setLoader,
                setZip,
                setNotification,
                value: nftLayers,
                name: collectionName,
                outputFormat,
                currentPlan,
              })
            }
          >
            Download zip
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
