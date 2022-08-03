import classes from "./PricingModal.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import stripeIcon from "../../../assets/icon-stripe.svg";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { saveSession } from "../../../renderless/store-data/StoreData.script";
import { setCollectionName, setCurrentSession, setToggleCollectionNameModal } from "../../../gen-state/gen.actions";
import { useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import { useHistory } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalButton from "./PaypalButton";
import { useEffect } from "react";

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.STRIPE_LIVE_PUBLIC_KEY);
  }
  return stripePromise;
};

const PricingModal = ({ modal, price, closeModal }) => {
  const history = useHistory();
  const [activeMode, setActive] = useState("paypal");
  const [loading, setLoading] = useState(false);
  const { currentUser, dispatch } = useContext(GenContext);

  /**
   * Before payment, create a paymentID which will also be a sessionID
   * Use the ID to process payment.
   * If payment was successful, create a session for the user using the same sessionID
   * used in processing payment.
   * if creating session was successful, prompt the user to choose a collection name
   * setCurrentSession(sessionId)
   */

  const [stripeError, setStripeError] = useState(null);

  const initialOptionsPaypal = {
    "client-id": process.env.PAYPAL_LIVE_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  const item = [
    {
      price: "price_1LQrfZFiDLqRMLIXoXqtKhas",
      quantity: 1,
    },
    {
      price: "price_1LQriKFiDLqRMLIX1HBQwggL",
      quantity: 1,
    },
    {
      price: "price_1LQroRFiDLqRMLIXBVqu6fbY",
      quantity: 1,
    },
  ];

  const createOrderHandler = (data, actions) => {
    // Set up the transaction
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: price,
          },
        },
      ],
    });
  };

  const onApproveHandler = (data, actions) => {
    // This function captures the funds from the transaction.
    return actions.order.capture().then(function (details) {
      // This function shows a transaction success message to your buyer.
      handleClick();
    });
  };

  const checkoutOptions = {
    lineItems: [item[0]],
    mode: "payment",
    successUrl: `${window.location.origin}/success`, // you decide where to redirect. This is just for test
    cancelUrl: `${window.location.origin}/cancel`,
  };

  const redirectToCheckout = async () => {
    setLoading(true);
    console.log("redirectToCheckout");

    const stripe = await getStripe();
    console.log("Got stripe");
    const res = await stripe.redirectToCheckout(checkoutOptions);
    console.log("Stripe checkout error", res);

    if (res.error) setStripeError(res.error.message);
    // else handleClick();
    setLoading(false);
  };

  if (stripeError) alert(stripeError);

  const handleClick = async () => {
    let ID = uuid();
    try {
      // process payment using this ID
      // If payment was successful, create a session for the user using the same ID
      const sessionId = await saveSession({ currentUser, sessionId: ID });
      if (!sessionId) return; // showNotification
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
            <PayPalScriptProvider options={initialOptionsPaypal}>
              <PaypalButton createOrder={createOrderHandler} onApprove={onApproveHandler} />
            </PayPalScriptProvider>

            <div
              onClick={redirectToCheckout}
              className={`${activeMode === "stripe" && classes.active} ${classes.paymentMethod}`}
            >
              <img src={stripeIcon} alt="" />
              {/* <div>Stripe</div> */}
            </div>
          </div>
          <button onClick={handleClick}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
