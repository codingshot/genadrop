import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { setClipboard, setLoader, setLoading, setNotification } from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";
import Attribute from "../Attribute/Attribute";
import { handleMint, handleSingleMint } from "./minter-script";
import classes from "./minter.module.css";
import CollectionPreview from "../collection-preview/collectionPreview";
import rightArrow from "../../../assets/icon-arrow-right.svg";
import infoIcon from "../../../assets/icon-info.svg";
import dropImg from "../../../assets/icon-1of1-light.svg";
import ProfileImgOverlay from "../ProfileImgOverlay/ProfileImgOverlay";
import Popup from "../popup/popup.component";

const Minter = ({ data, changeFile, handleSetFileState }) => {
  const { file, fileName: fName, metadata, zip } = data;
  const { dispatch, connector, account, chainId, mainnet } = useContext(GenContext);
  const [state, setState] = useState({
    attributes: { [Date.now()]: { trait_type: "", value: "" } },
    fileName: fName,
    description: metadata?.length === 1 ? metadata[0].description : "",
    price: "",
    chain: null,
    preview: false,
    dollarPrice: 0,
    collectionProfile: "",
    toggleGuide: false,
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
    price,
    chain,
    preview,
    dollarPrice,
    collectionProfile,
    toggleGuide,
    previewSelectMode,
    profileSelected,
    popupProps,
  } = state;

  const chains = [
    {
      label: "Algorand",
      networkId: 4160,
      symbol: "ALGO",
      chain: "Algorand",
    },
    {
      label: "Celo",
      networkId: 42220,
      symbol: "CGLD",
      chain: "Celo",
    },
    {
      label: "Celo testnet",
      networkId: 44787,
      symbol: "CGLD",
      chain: "Celo",
    },
    {
      label: "Polygon",
      networkId: 137,
      symbol: "MATIC",
      chain: "Polygon",
    },
    {
      label: "Polygon Testnet",
      networkId: 80001,
      symbol: "MATIC",
      chain: "Polygon",
    },
    {
      label: "Aurora",
      networkId: 1313161554,
      symbol: "AURORA",
      chain: "Aurora",
    },
    {
      label: "Aurora testnet",
      networkId: 1313161555,
      symbol: "AURORA",
      chain: "Aurora",
    },
  ];

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
    price,
    mainnet,
    chain: chain?.chain,
    dollarPrice,
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
    price,
    mainnet,
    chain: chain?.chain,
    dollarPrice,
  };

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const getUintByChain = {
    algorand: "Algo",
    celo: "CGLD",
    polygon: "Matic",
    "polygon testnet": "Matic",
    "aurora testnet": "ETH",
    aurora: "ETH",
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

  const handlePrice = (event) => {
    handleSetState({ price: event.target.value > 0 ? event.target.value : 0 });
  };

  const setMint = () => {
    if (!chainId) {
      return dispatch(
        setNotification({
          message: "connect your wallet and try again",
          type: "warning",
        })
      );
    }
    const c = chains.find((e) => e.networkId.toString() === chainId.toString());
    if (!c)
      return dispatch(
        setNotification({
          message: "unsupported chain detected",
          type: "error",
        })
      );
    if (!parseInt(price)) {
      return dispatch(
        setNotification({
          message: "enter a valid price",
          type: "warning",
        })
      );
    }
    if (file.length > 1) {
      if (!mintProps.description) {
        return dispatch(
          setNotification({
            message: "fill out the required fields",
            type: "warning",
          })
        );
      }
      dispatch(setLoading(true));
      handleMint(mintProps).then((url) => {
        dispatch(setLoading(false));
        if (typeof url === "object") {
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
      dispatch(setLoading(true));
      handleSingleMint(singleMintProps).then((url) => {
        dispatch(setLoading(false));
        if (typeof url === "object") {
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
    }
  };

  useEffect(() => {
    if (chainId) {
      const c = chains.find((e) => e.networkId.toString() === chainId.toString());
      if (!c) return handleSetState({ chain: { label: "unsupported chain" } });
      handleSetState({ chain: c });
      if (c.symbol === "AURORA") {
        axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd").then((res) => {
          handleSetState({ dollarPrice: price / res.data.ethereum.usd });
        });
      } else {
        axios.get(`https://api.coinbase.com/v2/prices/${c.symbol}-USD/spot`).then((res) => {
          handleSetState({ dollarPrice: price / res.data.data.amount });
        });
      }
    }
  }, [price, chainId]);

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
          <section className={classes.asset}>
            <div className={`${classes.imageContainers} ${file.length > 1 && classes._}`}>
              {file.length > 1 ? (
                file
                  .filter((_, idx) => idx < 3)
                  .map((f) => (
                    <div
                      style={{ backgroundImage: `url(${URL.createObjectURL(f)})` }}
                      className={classes.imageContainer}
                    />
                  ))
              ) : (
                <img src={URL.createObjectURL(file[0])} alt="" className={classes.singleImage} />
              )}
            </div>

            <div className={classes.assetInfo}>
              <div className={classes.innerAssetInfo}>
                <p>{fName}</p>
                <p>Number of assets: {file.length}</p>
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

          <section className={classes.type}>
            <div>{file.length > 1 ? "Collection Mint" : "Mint 1 of 1s"}</div>
          </section>

          <section className={classes.details}>
            {file.length > 1 && (
              <>
                {" "}
                <div className={classes.category}>Collection Logo</div>
                <div className={`${classes.dropWrapper} ${collectionProfile && classes.dropWrapperSeleted}`}>
                  <p>This image will also be used as collection logo</p>
                  <div onClick={() => handleSetState({ toggleGuide: true })}>
                    <img src={profileSelected ? URL.createObjectURL(file[0]) : dropImg} alt="" />
                  </div>
                </div>
              </>
            )}
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
                Description <span className={classes.required}>*</span>
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
                        key={key}
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
          </section>

          <section className={classes.mintOptions}>
            <div className={classes.info}>
              <img src={infoIcon} alt="" />
              <span>Your asset(s) will be automatically listed on Genadrop marketplace</span>
            </div>
            <div className={classes.category}>Set Mint Options</div>
            <div className={classes.inputWrapper}>
              <label>
                Price ({getUintByChain[chain?.label.toLowerCase()]}) <span className={classes.required}>*</span>
              </label>
              {chainId ? (
                <div className={classes.price}>
                  <input type="number" min="0" value={price} onChange={handlePrice} />
                  <span>
                    {dollarPrice.toFixed(4)} USD
                  </span>
                </div>
              ) : (
                <span className={classes.warn}>Connect wallet to add price</span>
              )}
            </div>

            <div className={classes.inputWrapper}>
              <label>Blockchain: {chainId ? "" : "---"} </label>
              {chainId && <div className={classes.metadata}>{chain?.label}</div>}
            </div>
          </section>

          <section className={classes.mintButtonWrapper}>
            <button type="button" onClick={setMint} className={classes.mintBtn}>
              Mint
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.reload();
                changeFile;
              }}
              className={classes.cancelBtn}
            >
              Cancel
            </button>
          </section>
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
