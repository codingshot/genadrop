import React, { useState } from "react";
import { Link } from 'react-router-dom';
import classes from './sidebar.module.css';
import Logo from '../../components/logo/logo';

const Navbar = () => {
  const [activeNav, setActiveNav] = useState("");

  return (
    <div className={classes.container}>
      <div onClick={() => setActiveNav("")} className={classes.logoWrapper}>
        <Logo />
      </div>

      <div className={classes.navItems}>
        <Link to="/create">
          <div onClick={() => setActiveNav("create")} className={`${classes.navItem} ${activeNav === "create" && classes.active}`}>
            <img src="/assets/gena-create-icon.png" alt="icon" />
            <p>create</p>
            <div className={classes.effect}></div>
          </div>
        </Link>

        <Link to="/mint">
          <div onClick={() => setActiveNav("mint")} className={`${classes.navItem} ${activeNav === "mint" && classes.active}`}>
            <img src="/assets/gena-mint-icon.png" alt="icon" />
            <p>mint</p>
            <div className={classes.effect}></div>
          </div>
        </Link>

        <Link to="/explore">
          <div onClick={() => setActiveNav("explore")} className={`${classes.navItem} ${activeNav === "explore" && classes.active}`}>
            <img src="/assets/gena-search-icon.png" alt="icon" />
            <p>explore</p>
            <div className={classes.effect}></div>
          </div>
        </Link>

      </div>
    </div>
  )
}

export default Navbar