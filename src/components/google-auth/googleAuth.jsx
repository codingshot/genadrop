/* eslint-disable no-param-reassign */
import React, { useState, useContext, useEffect } from "react";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./googleAuth.module.css";
import { getCurrentUser, signInWithGoogle } from "./googleAuth.script";

const GoogleAuth = () => {
  const { dispatch, currentUser } = useContext(GenContext);
  const [user, setUser] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleSignIn = () => {
    signInWithGoogle({ dispatch });
  };

  const getInitial = (name) => {
    if (!name) return "";
    name = name.split(" ");
    if (name.length >= 2) {
      return `${name[0][0]} ${name[1][0]}`;
    }
    return `${name[0][0]}`;
  };

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    getCurrentUser({ dispatch });
  }, []);

  return (
    <div className={classes.container}>
      {user ? (
        <div className={classes.profileContainer}>
          <img
            style={{ display: `${imageLoaded ? "block" : "none"}` }}
            onLoad={() => setImageLoaded(true)}
            src={user.photoURL}
            alt=""
            className={classes.profileIcon}
          />
          {!imageLoaded && <div className={classes.profileIcon}>{getInitial(user.displayName)}</div>}
        </div>
      ) : (
        <div className={classes.signIn} onClick={handleSignIn}>
          sign in
        </div>
      )}
    </div>
  );
};

export default GoogleAuth;
