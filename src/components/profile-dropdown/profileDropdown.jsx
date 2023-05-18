import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./profileDropdown.module.css";
import { ReactComponent as SessionIcon } from "../../assets/icon-session.svg";
import { ReactComponent as SignOutIcon } from "../../assets/icon-signout.svg";
import { ReactComponent as UpgradeIcon } from "../../assets/icon-upgrade2.svg";
import { logOut } from "../google-auth/googleAuth.script";
import { setUpgradePlan } from "../../gen-state/gen.actions";

const ProfileDropdown = ({ dropdown, setDropdown, userName }) => {
  const history = useHistory();
  const { dispatch, currentPlan } = useContext(GenContext);

  const handleUpgrade = () => {
    // if (currentPlan !== "free") {
    dispatch(setUpgradePlan(true));
    // }
    history.push("/create/session/pricing");
  };

  const handleLogOut = () => {
    setDropdown(false);
    logOut({ currentPlan, dispatch });
  };

  return (
    <div className={`${classes.container} ${dropdown && classes.active}`}>
      <div className={classes.wrapper}>
        <div className={classes.name}>{userName}</div>
        {currentPlan !== "agency" && (
          <div onClick={handleUpgrade} className={classes.option}>
            <UpgradeIcon className={classes.icon} />
            <div>Upgrade session</div>
          </div>
        )}
        <div onClick={() => history.push("/create/session")} className={classes.option}>
          <SessionIcon className={classes.icon} />
          <div>View all sessions</div>
        </div>
        <div onClick={handleLogOut} className={classes.option}>
          <SignOutIcon className={classes.icon} />
          <div>Sign out</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
