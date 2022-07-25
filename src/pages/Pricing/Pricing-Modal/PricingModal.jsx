import classes from "./PricingModal.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import paypalIcon from "../../../assets/icon-paypal.svg";
import stripeIcon from "../../../assets/icon-stripe.svg";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { saveSession } from "../../../renderless/store-data/StoreData.script";
import { setCollectionName, setCurrentSession, setToggleCollectionNameModal } from "../../../gen-state/gen.actions";
import { useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import { useHistory } from "react-router-dom";

const PricingModal = ({ modal, closeModal }) => {
  const history = useHistory();
  const [activeMode, setActive] = useState("paypal");
  const { currentUser, dispatch } = useContext(GenContext);

  /**
   * Before payment, create a paymentID which will also be a sessionID
   * Use the ID to process payment.
   * If payment was successful, create a session for the user using the same sessionID
   * used in processing payment.
   * if creating session was successful, prompt the user to choose a collection name
   * setCurrentSession(sessionId)
   */

  const handleClick = async () => {
    let ID = uuid();
    try {
      // process payment using this ID
      // If payment was successful, create a session for the user using the same ID
      const sessionId = await saveSession({ currentUser, sessionId: ID });
      if (!sessionId) return; // showNotification
      console.log({ sessionId });
      dispatch(setCurrentSession(sessionId));
      dispatch(setCollectionName(""));
      dispatch(setToggleCollectionNameModal(true));
      history.push("/create");
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    closeModal();
  };

  return (
    <div className={`${classes.container} ${modal && classes.active}`}>
      <div className={classes.wrapper}>
        <CloseIcon onClick={handleClose} className={classes.closeBtn} />
        <div className={classes.content}>
          <h1>Choose a payment method</h1>
          <div className={classes.methodContainer}>
            <div
              onClick={() => setActive("paypal")}
              className={`${activeMode === "paypal" && classes.active} ${classes.paymentMethod}`}
            >
              <img src={paypalIcon} alt="" />
              <div>Paypal</div>
            </div>
            <div
              onClick={() => setActive("stripe")}
              className={`${activeMode === "stripe" && classes.active} ${classes.paymentMethod}`}
            >
              <img src={stripeIcon} alt="" />
              <div>Stripe</div>
            </div>
          </div>
          <button onClick={handleClick}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
