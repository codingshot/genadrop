/* eslint-disable no-alert */
/* eslint-disable no-use-before-define */
/* eslint-disable func-names */
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import classes from "./PricingModal.module.css";
import PaypalButton from "./PaypalButton";
import { ReactComponent as StripeIcon } from "../../../assets/icon-stripe.svg";
import { saveUserData } from "../../../renderless/store-data/StoreDataLocal";
import { GenContext } from "../../../gen-state/gen.context";
import { setOverlay } from "../../../gen-state/gen.actions";

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_LIVE_PUBLIC_KEY);
  }
  return stripePromise;
};

const PricingModal = ({ plan, price, closeModal }) => {
  const history = useHistory();
  const {
    layers,
    nftLayers,
    rule,
    preview,
    collectionName,
    sessionId,
    upgradePlan,
    proposedPlan,
    currentPlan,
    currentUser,
    dispatch,
  } = useContext(GenContext);
  const [stripeError, setStripeError] = useState(null);

  const initialOptionsPaypal = {
    "client-id": process.env.REACT_APP_PAYPAL_LIVE_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  const item = {
    local: {
      price: "price_1LPcyWBNj5DiViWrS47kiQgt",
      quantity: 1,
    },
    test: {
      price: "price_1LXs3aFiDLqRMLIX4KmmZYyS",
      quantity: 1,
    },
    hobby: {
      price: "price_1LQrfZFiDLqRMLIXoXqtKhas",
      quantity: 1,
    },
    pro: {
      price: "price_1LQriKFiDLqRMLIX1HBQwggL",
      quantity: 1,
    },
    agency: {
      price: "price_1LQroRFiDLqRMLIXBVqu6fbY",
      quantity: 1,
    },
    hobbyToPro: {
      price: "",
      quantity: 1,
    },
    hobbyToAgency: {
      price: "price_1LS7igFiDLqRMLIXTkWBHspT",
      quantity: 1,
    },
    proToAgency: {
      price: "price_1LS7maFiDLqRMLIXW1GZTDeg",
      quantity: 1,
    },
  };

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
    return actions.order
      .capture()
      .then(function () {
        // This function shows a transaction success message to your buyer.
        handleClick();
      })
      .catch((error) => {
        console.log(error);
        history.push("/create/session/pricing/failed");
        handleClose();
      });
  };

  const checkoutOptions = {
    lineItems: [item[plan]], // replace test with plan. plan is a variable name
    mode: "payment",
    successUrl: `${window.location.origin}/create/session/create`,
    cancelUrl: `${window.location.origin}/create/session/pricing/failed`,
  };

  const redirectToCheckout = async () => {
    console.log("redirectToCheckout");
    saveUserData({
      layers,
      nftLayers,
      rule,
      preview,
      collectionName,
      sessionId,
      upgradePlan,
      proposedPlan,
      currentPlan,
      currentUser,
    });
    dispatch(setOverlay(true));
    const stripe = await getStripe();
    window.sessionStorage.createNew = "kd@#ff_dafknk_fiiqv//";
    dispatch(setOverlay(false));
    console.log("Got stripe");
    const res = await stripe.redirectToCheckout(checkoutOptions);
    console.log("Stripe checkout error", res);

    if (res.error) setStripeError(res.error.message);
  };

  if (stripeError) alert(stripeError);

  const handleClick = () => {
    window.sessionStorage.createNew = "kd@#ff_dafknk_fiiqv//";
    history.push("/create/session/create");
    handleClose();
  };

  const handleClose = () => {
    closeModal();
  };

  return (
    <div className={`${classes.container} ${plan && classes.active}`}>
      <div className={classes.wrapper}>
        <CloseIcon onClick={handleClose} className={classes.closeBtn} />
        <div className={classes.content}>
          <h1>Choose a payment method</h1>
          <div className={classes.methodContainer}>
            <PayPalScriptProvider options={initialOptionsPaypal}>
              <PaypalButton createOrder={createOrderHandler} onApprove={onApproveHandler} />
            </PayPalScriptProvider>
            <div onClick={redirectToCheckout} className={classes.stripeBtn}>
              <StripeIcon className={classes.stripeIcon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
