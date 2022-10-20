import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classes from "./Plans.module.css";
import { plans } from "../../../pages/Pricing/Pricing.script";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { ReactComponent as MarkIcon } from "../../../assets/icon-mark.svg";
import { ReactComponent as HoppyPlan } from "../../../assets/home-page/hoppy-plan.svg";
import { ReactComponent as AgencyPlan } from "../../../assets/home-page/agency-plan.svg";
import { ReactComponent as ProPlan } from "../../../assets/home-page/pro-plan.svg";

const Plans = () => {
  const [state, setState] = useState({
    activePlan: "pro",
    render: false,
  });

  const { activePlan, render } = state;

  const mapDescriptionToPlan = {
    hobby: {
      title: "Make sleek and sizeable collection with our Hobby plan",
      img: <HoppyPlan className={`${classes.planIcon} ${render ? classes.render : classes.re_render}`} />,
    },
    pro: {
      title: "Take advantage of our pro plan and do more",
      img: <ProPlan className={`${classes.planIcon} ${render ? classes.render : classes.re_render}`} />,
    },
    agency: {
      title: "Go big with our Agency plan",
      img: <AgencyPlan className={`${classes.planIcon} ${render ? classes.render : classes.re_render}`} />,
    },
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
          <span>Get more out of our</span> <span className={classes.accent}>Create app</span>
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
            <div className={classes.infoDescription}>{mapDescriptionToPlan[activePlan].title}</div>
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
          {mapDescriptionToPlan[activePlan].img}
          {/* <img src= alt="" /> */}
        </div>
      </div>
    </div>
  );
};

export default Plans;
