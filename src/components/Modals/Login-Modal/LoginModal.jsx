import { useContext } from "react";
import classes from "./LoginModal.module.css";
import { ReactComponent as GenadropLogo } from "../../../assets/logo-head.svg";
import { ReactComponent as GoogleIcon } from "../../../assets/icon-google.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { signInWithGoogle } from "../../google-auth/googleAuth.script";

const LoginModal = () => {
  const { isUser, dispatch } = useContext(GenContext);

  const handleSignIn = () => {
    signInWithGoogle({ dispatch });
  };

  return (
    <div className={`${classes.container} ${isUser === "false" && classes.active}`}>
      <div className={classes.card}>
        <div className={classes.heading}>
          Sign in/Sign up in to continue using <span>Genadrop</span>
        </div>
        <GenadropLogo className={classes.logoHead} />
        <div onClick={handleSignIn} className={classes.signinBtn}>
          <GoogleIcon />
          <div>sign in with google</div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
