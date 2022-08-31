import classes from "./Plans.module.css";
import planIcon from "../../../assets/icon-plan.png";
import { useState } from "react";
import { plans } from "../../../pages/Pricing/Pricing.script";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { ReactComponent as MarkIcon } from "../../../assets/icon-mark.svg";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Plans = () => {
  const [state, setState] = useState({
    activePlan: "pro",
    render: false,
  });

  const { activePlan, render } = state;

  const mapDescriptionToPlan = {
    pro: "Take advantage of our pro plan and do more",
    agency: "Go big with our Agency plan",
    hobby: "Try out our Hobby plan",
  };

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  useEffect(() => {
    handleSetState({ render: !render });
  }, [activePlan]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.heading}>
          Get more out of our <span>Create app</span>
        </div>
        <div className={classes.description}>Choose a plan that’s best for your project</div>
        <div className={classes.plans}>
          <div
            onClick={() => handleSetState({ activePlan: "pro" })}
            className={`${classes.planName} ${activePlan === "pro" && classes.active}`}
          >
            Professional
            <div className={classes.line} />
          </div>
          <div
            onClick={() => handleSetState({ activePlan: "agency" })}
            className={`${classes.planName} ${activePlan === "agency" && classes.active}`}
          >
            Agency
            <div className={classes.line} />
          </div>
          <div
            onClick={() => handleSetState({ activePlan: "hobby" })}
            className={`${classes.planName} ${activePlan === "hobby" && classes.active}`}
          >
            Hobby
            <div className={classes.line} />
          </div>
        </div>

        <div className={classes.preview}>
          <div className={classes.planInfo}>
            <div className={classes.infoHeading}>plans that works for your NFT collection and Budget </div>
            <div className={classes.infoDescription}>{mapDescriptionToPlan[activePlan]}</div>
            <div className={classes.supportedFeatures}>
              {plans[activePlan].services.map(({ name, available }, idx) => (
                <div key={idx} className={`${classes.plan} ${render ? classes.render : classes.re_render}`}>
                  <div className={classes.available}>
                    {available ? (
                      <MarkIcon className={classes.markIcon} />
                    ) : (
                      <CloseIcon className={classes.closeIcon} />
                    )}
                  </div>
                  <div className={classes.name}>{name}</div>
                </div>
              ))}
            </div>
            <Link to="/create/session/pricing">
              <div className={classes.btn}>View Pricing</div>
            </Link>
          </div>
          <img src={planIcon} alt="" className={`${classes.planIcon} ${render ? classes.render : classes.re_render}`} />
        </div>
      </div>
    </div>
  );
};

export default Plans;
