import classes from "./Pricing.module.css";
import { plans } from "./Pricing.script";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { ReactComponent as MarkIcon } from "../../assets/icon-mark.svg";
import { useEffect, useState } from "react";
import PricingModal from "./Pricing-Modal/PricingModal";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import { GenContext } from "../../gen-state/gen.context";
import { setCollectionName, setCurrentPlan, setCurrentSession } from "../../gen-state/gen.actions";
import { handleResetCreate } from "../../utils";

const Pricing = () => {
  const history = useHistory();
  const [plan, setPlan] = useState(0);
  const [price, setPrice] = useState(1000);
  const { dispatch, currentPlan, upgradePlan } = useContext(GenContext);

  const handlePlan = (plan, price) => {
    dispatch(setCurrentPlan(plan));
    if (price) {
      setPlan(plan);
      setPrice(price);
    } else {
      handleResetCreate({ dispatch });
      dispatch(setCollectionName(""));
      dispatch(setCurrentSession(null));
      history.push("/create");
    }
  };

  const mapCurrentPlanToLevel = (currentPlan, level) => {
    let levels = {
      free: 0,
      noobs: 1,
      geeks: 2,
      ogs: 3,
    };

    let currentLevel = levels[currentPlan];
    if (currentLevel > levels[level]) return true;
    return false;
  };

  const closeModal = () => {
    setPlan(0);
  };

  useEffect(() => {
    document.documentElement.scrollTop = 200;
  }, []);

  return (
    <div className={classes.container}>
      {plan != 0 ? <PricingModal modal={plan} price={price} closeModal={closeModal} /> : ""}
      <div className={classes.heading}>
        <h1>Pricing $ plans</h1>
        <p>Simple pricing.. No hidden fees. Advanced features for your NFT collections</p>
      </div>

      <div className={classes.cardMenu}>
        {plans.map((plan, idx) => (
          <div key={idx} className={classes.wrapper}>
            {plan.mostPopular && <div className={classes.mark}>Most Popular</div>}
            <div className={classes.card}>
              <div className={classes.type}>{plan.type}</div>
              <div className={classes.description}>{plan.description}</div>
              <div className={classes.coveredCost}>{plan.coveredCost}</div>
              <div className={classes.price}>
                ${plan.price.split(".")[0]}
                <span>.{plan.price.split(".")[1]}</span>
              </div>
              <div className={classes.services}>
                {plan.services.map(({ name, availble }, idx) => (
                  <div key={idx} className={classes.service}>
                    {availble ? <MarkIcon className={classes.markIcon} /> : <CloseIcon className={classes.closeIcon} />}
                    <div className={classes.serviceName}>{name}</div>
                  </div>
                ))}
              </div>
              {upgradePlan && currentPlan === plan.type ? (
                <div onClick={() => history.push("/create")} className={`${classes.subscribeBtn} ${classes.disabled}`}>
                  Current Plan
                </div>
              ) : upgradePlan && currentPlan !== "free" && mapCurrentPlanToLevel(currentPlan, plan.type) ? (
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
