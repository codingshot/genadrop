import React, { useRef, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Webcam from "react-webcam";
import classes from "./Capture.module.css";
import WebcamEnable from "../webcam-enable/webcamEnable";
import { ReactComponent as IconCapture } from "../../../assets/capture-btn.svg";
import { ReactComponent as CameraSwitch } from "../../../assets/camera-switch.svg";
import { ReactComponent as ArrowLeft } from "../../../assets/arrow-left-stretched.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { setZip } from "../../../gen-state/gen.actions";

const Capture = () => {
  const history = useHistory();
  const webcamRef = useRef(null);
  const [state, setState] = useState({
    toggle: false,
    img: "",
    webcam: "environment",
  });

  const { toggle, img, webcam } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };
  const { zip: zipObg, dispatch } = useContext(GenContext);

  const videoConstraints = {
    facingMode: webcam,
  };

  const switchCameraToRear = () => {
    const webcamStatus = webcam === "user" ? "environment" : "user";
    handleSetState({ webcam: webcamStatus });
  };

  const getVideo = () => {
    // toggle off webcam popup request
    handleSetState({
      toggle: true,
    });
  };

  const takePicture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    handleSetState({ img: imageSrc });
  };

  const cancel = () => {
    history.push("/mint/1of1");
  };

  const downloadImg = () => {
    const ImageBase64 = img.split("data:image/png;base64,")[1];
    const a = document.createElement("a"); // Create <a>
    a.href = `data:image/png;base64,${ImageBase64}`; // Image Base64 Goes here
    a.download = "Image.png"; // File name Here
    a.click(); // Downloaded file
  };
  function getFileFromBase64(string64, fileName) {
    const trimmedString = string64.replace("data:image/png;base64,", "");
    const imageContent = atob(trimmedString);
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer);

    for (let n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }
    const type = "image/png";
    const blob = new Blob([buffer], { type });
    return new File([blob], fileName, { lastModified: new Date().getTime(), type });
  }

  const continueToMint = () => {
    const result = getFileFromBase64(img, "Image.png");
    dispatch(
      setZip({
        name: "Image",
        file: result,
      })
    );

    history.push("/mint/1of1");
  };
  return (
    <div className={`${classes.container}`}>
      <WebcamEnable toggle={toggle} getVideo={getVideo} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} className={!img && classes.none}>
        <div
          onClick={() => {
            handleSetState({
              img: "",
            });
          }}
          className={classes.retake}
        >
          <ArrowLeft />
          <p>Retake photo</p>
        </div>
        <img className={`${classes.cameraShot} ${!img && classes.inActive}`} src={img} alt="camera-shot" />
        <div className={classes.imgBtn}>
          <a onClick={downloadImg}>Download photo</a>
          <div onClick={continueToMint}>Continue</div>
        </div>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
        className={img && classes.none}
      >
        <div className={classes.videoWrapper}>
          {toggle ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              height="100%"
              screenshotFormat="image/png"
              width="100%"
              videoConstraints={videoConstraints}
            />
          ) : (
            <div className={classes.videoOFF} />
          )}
          <div className={classes.enableContainer}> </div>
        </div>
        <div className={toggle ? classes.btnWrapper : classes.inactiveBtnWrapper}>
          <div onClick={cancel} className={classes.cancelBtn}>
            Cancel
          </div>
          <div onClick={takePicture} className={classes.captureBtn}>
            <IconCapture />
          </div>

          <div className={classes.uploadBtn}>
            <CameraSwitch onClick={() => switchCameraToRear()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Capture;
