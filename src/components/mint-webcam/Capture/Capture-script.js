import axios from "axios";
import { setLoader, setNotification } from "../../../gen-state/gen.actions";

// create file from bytes
function getFileFromBytes(string64, fileName, type) {
  const buffer = new ArrayBuffer(string64.length);
  const view = new Uint8Array(buffer);

  for (let n = 0; n < string64.length; n += 1) {
    view[n] = string64.charCodeAt(n);
  }
  const blob = new Blob([buffer], { type });
  return new File([blob], fileName, { lastModified: new Date().getTime(), type });
}

// Genrate GIF
async function generateGif(handleSetState, dispatch, imgList, videoDuration) {
  dispatch(setLoader("Generating GIF"));
  handleSetState({
    gifGenrating: true,
  });
  axios
    .post("https://phantaminum.pythonanywhere.com/gif", {
      urls: imgList,
      duration: videoDuration / 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then((res) => {
      const gifFile = getFileFromBytes(res.data.data, "Image.gif", "image/gif");
      handleSetState({ gif: gifFile, currenFile: gifFile });

      dispatch(setLoader(""));
      dispatch(
        setNotification({
          message: "GIF generated successfully",
          type: "success",
        })
      );
      handleSetState({
        gifGenrating: false,
      });
      return res.data.data;
    })
    .catch(() => {
      dispatch(setLoader(""));
      dispatch(
        setNotification({
          message: `Something Went Wrong, Please Try Again`,
          type: "error",
        })
      );
    });
}
// update Video dimensions on screen resize
const updateVideoSize = (webcamWrapper, handleSetState) => {
  const newWidth = webcamWrapper.current?.clientWidth;
  const newHeight = webcamWrapper.current?.clientHeight;
  handleSetState({ height: newHeight, width: newWidth });
};

// switch camera from front to rear for mobile view
const switchCameraToRear = (webcam, handleSetState, webcamRef) => {
  const webcamStatus = webcam === "user" ? "environment" : "user";
  handleSetState({ webcam: webcamStatus });
  webcamRef.current.switchCamera();
};

// Picture Handler
const takePicture = (webcamRef, handleSetState) => {
  const imageSrc = webcamRef.current.takePhoto();
  handleSetState({ img: imageSrc });
};
const downloadImg = (img) => {
  const ImageBase64 = img.split("data:image/png;base64,")[1];
  const a = document.createElement("a"); // Create <a>
  a.href = `data:image/png;base64,${ImageBase64}`; // Image Base64 Goes here
  a.download = "Image.png"; // File name Here
  a.click(); // Downloaded file
};

function getFileFromBase64(string64, fileName, type) {
  const trimmedString = string64.split(",")[1];
  const imageContent = atob(trimmedString);
  const buffer = new ArrayBuffer(imageContent.length);
  const view = new Uint8Array(buffer);
  for (let n = 0; n < imageContent.length; n += 1) {
    view[n] = imageContent.charCodeAt(n);
  }
  const blob = new Blob([buffer], { type });
  return new File([blob], fileName, { lastModified: new Date().getTime(), type });
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
export {
  getFileFromBytes,
  getFileFromBase64,
  downloadImg,
  takePicture,
  switchCameraToRear,
  updateVideoSize,
  generateGif,
  capitalizeFirstLetter,
  isEmpty,
};

// Video functions

// file type switch
// useEffect(() => {
//   if (activeFile === "gif") {
//     if (gif) {
//       handleSetState({ currenFile: gif });
//     } else {
//       generateGif(currenFile);s
//     }
//   } else if (activeFile === "mp4") {
//     handleSetState({
//       currenFile: video,
//     });
//   }
// }, [activeFile]);

// const capture = () => {
//   const v = videoRef.current;
//   const { duration } = v;
//   const totalSecond = parseInt(duration, 10);
//   Array(totalSecond + 1)
//     .fill(null)
//     .forEach((_, index) => {
//       setTimeout(() => {
//         v.currentTime = index;
//         const canvasRef = document.createElement("canvas");
//         canvasRef.width = videoRef.current.videoWidth;
//         canvasRef.height = videoRef.current.videoHeight;
//         canvasRef
//           .getContext("2d")
//           .drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
//         const newCanvas = document.createElement("canvas");
//         const newCtx = newCanvas.getContext("2d");
//         newCtx.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
//         console.log("dataUrl", newCanvas.toDataURL());
//       }, index * 1000);
//     });

// canvasRef.current.toBlob((blob) => {
//   const img = new Image();
//   img.setAttribute('crossorigin', 'anonymous');
//   img.src = window.URL.createObjectUrl(blob);
// })
// };

//    {!img && (
//               <div className={classes.typeSelcet}>
//                 <div
//                   onClick={() => handleSetState({ activeFile: "gif" })}
//                   className={activeFile === "gif" && classes.active}
//                 >
//                   <div className={classes.rdaioBtn}>
//                     <div />
//                   </div>
//                   <p>GIF</p>
//                 </div>
//                 <div
//                   onClick={() => handleSetState({ activeFile: "mp4" })}
//                   className={activeFile === "mp4" && classes.active}
//                 >
//                   <div className={classes.rdaioBtn}>
//                     <div />
//                   </div>
//                   <p>MP4</p>
//                 </div>
//               </div>
//             )}
//             <a onClick={downloadImg}>Download photo</a>

// update the video to fit different screen
// const isLandscape = height <= width;
// const ratio = isLandscape ? width / height : height / width;
// const videoConstraints = {
//   facingMode: webcam,
//   width,
//   height,
//   // ...(ratio && { ratio }),
// };
