import React from "react";
import PropTypes from "prop-types";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const PaypalButton = ({ createOrder, createSubscription, onApprove }) => {
  const [{ options, isResolved }] = usePayPalScriptReducer();

  if (!isResolved) return <div>Loading paypal, please wait...</div>;

  const oderOptions = {
    createOrder: createOrder,
  };

  const subscriptionOptions = {
    createSubscription: createSubscription,
    style: {
      label: "subscribe",
    },
  };

  const buttonOptions = options.intent === "subscription" ? subscriptionOptions : oderOptions;

  return <PayPalButtons style={{ layout: "horizontal" }} {...buttonOptions} onApprove={onApprove} />;
};

PaypalButton.propTypes = {
  createOrder: PropTypes.func,
  createSubscription: PropTypes.func,
  onApprove: PropTypes.func.isRequired,
};

export default PaypalButton;
