import ReactDOM from "react-dom";
import { QrReader } from "react-qr-reader";

import classes from "./imageModal.module.css";
import CloseIcon from "../../../assets/ModalCancel.svg";
import { setNotification } from "../../../gen-state/gen.actions";

function QrReaderContainer({ handleCloseModal, handleAddress, dispatch }) {
  function close() {
    handleCloseModal();
  }

  function handleCodeScanned(result, error) {
    if (!!result) {
      if (
        result?.text?.includes("https//") ||
        result?.text?.length >= 42 ||
        (result?.text?.endsWith(".near") && mainnet) ||
        (result?.text?.endsWith(".testnet") && !mainnet)
      ) {
        handleAddress({ receiverAddress: result?.text });
        handleCloseModal();
      } else {
        dispatch(
          setNotification({
            type: "warning",
            message: "Recipient address is invalid",
          })
        );
        handleCloseModal();
      }
    }

    if (!!error) {
      console.info(error);
    }
  }

  return ReactDOM.createPortal(
    <>
      <div className={classes.modalShadow} onClick={close} />
      <div className={classes.Modal}>
        <div className={classes.closeBtn}>
          <img onClick={close} className={classes.CloseIcon} src={CloseIcon} alt="" role="button" />
        </div>
        <div className={classes.modalContent}>
          <h1>Scan Address</h1>
          <p>Place the QR code in front of your camera</p>
          <QrReader onResult={(result, error) => handleCodeScanned(result, error)} className={classes.qrCode} />
        </div>
      </div>
    </>,
    document.getElementById("image-modal")
  );
}

export default QrReaderContainer;
