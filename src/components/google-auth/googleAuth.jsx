import { useState } from "react";
import { useContext, useEffect } from "react";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./googleAuth.module.css";
import { getCurrentUser, signInWithGoogle } from "./googleAuth.script";

const GoogleAuth = () => {
  const { dispatch, user } = useContext(GenContext);
  const [currentUser, setUser] = useState(null);

  const handleSignIn = () => {
    signInWithGoogle({ dispatch });
  };

  const getInitial = (name) => {
    name = name.split(" ");
    return `${name[0][0]} ${name[1][0]}`;
  };

  useEffect(() => {
    setUser(user);
  }, [user]);

  useEffect(() => {
    getCurrentUser({ dispatch });
  }, []);

  return (
    <div className={classes.container}>
      {currentUser ? (
        <div className={classes.name}>{getInitial(user.displayName)}</div>
      ) : (
        <div className={classes.signIn} onClick={handleSignIn}>
          sign in
        </div>
      )}
    </div>
  );
};

export default GoogleAuth;
