import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  setClipboard,
  setConnectFromMint,
  setLoader,
  setOverlay,
  setNotification,
  setMinter,
} from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";
import Attribute from "../Attribute/Attribute";
import { handleMint, handleSingleMint } from "./minter-script";
import classes from "./minter.module.css";
import CollectionPreview from "../collection-preview/collectionPreview";
import rightArrow from "../../../assets/icon-arrow-right.svg";
import ProfileImgOverlay from "../ProfileImgOverlay/ProfileImgOverlay";
import Popup from "../popup/popup.component";
import { ReactComponent as PlusIcon } from "../../../assets/icon-plus.svg";
import GenadropToolTip from "../../Genadrop-Tooltip/GenadropTooltip";
import supportedChains from "../../../utils/supportedChains";
import { ReactComponent as DropdownIcon } from "../../../assets/icon-dropdown2.svg";
import { initConnectWallet } from "../../wallet/wallet-script";

const Minter = () => {
  const history = useHistory();
  const { dispatch, connector, account, chainId, mainnet, minter } = useContext(GenContext);

  if (!minter) {
    history.push("/mint");
    return null;
  }

  const { file, fileName: fName, metadata, zip } = minter;
  const [state, setState] = useState({
    attributes: { [Date.now()]: { trait_type: "File Type", value: file[0].type } },
    fileName: fName,
    description: metadata?.length === 1 ? metadata[0].description : "",
    chain: null,
    preview: false,
    collectionProfile: "",
    toggleGuide: false,
    toggleDropdown: false,
    previewSelectMode: false,
    profileSelected: false,
    popupProps: {
      url: null,
      isError: null,
      popup: false,
    },
  });
  const {
    attributes,
    fileName,
    description,
    chain,
    preview,
    collectionProfile,
    toggleGuide,
    toggleDropdown,
    previewSelectMode,
    profileSelected,
    popupProps,
  } = state;

  const mintProps = {
    dispatch,
    setLoader,
    setNotification,
    setClipboard,
    description,
    account,
    chainId,
    connector,
    file: zip,
    fileName,
    mainnet,
    chain: chain?.chain,
  };

  const singleMintProps = {
    dispatch,
    setLoader,
    setNotification,
    setClipboard,
    account,
    chainId,
    connector,
    file: file[0],
    metadata: {
      name: fileName,
      description,
      attributes: Object.values(attributes),
    },
    fileName,
    mainnet,
    chain: chain?.chain,
  };

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleAddAttribute = () => {
    handleSetState({
      attributes: {
        ...attributes,
        [Date.now()]: { trait_type: "", value: "" },
      },
    });
  };

  const handleRemoveAttribute = (id) => {
    if (Object.keys(attributes).length === 1) return;

    const newAttributes = {};
    for (const key in attributes) {
      if (key !== id) {
        newAttributes[key] = attributes[key];
      }
    }
    handleSetState({ attributes: newAttributes });
  };

  const handleChangeAttribute = (arg) => {
    const {
      event: {
        target: { name, value },
      },
      id,
    } = arg;
    handleSetState({
      attributes: { ...attributes, [id]: { ...attributes[id], [name]: value } },
    });
  };

  const handleCancel = () => {
    dispatch(setMinter(null));
    history.push("/mint");
  };

  const handleSetFileState = () => {
    console.log("handleSetFileState");
  };

  const changeFile = () => {
    history.push(`/mint/${minter.mintType}`);
  };

  const setMint = () => {
    if (!(window.localStorage.walletconnect || chainId)) return initConnectWallet({ dispatch });

    if (!chainId) {
      return dispatch(
        setNotification({
          message: "connect your wallet and try again",
          type: "warning",
        })
      );
    }
    if (file.length > 1) {
      if (!mintProps.description) {
        return dispatch(
          setNotification({
            message: "fill in the required fields",
            type: "warning",
          })
        );
      }
      dispatch(setOverlay(true));
      handleMint(mintProps).then((url) => {
        dispatch(setOverlay(false));
        if (typeof url === "object") {
          console.log("======MINTING======Collection======");

          handleSetState({
            popupProps: {
              url: url.message,
              isError: true,
              popup: true,
            },
          });
        } else {
          handleSetState({
            popupProps: {
              url,
              isError: false,
              popup: true,
            },
          });
        }
      });
    } else {
      if (!singleMintProps.fileName || !description) {
        return dispatch(
          setNotification({
            message: "fill out the missing fields",
            type: "warning",
          })
        );
      }

      dispatch(setOverlay(true));
      console.log("======MINTING======10f1s======1");

      handleSingleMint(singleMintProps).then((url) => {
        dispatch(setOverlay(false));
        console.log("======MINTING======10f1s======2");

        if (typeof url === "object") {
          console.log("======MINTING======10f1s======");
          const msg = url.message;
          const nftId = msg.slice(msg.lastIndexOf("/") + 1, msg.length);
          history.push(`/marketplace/1of1/preview/${chainId}/${nftId}`);

          // handleSetState({
          //   popupProps: {
          //     url: url.message,
          //     isError: true,
          //     popup: true,
          //   },
          // });
        } else {
          handleSetState({
            popupProps: {
              url,
              isError: false,
              popup: true,
            },
          });
        }
      });
    }
  };

  const handleConnectFromMint = (props) => {
    handleSetState({ toggleDropdown: false });
    dispatch(
      setConnectFromMint({
        chainId: props.networkId,
        isComingSoon: props.comingSoon,
      })
    );
  };

  useEffect(() => {
    if (chainId) {
      handleSetState({ chain: supportedChains[chainId] });
    }
  }, [chainId]);

  return (
    <div className={classes.container}>
      <Popup handleSetState={handleSetState} popupProps={popupProps} />
      {preview ? (
        <CollectionPreview
          previewSelectMode={previewSelectMode}
          file={file}
          metadata={metadata}
          handleMintSetState={handleSetState}
          collectionProfile={collectionProfile}
          handleSetFileState={handleSetFileState}
          zip={zip}
        />
      ) : (
        <div className={classes.wrapper}>
          <div>
            <section className={classes.assetContainer}>
              <div className={`${classes.imageContainers} ${file.length > 1 && classes._}`}>
                {file.length > 1 ? (
                  file
                    .filter((_, idx) => idx < 3)
                    .map((f, idx) => (
                      <div
                        key={idx}
                        style={{ backgroundImage: `url(${URL.createObjectURL(f)})` }}
                        className={classes.imageContainer}
                      />
                    ))
                ) : file[0].type === "video/mp4" ? (
                  <video src={URL.createObjectURL(file[0])} alt="" className={classes.singleImage} autoPlay loop />
                ) : (
                  <img src={URL.createObjectURL(file[0])} alt="" className={classes.singleImage} />
                )}
              </div>

              <div className={classes.assetInfo}>
                <div className={classes.innerAssetInfo}>
                  <div className={classes.assetInfoTitle}>
                    <span>{fName}</span>
                  </div>
                  <div>
                    <span>Number of assets:</span> <p>{file.length}</p>
                  </div>
                  {chainId === 4160 && (
                    <div className={classes.priceTooltip}>
                      <span>Mint Price:</span> <p className={classes.assetInfoMintPrice}>{file.length * 0.1} ALGO</p>
                      <GenadropToolTip content="Mint price is 0.01 per NFT" fill="#0d99ff" />
                    </div>
                  )}
                  {file.length > 1 ? (
                    <div onClick={() => handleSetState({ preview: true })} className={classes.showPreview}>
                      <span>view all assets</span>
                      <img src={rightArrow} alt="" />
                    </div>
                  ) : null}
                </div>
                <button onClick={changeFile} type="button">
                  Change asset
                </button>
              </div>
            </section>
            <div className={classes.mintForm}>
              <div className={classes.heading}>{file.length > 1 ? "Mint a collection" : "Mint 1 of 1"}</div>

              <section className={classes.details}>
                <div className={classes.category}>Asset Details</div>
                <div className={classes.inputWrapper}>
                  <label>
                    {" "}
                    Title <span className={classes.required}>*</span>
                  </label>
                  <input
                    style={metadata ? { pointerEvents: "none" } : {}}
                    type="text"
                    value={fileName}
                    onChange={(event) => handleSetState({ fileName: event.target.value })}
                  />
                </div>

                <div className={classes.inputWrapper}>
                  <label>
                    Description <span className={classes.required}>*</span>{" "}
                    <GenadropToolTip
                      content="This description will be visible on your collection page"
                      fill="#0d99ff"
                    />
                  </label>
                  <textarea
                    style={metadata?.length === 1 ? { pointerEvents: "none" } : {}}
                    rows="5"
                    value={description}
                    onChange={(event) => handleSetState({ description: event.target.value })}
                  />
                </div>

                <div className={classes.inputWrapper}>
                  <label>Attributes</label>
                  {!metadata ? (
                    <>
                      <div className={classes.attributes}>
                        {Object.keys(attributes).map((key, index) => (
                          <Attribute
                            key={index}
                            attribute={attributes[key]}
                            id={key}
                            index={index}
                            removeAttribute={handleRemoveAttribute}
                            changeAttribute={handleChangeAttribute}
                          />
                        ))}
                      </div>
                      <button type="button" onClick={handleAddAttribute}>
                        + Add Attribute
                      </button>
                    </>
                  ) : metadata.length === 1 ? (
                    <>
                      {metadata[0].attributes.map((attr, idx) => (
                        <div className={classes.attribute} key={idx}>
                          <div>{attr.trait_type}</div>
                          <div>{attr.value}</div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className={classes.metadata}>
                      <div>Number of assets: {metadata.length}</div>
                      <div className={classes.trait_type}>
                        Trait_types:
                        {metadata[0]?.attributes.map(({ trait_type }, idx) => (
                          <span key={idx}>{trait_type} </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {file.length > 1 && (
                  <>
                    <div className={`${classes.inputWrapper} ${classes.dropInputWrapper}`}>
                      <label>
                        Collection photo
                        <GenadropToolTip content="This image will be used as collection logo" fill="#0d99ff" />
                      </label>
                    </div>
                    <div className={`${classes.dropWrapper} ${collectionProfile && classes.dropWrapperSeleted}`}>
                      <div onClick={() => handleSetState({ toggleGuide: true })}>
                        {profileSelected ? (
                          <img src={URL.createObjectURL(file[0])} alt="" />
                        ) : (
                          <div className={classes.selectImg}>
                            <PlusIcon />
                            <p>Add photo</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </section>

              <section className={classes.mintOptions}>
                <div className={classes.category}>Set Mint Options</div>
                <div className={classes.inputWrapper}>
                  <label>Blockchain</label>
                  <div
                    onClick={() => handleSetState({ toggleDropdown: !toggleDropdown })}
                    className={`${classes.chain} ${classes.active}`}
                  >
                    {chainId ? (
                      <div className={classes.chainLabel}>
                        <img src={supportedChains[chainId].icon} alt="" />
                        {chain?.label}
                      </div>
                    ) : (
                      <span>Select Chain</span>
                    )}
                    <DropdownIcon className={classes.dropdownIcon} />
                  </div>
                  <div className={`${classes.chainDropdown} ${toggleDropdown && classes.active}`}>
                    {Object.values(supportedChains)
                      .filter((chainE) => mainnet === chainE.isMainnet)
                      .map((chainE, idx) => (
                        <div
                          onClick={() => (!chainE.comingSoon ? handleConnectFromMint(chainE) : {})}
                          className={`${classes.chain} ${chainE.comingSoon && classes.disable}`}
                          key={idx}
                          value={chainE.label}
                        >
                          <img src={chainE.icon} alt="" />
                          {chainE.label}
                        </div>
                      ))}
                  </div>
                </div>
              </section>

              <section className={classes.mintButtonWrapper}>
                <button type="button" onClick={setMint} className={classes.mintBtn}>
                  Mint
                </button>
                <button type="button" onClick={handleCancel} className={classes.cancelBtn}>
                  Cancel
                </button>
              </section>
            </div>
          </div>
        </div>
      )}
      <ProfileImgOverlay
        metadata={metadata}
        zip={zip}
        handleSetState={handleSetState}
        handleSetFileState={handleSetFileState}
        file={file}
        toggleGuide={toggleGuide}
        collectionProfile={collectionProfile}
      />
    </div>
  );
};

export default Minter;

{
  /* <button
onClick={() => {
  console.log('clicked');
  dispatch(
    setConnectFromMint({
      chainId: 1313161555,
      isComingSoon: false,
    })
  );
}}
>
test
</button> */
}
