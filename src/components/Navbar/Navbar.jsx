import { useState } from 'react';
import ConnectWallet from '../wallet/wallet';
import classes from './styles.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const Navbar = () => {
  const [state, setState] = useState({
    dropdown: false
  })
  const { dropdown } = state
  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const { pathname } = useLocation();
  const history = useHistory();

  return (
    <div className={classes.container}>
      <img onClick={()=> {history.push('/')}} className={classes.logoDesktop} src="/assets/genadrop-logo.png" alt="" />
      <img onClick={()=> {history.push('/')}} className={classes.logoMobile} src="/assets/genadrop-logo-mobile.png" alt="" />
      <div className={`${classes.wrapper} ${dropdown ? classes.active : classes.inactive}`}>
        {/* <input type="text" /> */}
        <br />
        <ul className={classes.navList}>
          <Link to="/create">
            <li className={`${classes.navItem} ${pathname === '/create' && classes.active}`}>create</li>
          </Link>
          <Link to="/mint/single-nft">
            <li className={`${classes.navItem} ${pathname.includes('/mint') && classes.active}`}>mint</li>
          </Link>
          <Link to="/marketplace">
            <li className={`${classes.navItem} ${pathname === '/marketplace' && classes.active}`}>explore</li>
          </Link>
        </ul>
        <div className={classes.wallet}>
          <ConnectWallet>connect</ConnectWallet>
        </div>
      </div>
      {
        dropdown
          ? <img onClick={() => handleSetState({ dropdown: !dropdown })} className={classes.iconClose} src="/assets/icon-close.svg" alt="" />
          : <img onClick={() => handleSetState({ dropdown: !dropdown })} className={classes.iconOpen} src="/assets/icon-hamburger.svg" alt="" />
      }
    </div>
  )
}

export default Navbar