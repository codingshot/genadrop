import { useState } from 'react';
import ConnectWallet from '../wallet/wallet';
import classes from './Navbar.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import logo from '../../assets/genadrop-logo-mobile.png';
import drop from '../../assets/drop.svg';
import closeIcon from '../../assets/icon-close.svg';
import hamburgerIcon from '../../assets/icon-hamburger.svg';

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
      <div className={classes.logoContainer}>
        <img className={classes.drop} src={drop} alt="" />
        <img onClick={() => { history.push('/') }} className={classes.logoDesktop} src={logo} alt="" />
        <img onClick={() => { history.push('/') }} className={classes.logoMobile} src={logo} alt="" />
      </div>
      <div className={`${classes.wrapper} ${dropdown ? classes.active : classes.inactive}`}>
        <br />
        <ul className={classes.navList}>
          <Link onClick={() => handleSetState({ dropdown: false })} to="/create">
            <li className={`${classes.navItem} ${pathname.includes('/create') && classes.active}`}>create</li>
          </Link>
          <Link onClick={() => handleSetState({ dropdown: false })} to="/mint">
            <li className={`${classes.navItem} ${pathname.includes('/mint') && classes.active}`}>mint</li>
          </Link>
          <Link onClick={() => handleSetState({ dropdown: false })} to="/marketplace">
            <li className={`${classes.navItem} ${pathname.includes('/marketplace') && classes.active}`}>explore</li>
          </Link>
        </ul>
        <div className={classes.wallet}>
          <ConnectWallet setToggleNav={state => handleSetState({ dropdown: state })} />
        </div>
      </div>
      {
        dropdown
          ? <img onClick={() => handleSetState({ dropdown: !dropdown })} className={classes.iconClose} src={closeIcon} alt="" />
          : <img onClick={() => handleSetState({ dropdown: !dropdown })} className={classes.iconOpen} src={hamburgerIcon} alt="" />
      }
    </div>
  )
}

export default Navbar