import React, { useState } from "react";
import { Link } from "react-router-dom";
import classes from "./sidebar.module.css";
import Logo from "../logo/logo";
// import mintIcon from '../../assets/gena-mint-icon.png';
// import createIcon from '../../assets/gena-create-icon.png';
// import searchIcon from '../../assets/gena-search-icon.png';

const Navbar = () => {
  const [activeNav, setActiveNav] = useState("");

  return (
    <div className={classes.container}>
      <div onClick={() => setActiveNav("")} className={classes.logoWrapper}>
        <Logo />
      </div>

      <div className={classes.navItems}>
        <Link to="/create">
          <div
            onClick={() => setActiveNav("create")}
            className={`${classes.navItem} ${activeNav === "create" && classes.active}`}
          >
            {/* <img src={createIcon} alt="icon" /> */}
            <p>create</p>
            <div className={classes.effect} />
          </div>
        </Link>

        <Link to="/mint">
          <div
            onClick={() => setActiveNav("mint")}
            className={`${classes.navItem} ${activeNav === "mint" && classes.active}`}
          >
            {/* <img src={mintIcon} alt="icon" /> */}
            <p>mint</p>
            <div className={classes.effect} />
          </div>
        </Link>

        <Link to="/explore">
          <div
            onClick={() => setActiveNav("explore")}
            className={`${classes.navItem} ${activeNav === "explore" && classes.active}`}
          >
            {/* <img src={searchIcon} alt="icon" /> */}
            <p>explore</p>
            <div className={classes.effect} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
