import classes from "./profileDropdown.module.css";
import { ReactComponent as SessionIcon } from "../../../assets/icon-session.svg";
import { ReactComponent as SubscriptionIcon } from "../../../assets/icon-subscription.svg";
import { ReactComponent as SignOutIcon } from "../../../assets/icon-signout.svg";
import { logOut } from "../googleAuth.script";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import { setToggleSessionModal } from "../../../gen-state/gen.actions";

const ProfileDropdown = ({ dropdown, setDropdown, userName }) => {
  const history = useHistory();
  const { dispatch } = useContext(GenContext);

  const handleLogOut = () => {
    setDropdown(false);
    logOut({ history, dispatch });
  };

  const handleToggleModal = () => {
    dispatch(setToggleSessionModal(true));
  };

  return (
    <div className={`${classes.container} ${dropdown && classes.active}`}>
      <div className={classes.wrapper}>
        <div className={classes.name}>{userName}</div>
        <div onClick={handleToggleModal} className={classes.option}>
          <SessionIcon />
          <div>session</div>
        </div>
        <div onClick={() => history.push("/create/pricing")} className={classes.option}>
          <SubscriptionIcon />
          <div>subscription</div>
        </div>
        <div onClick={handleLogOut} className={classes.option}>
          <SignOutIcon />
          <div>Sign out</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
