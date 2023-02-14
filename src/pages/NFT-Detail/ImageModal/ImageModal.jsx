import ReactDOM from "react-dom";
import { QrReader } from "react-qr-reader";

import classes from "./imageModal.module.css";
import CloseIcon from "../../../assets/ModalCancel.svg";

function QrReaderContainer({ handleCloseModal }) {
  function close() {
    handleCloseModal();
  }

  function handleCodeScanned(result, error) {
    if (!!result) {
      console.log(result?.text);
      handleCloseModal();
    }

    // if (!!error) {
    //   console.info(error);
    // }
  }

  return ReactDOM.createPortal(
    <>
      <div className={classes.modalShadow} onClick={close}></div>
      <div className={classes.Modal}>
        <div>
          <img onClick={close} className={classes.CloseIcon} src={CloseIcon} alt="" role="button" />
        </div>
        <div>
          <h1>Scan your Address</h1>
          <QrReader onResult={(result, error) => handleCodeScanned(result, error)} style={{ width: "100%" }} />
        </div>
      </div>
    </>,
    document.getElementById("image-modal")
  );
}

export default QrReaderContainer;
