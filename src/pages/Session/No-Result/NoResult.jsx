import classes from "./NoResult.module.css";
import { ReactComponent as CartIcon } from "../../../assets/icon-cart.svg";

const NotFound = () => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1>Session</h1>
        <div className={classes.wrapper}>
          <CartIcon className={classes.cartIcon} />
          <div className={classes.description}>
            <div>You have no saved session</div>
            <div>Upgrade to any of our paid plans to save your session progress</div>
          </div>
          <button className={classes.upgradeBtn}>Upgrade</button>
          <button className={classes.createBtn}>Create new session</button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
