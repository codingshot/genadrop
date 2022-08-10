import classes from "./profileDropdown.module.css";
import { ReactComponent as SessionIcon } from "../../assets/icon-session.svg";
import { ReactComponent as SignOutIcon } from "../../assets/icon-signout.svg";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import { GenContext } from "../../gen-state/gen.context";
import { logOut } from "../google-auth/googleAuth.script";

const ProfileDropdown = ({ dropdown, setDropdown, userName }) => {
  const history = useHistory();
  const { dispatch } = useContext(GenContext);

  const handleLogOut = () => {
    setDropdown(false);
    logOut({ history, dispatch });
  };

  return (
    <div className={`${classes.container} ${dropdown && classes.active}`}>
      <div className={classes.wrapper}>
        <div className={classes.name}>{userName}</div>
        <div onClick={() => history.push("/create/session")} className={classes.option}>
          <SessionIcon />
          <div>session</div>
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
