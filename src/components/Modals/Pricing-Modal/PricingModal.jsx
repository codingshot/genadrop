import classes from "./PricingModal.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalButton from "./PaypalButton";

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_LIVE_PUBLIC_KEY);
  }
  return stripePromise;
};

const PricingModal = ({ modal, price, closeModal }) => {
  const history = useHistory();

  const [stripeError, setStripeError] = useState(null);

  const initialOptionsPaypal = {
    "client-id": process.env.REACT_APP_PAYPAL_LIVE_CLIENT_ID,
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
    return actions.order
      .capture()
      .then(function (details) {
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
    lineItems: [item[0]],
    mode: "payment",
    successUrl: `${window.location.origin}/create/session/create`,
    cancelUrl: `${window.location.origin}/create/session/pricing/failed`,
  };

  const redirectToCheckout = async () => {
    console.log("redirectToCheckout");

    const stripe = await getStripe();
    console.log("Got stripe");
    const res = await stripe.redirectToCheckout(checkoutOptions);
    console.log("Stripe checkout error", res);

    if (res.error) setStripeError(res.error.message);
    // else handleClick();
  };

  if (stripeError) alert(stripeError);

  const handleClick = () => {
    history.push("/create/session/create");
    handleClose();
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
            <div onClick={redirectToCheckout} className={classes.paymentMethod}>
              <div>Stripe</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
