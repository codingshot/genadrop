import ReactDOM from "react-dom";
import classes from "./imageModal.module.css";
import CloseIcon from "../../../assets/ModalCancel.svg";

function ImageModalContainer({ setOpen, image }) {
  function close() {
    setOpen(false);
  }

  return ReactDOM.createPortal(
    <>
      <div className={classes.modalShadow} onClick={close}></div>
      <div className={classes.Modal}>
        <div>
          <img onClick={close} className={classes.CloseIcon} src={CloseIcon} alt="" role="button" />
        </div>
        <img className={classes.ModalImage} src={image} alt="" />
      </div>
    </>,
    document.getElementById("image-modal")
  );
}

export default ImageModalContainer;
