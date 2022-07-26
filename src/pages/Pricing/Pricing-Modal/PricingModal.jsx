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
import { loadStripe } from "@stripe/stripe-js";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalButton from "../../paypal/paypalButton";

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
  }

  return stripePromise;
};

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

  const [stripeError, setStripeError] = useState(null);

  const initialOptionsPaypal = {
    "client-id": "test",
    currency: "USD",
    intent: "capture",
  };

  const item = [
    {
      price: "price_1LPcwyBNj5DiViWraDJpzpeh",
      quantity: 1,
    },
    {
      price: "price_1LPcxsBNj5DiViWrY6LBUNHp",
      quantity: 1,
    },
    {
      price: "price_1LPcyWBNj5DiViWrS47kiQgt",
      quantity: 1,
    },
  ];

  const createOrderHandler = (data, actions) => {
    // Set up the transaction
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "15",
          },
        },
      ],
    });
  };

  const onApproveHandler = (data, actions) => {
    // This function captures the funds from the transaction.
    return actions.order.capture().then(function (details) {
      // This function shows a transaction success message to your buyer.
      alert("Transaction completed by " + details.payer.name.given_name);
    });
  };

  const checkoutOptions = {
    lineItems: [item[modal - 1]],
    mode: "payment",
    successUrl: `${window.location.origin}/success`, // you decide where to redirect. This is just for test
    cancelUrl: `${window.location.origin}/cancel`,
  };

  const redirectToCheckout = async () => {
    setLoading(true);
    console.log("redirectToCheckout");

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout(checkoutOptions);
    console.log("Stripe checkout error", error);

    if (error) setStripeError(error.message);
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
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons createOrder={createOrderHandler} onApprove={onApproveHandler} />
            </PayPalScriptProvider>
            <div
              onClick={() => setActive("paypal")}
              className={`${activeMode === "paypal" && classes.active} ${classes.paymentMethod}`}
            >
              <img src={paypalIcon} alt="" />
              <div>Paypal</div>
            </div>
            <div
              onClick={redirectToCheckout}
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
