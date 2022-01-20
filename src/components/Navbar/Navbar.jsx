import { useState } from 'react';
import ConnectWallet from '../wallet/wallet';
import classes from './styles.module.css';

const Navbar = () => {
  const [state, setState] = useState({
    dropdown: false
  })
  const { dropdown } = state
  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  return (
    <div className={classes.container}>
      <img src="./assets/genadrop-logo.png" alt="" />
      <img src="./assets/genadrop-logo-mobile.png" alt="" />
      <div className={`${classes.wrapper} ${dropdown ? classes.active : classes.inactive}`}>
        <input type="text" />
        <ul className={classes.navList}>
          <li className={classes.navItem}>create</li>
          <li className={classes.navItem}>mint</li>
          <li className={classes.navItem}>explore</li>
        </ul>
        <div className={classes.wallet}>
          <ConnectWallet>connect</ConnectWallet>
        </div>
      </div>
      {
        dropdown
          ? <img onClick={() => handleSetState({ dropdown: !dropdown })} className={classes.iconClose} src="./assets/icon-close.svg" alt="" />
          : <img onClick={() => handleSetState({ dropdown: !dropdown })} className={classes.iconOpen} src="./assets/icon-hamburger.svg" alt="" />
      }
    </div>
  )
}

export default Navbar