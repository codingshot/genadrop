/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./Pricing.module.css";
import { plans } from "./Pricing.script";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { ReactComponent as MarkIcon } from "../../assets/icon-mark.svg";
import PricingModal from "../../components/Modals/Pricing-Modal/PricingModal";
import { GenContext } from "../../gen-state/gen.context";
import { setProposedPlan } from "../../gen-state/gen.actions";
import { handleResetCreate } from "../../utils";

const Pricing = () => {
  const history = useHistory();
  const [plan, setPlan] = useState("");
  const [price, setPrice] = useState(0);

  const { dispatch, currentPlan, upgradePlan, collectionName } = useContext(GenContext);
  const handlePlan = (plan, price) => {
    if (price) {
      dispatch(setProposedPlan(plan));
      if (upgradePlan) {
        if (currentPlan === "hobby" && plan === "pro") {
          setPlan("hobbyToPro");
        } else if (currentPlan === "hobby" && plan === "agency") {
          setPlan("hobbyToAgency");
        } else if (currentPlan === "pro" && plan === "agency") {
          setPlan("proToAgency");
        } else {
          setPlan(plan);
        }
        setPrice(price - Number(plans[currentPlan].price));
      } else {
        setPrice(price);
        setPlan(plan);
      }
    } else {
      handleResetCreate({ dispatch });
      // dispatch(setCurrentPlan(plan));
      history.push("/create/collection");
    }
  };

  const mapCurrentPlanToLevel = (plan, level) => {
    const levels = {
      free: 0,
      hobby: 1,
      pro: 2,
      agency: 3,
    };

    const currentLevel = levels[plan];
    if (currentLevel >= levels[level]) return true;
    return false;
  };

  const closeModal = () => {
    setPlan("");
  };

  useEffect(() => {
    if (!collectionName) {
      return history.push("/create/collection");
    }
    document.documentElement.scrollTop = 200;
  }, []);

  return (
    <div className={classes.container}>
      {price !== 0 ? <PricingModal plan={plan} price={price} closeModal={closeModal} /> : ""}
      <div className={classes.heading}>
        <h1>Pricing $ plans</h1>
        <p>Simple pricing.. No hidden fees. Advanced features for your NFT collections</p>
      </div>

      <div className={classes.cardMenu}>
        {Object.values(plans).map((plan, idx) => (
          <div key={idx} className={`${classes.wrapper} ${plan.mostPopular ? classes.active : ""}`}>
            {plan.mostPopular && <div className={classes.mark}>Most Popular</div>}
            <div className={classes.card}>
              <div className={classes.type}>{plan.type}</div>
              <div className={classes.description}>{plan.description}</div>
              <div className={classes.coveredCost}>{plan.coveredCost}</div>
              <div className={classes.price}>${plan.price}</div>
              <div className={classes.services}>
                {plan.services.map(({ name, available }, idx) => (
                  <div key={idx} className={classes.service}>
                    {available ? (
                      <MarkIcon className={classes.markIcon} />
                    ) : (
                      <CloseIcon className={classes.closeIcon} />
                    )}
                    <div className={classes.serviceName}>{name}</div>
                  </div>
                ))}
              </div>
              {upgradePlan && currentPlan === plan.type ? (
                <div
                  onClick={() => history.push("/create/collection")}
                  className={`${classes.subscribeBtn} ${classes.disabled}`}
                >
                  Current Plan
                </div>
              ) : upgradePlan && mapCurrentPlanToLevel(currentPlan, plan.type) ? (
                <div className={`${classes.subscribeBtn} ${classes.disabled}`}>disabled</div>
              ) : (
                <div
                  onClick={() => handlePlan(plan.type, Number(plan.price))}
                  className={`${classes.subscribeBtn} ${plan.mostPopular && classes.active}`}
                >
                  {plan.subscription}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
