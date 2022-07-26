import { useContext } from "react";
import { signInWithGoogle } from "../google-auth/googleAuth.script";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./LoginModal.module.css";

const LoginModal = () => {
  const { isUser, dispatch } = useContext(GenContext);

  const handleSignIn = () => {
    signInWithGoogle({ dispatch });
  };

  return (
    <div className={`${classes.container} ${isUser === "false" && classes.active}`}>
      <div onClick={handleSignIn} className={classes.wrapper}>
        sign in with google
      </div>
    </div>
  );
};

export default LoginModal;
