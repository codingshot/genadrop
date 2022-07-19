import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import ConnectWallet from "../wallet/wallet";
import classes from "./Navbar.module.css";
import { ReactComponent as Logo } from "../../assets/genadrop-logo.svg";
import { ReactComponent as Drop } from "../../assets/drop.svg";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { ReactComponent as HamburgerIcon } from "../../assets/icon-hamburger.svg";

const Navbar = () => {
  const [state, setState] = useState({
    dropdown: false,
    value: "",
  });
  const { dropdown, value } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const { pathname } = useLocation();
  const history = useHistory();

  const handleSubmit = (e, value) => {
    e.preventDefault();
    if (!value) return;
    handleSetState({ value: "" });
    history.push(`/marketplace/collections/${`?search=${value}`}`);
  };

  const handleChange = (e) => {
    handleSetState({ value: e.target.value });
  };

  useEffect(() => {
    window.sessionStorage.showWelcomeScreen = true;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.logoContainer}>
        <Drop className={classes.drop} alt="" />
        <Logo onClick={() => history.push("/")} className={classes.logoDesktop} alt="" />
        <Logo onClick={() => history.push("/")} className={classes.logoMobile} alt="" />
      </div>
      <div className={classes.searchAndNavWrapper}>
        <form onSubmit={(e) => handleSubmit(e, value)} className={classes.searchContainer}>
          <input onChange={handleChange} value={value} type="text" placeholder="Search collections, and 1 of 1s" />
        </form>
        <nav className={`${classes.navContainer} ${dropdown ? classes.active : classes.inactive}`}>
          <br />
          <ul className={classes.navList}>
            <Link onClick={() => handleSetState({ dropdown: false })} to="/create">
              <div className={`${classes.navItem} ${pathname.includes("/create") && classes.active}`}>
                <li>create</li>
                <div className={classes.line} />
              </div>
            </Link>
            <Link onClick={() => handleSetState({ dropdown: false })} to="/mint">
              <div className={`${classes.navItem} ${pathname.includes("/mint") && classes.active}`}>
                <li>mint</li>
                <div className={classes.line} />
              </div>
            </Link>
            <Link onClick={() => handleSetState({ dropdown: false })} to="/marketplace">
              <div className={`${classes.navItem} ${pathname.includes("/marketplace") && classes.active}`}>
                <li>explore</li>
                <div className={classes.line} />
              </div>
            </Link>
          </ul>
          <div className={classes.wallet}>
            <ConnectWallet setToggleNav={(states) => handleSetState({ dropdown: states })} />
          </div>
        </nav>
        {dropdown ? (
          <CloseIcon onClick={() => handleSetState({ dropdown: !dropdown })} className={classes.closeIcon} />
        ) : (
          <HamburgerIcon
            onClick={() => handleSetState({ dropdown: !dropdown })}
            className={classes.iconOpen}
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
