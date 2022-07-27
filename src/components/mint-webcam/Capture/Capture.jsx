import React, { useRef, useState } from "react";
import classes from "./Capture.module.css";
import WebcamEnable from "../webcam-enable/webcamEnable";
import { ReactComponent as IconCapture } from "../../../assets/capture-btn.svg";
import { ReactComponent as CameraSwitch } from "../../../assets/camera-switch.svg";
import { ReactComponent as ArrowLeft } from "../../../assets/arrow-left-stretched.svg";

const Capture = ({ handleSetState: handleMintSetState }) => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [state, setState] = useState({
    toggle: false,
    img: "",
    currentStream: {},
    webcam: "environment",
  });

  const { toggle, img, currentStream, webcam } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const switchCameraToRear = () => {
    currentStream?.getTracks().forEach((track) => track.stop());
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: webcam,
        },
      })
      .then((stream) => {
        const webcamStatus = webcam === "user" ? "environment" : "user";
        handleSetState({ webcam: webcamStatus });
        handleSetState({ currentStream: stream });
        const video = videoRef.current;
        video.srcObject = stream;
        video?.play();
      })
      .catch(console.error);
  };

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.onloadedmetadata = function (e) {
          video.play();
        };
        handleSetState({ currentStream: stream });
        handleSetState({
          toggle: true,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const takePicture = () => {
    const width = videoRef?.current.videoWidth;
    const height = videoRef?.current.videoHeight;

    const video = videoRef?.current;

    const photo = photoRef?.current;
    if (photo) {
      photo.width = width;

      photo.height = height;

      const ctx = photo.getContext("2d");
      ctx.drawImage(video, 0, 0, width, height);
      const imageUrl = photo.toDataURL("image/webp", 1);
      handleSetState({ img: imageUrl });
    }
  };

  const cancel = () => {
    currentStream?.getTracks().forEach((track) => track.stop());
    handleSetState({ currentStream: {} });
    handleMintSetState({ cameraSwitch: false });
  };

  const clearImage = () => {
    const photo = photoRef.current;

    const ctx = photo.getContext("2d");

    ctx.clearRect(0, 0, photo.width, photo.height);
    handleSetState({ img: "" });
  };

  const downloadImg = () => {
    const ImageBase64 = img.split("data:image/webp;base64,")[1];
    const a = document.createElement("a"); // Create <a>
    a.href = `data:image/png;base64,${ImageBase64}`; // Image Base64 Goes here
    a.download = "Image.png"; // File name Here
    a.click(); // Downloaded file
  };
  function getFileFromBase64(string64, fileName) {
    const trimmedString = string64.replace("data:image/webp;base64,", "");
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
    currentStream?.getTracks().forEach((track) => track.stop());
    handleSetState({ currentStream: {} });
    handleMintSetState({
      file: [result],
      fileName: "Image.png",
    });
  };
  return (
    <div className={`${classes.container}`}>
      <WebcamEnable handleMintSetState={handleMintSetState} toggle={toggle} getVideo={getVideo} />

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
        <canvas className={`${classes.cameraShot} ${!img && classes.inActive}`} ref={photoRef} />
        <div className={classes.imgBtn}>
          <a onClick={downloadImg}>Download photo</a>
          <div onClick={continueToMint}>Continue</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} className={img && classes.none}>
        <div className={classes.videoWrapper}>
          <video className={img && classes.inActive} ref={videoRef} />
          <div className={() => videoRef.current?.play()}>Click ME to record</div>
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
