import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import classes from './sidebar.module.css';
import Logo from '../../components/logo/logo';
import { GenContext } from "../../gen-state/gen.context";

const Navbar = () => {
  const { isLoading } = useContext(GenContext);

  return (
    <div className={classes.container}>
      <div className={`${classes.overlay} ${isLoading && classes.isLoading}`}></div>
      <div className={classes.logoWrapper}>
        <Logo/>
      </div>
      
      <div className={classes.navItems}>
        <Link to="/create">
          <div className={classes.navItem}>
            <img src="/assets/gena-create-icon.png" alt="icon" />
            <p>create</p>
          </div>
        </Link>

        <Link to="/mint">
          <div className={classes.navItem}>
            <img src="/assets/gena-mint-icon.png" alt="icon" />
            <p>mint</p>
          </div>
        </Link>

        <Link to="/explore">
          <div className={classes.navItem}>
            <img src="/assets/gena-search-icon.png" alt="icon" />
            <p>explore</p>
          </div>
        </Link>

      </div>
    </div>
  )
}

export default Navbar