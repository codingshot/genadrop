import { useState } from "react";
import { useContext, useEffect } from "react";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./googleAuth.module.css";
import { getCurrentUser, signInWithGoogle } from "./googleAuth.script";
import ProfileDropdown from "./profile-dropdown/profileDropdown";

const GoogleAuth = () => {
  const { dispatch, currentUser } = useContext(GenContext);
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);

  const handleSignIn = () => {
    signInWithGoogle({ dispatch });
  };

  const getInitial = (name) => {
    name = name.split(" ");
    return `${name[0][0]} ${name[1][0]}`;
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
        <div
          onMouseOver={() => setDropdown(true)}
          onMouseOut={() => setDropdown(false)}
          className={classes.profileContainer}
        >
          <div className={classes.profileIcon}>{getInitial(user.displayName)}</div>
          <ProfileDropdown dropdown={dropdown} setDropdown={setDropdown} userName={user.displayName} />
        </div>
      ) : (
        <div className={classes.signIn} onClick={handleSignIn}>
          sign in / sign up
        </div>
      )}
    </div>
  );
};

export default GoogleAuth;
