import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useHistory, useRouteMatch, useLocation, Link } from "react-router-dom";
import classes from "./collection-single.module.css";
import { ReactComponent as CameraIcon } from "../../../assets/icon-camera.svg";
import collectionIcon from "../../../assets/icon-collection-light.svg";
import _1of1Icon from "../../../assets/icon-1of1-light.svg";
import { ReactComponent as BackIcon } from "../../../assets/icon-arrow-left.svg";
// import UploadOverlay from "../upload-overlay/upload-overlay";
import { handleZipFile } from "./collection-single-script";
import Minter from "../minter/minter";
import line from "../../../assets/icon-line.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { setMinter, setZip } from "../../../gen-state/gen.actions";
import { NearErrorPop, NearSuccessPopup } from "../popup/nearMintPopup";

const CollectionToSingleMinter = () => {
  const params = useParams();
  const history = useHistory();
  const { url } = useRouteMatch();
  const location = useLocation();
  const fileRef = useRef(null);
  const dragRef = useRef(null);

  const { zip: zipObg, dispatch } = useContext(GenContext);
  const [state, setState] = useState({
    mintType: "",
    cameraSwitch: false,
    loading1: false,
    loading2: false,
    acceptedFileType: "",
    file: null,
    fileName: "",
    metadata: null,
    zip: null,
    popupProps: {
      isError: false,
      Popup: false,
      url: "",
    },
  });

  const { mintType, loading1, loading2, acceptedFileType, file, fileName, metadata, zip, popupProps } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleCollectionClick = () => {
    history.push(url.replace("1of1", "collection"));
  };

  const handle1of1Click = () => {
    history.push(url.replace("collection", "1of1"));
  };

  const handleImageLoading1 = () => {
    handleSetState({ loading1: true });
  };

  const handleImageLoading2 = () => {
    handleSetState({ loading2: true });
  };

  useEffect(() => {
    const search = new URL(document.location).searchParams;
    if (search.get("errorCode")) {
      handleSetState({
        popupProps: {
          isError: true,
          Popup: true,
        },
      });
    }
    if (search.get("transactionHashes")) {
      handleSetState({
        popupProps: {
          isError: false,
          Popup: true,
          url: search.get("transactionHashes"),
        },
      });
    }
  }, []);

  const handleFileChange = (event) => {
    handleSetState({ fileName: "", file: null, metadata: null, zip: null });
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;
    const name = uploadedFile.name.replace(/\.+\s*\./, ".").split(".");
    const uploadedFileName = name.slice(0, name.length - 1).join(".");
    const fileType = name.slice(name.length - 1).join();
    if (!acceptedFileType.includes(fileType.toLowerCase())) return;

    if (fileType === "zip") {
      handleSetState({ zip: uploadedFile, fileName: uploadedFileName });
      handleZipFile({ uploadedFile, handleSetState });
    } else {
      handleSetState({ file: [uploadedFile], fileName: uploadedFileName });
    }
  };

  // read zip or camera picture file
  const handleZipUpload = () => {
    if (location.pathname === "/mint/collection" && zipObg.file.type === "application/zip") {
      handleSetState({ fileName: zipObg.name, zip: zipObg.file, file: null, metadata: null });
      handleZipFile({ uploadedFile: zipObg.file, handleSetState });
    } else {
      handleSetState({
        fileName: zipObg.name,
        file: [zipObg.file],
        metadata: {
          attributes: {
            0: { trait_type: "File Type", value: zipObg.file.type },
            1: { trait_type: "Category", value: zipObg.type },
          },
        },
        zip: null,
      });
    }
    dispatch(setZip({}));
  };

  useEffect(() => {
    dragRef.current.ondragover = (e) => {
      e.preventDefault();
      document.querySelector(".drop-area").style.border = "2px dashed green";
    };
    dragRef.current.ondragleave = (e) => {
      e.preventDefault();
      document.querySelector(".drop-area").style.border = "2px solid var(--outline)";
    };
    dragRef.current.ondrop = (e) => {
      e.preventDefault();
      document.querySelector(".drop-area").style.border = "2px solid green";
      handleFileChange({ target: e.dataTransfer });
    };
  }, []);

  useEffect(() => {
    if (params.mintId === "collection") {
      handleSetState({ acceptedFileType: ".zip" });
    } else {
      handleSetState({ acceptedFileType: ".jpg, .jpeg, .png, .webp, .gif" });
    }
    handleSetState({ mintType: params.mintId });
  }, [params.mintId]);

  useEffect(() => {
    if (Object.keys(zipObg).length !== 0) {
      handleZipUpload();
    }
  }, [zipObg]);

  useEffect(() => {
    if (!file) return;
    console.log("changed", { file });
    dispatch(setMinter({ file, fileName, metadata, zip, mintType }));
    history.push(`${url}/minter`);
  }, [file]);

  return (
    <div ref={dragRef} className={classes.container}>
      {/* <div ref={dropRef} style={{display: 'none'}} className="drop-area"><UploadOverlay /></div>  */}
      {popupProps.isError && <NearErrorPop handleSetState={handleSetState} popupProps={popupProps} />}
      {!popupProps.isError && popupProps.Popup && (
        <NearSuccessPopup handleSetState={handleSetState} popupProps={popupProps} />
      )}
      <>
        <Link to="/mint" className={classes.goBack}>
          <BackIcon className={classes.backIcon} />
        </Link>
        <header className={classes.headingWrapper}>
          {/* <h1 className={classes.heading}>Mint Your NFTs</h1> */}
          <p className={classes.description}>
            Upload a{" "}
            <span>
              {params.mintId === "1of1" ? "image" : "collection"}
              <img src={line} alt="" />
            </span>{" "}
            to create NFTs on any of our <br />
            supported blockchains super fast!
          </p>
        </header>

        <div className={classes.mintSwitch}>
          <button
            type="button"
            className={`${params.mintId === "collection" && classes.active}`}
            onClick={handleCollectionClick}
          >
            collection
          </button>
          <button type="button" className={`${params.mintId === "1of1" && classes.active}`} onClick={handle1of1Click}>
            1 of 1
          </button>
        </div>

        {mintType === "collection" ? (
          <div className={`${classes.card} ${classes[params.mintId]} drop-area`}>
            {!loading1 ? <div className={classes.imagePlaceholder} /> : null}
            <img
              style={!loading1 ? { display: "none" } : {}}
              src={collectionIcon}
              alt=""
              onLoad={handleImageLoading1}
            />
            <h3 className={classes.title}> Mint a collection</h3>
            <p className={classes.action}>Drag and Drop your zip file created using Genadrop Create app</p>
            <p className={classes.supportedFiles}>
              We only support .Zip files for collection mints and deploy to Celo, Algorand, Aurora, and Polygon{" "}
            </p>
            <div>or</div>
            <button type="button" onClick={() => fileRef.current.click()} className={classes.btn}>
              Browse files
            </button>
          </div>
        ) : mintType === "1of1" ? (
          <div className={`${classes.card} ${classes[`_${params.mintId}`]} drop-area`}>
            {!loading2 ? <div className={classes.imagePlaceholder} /> : null}
            <img style={!loading2 ? { display: "none" } : {}} src={_1of1Icon} alt="" onLoad={handleImageLoading2} />
            <h3 className={classes.title}> Mint 1 of 1 </h3>
            <Link className={classes.takePic} to="/mint/camera">
              <div>
                <CameraIcon />
              </div>
              <p>Open Camera</p>
            </Link>
            <div className={classes.explanatoryText}>
              <div>Take photo / video & mint straight away</div>
              <p>Record video and turn it into a GIF</p>
            </div>
            <div>or</div>
            <button type="button" onClick={() => fileRef.current.click()} className={classes.btn}>
              Browse files
            </button>
            <div className={classes.explanatoryText}>
              <div>Drag and Drop your image file here</div>
              <p>We support JPG, PNG, webp files and deploy to Celo, Algorand, Near, and Polygon </p>
              <p>Max file size: 20mb </p>
            </div>
          </div>
        ) : (
          <div className={classes.cardPlaceholder} />
        )}

        <input
          style={{ display: "none" }}
          onChange={handleFileChange}
          ref={fileRef}
          type="file"
          accept={acceptedFileType}
        />
      </>
    </div>
  );
};

export default CollectionToSingleMinter;
