import classes from "./Subscribe.module.css";
import { ReactComponent as NavigationIcon } from "../../../assets/icon-navigation.svg";

const Subscribe = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.title}>Never miss a Drop</div>
        <div className={classes.description}>Join our alpha mailing list </div>
        <div className={classes.inputContainer}>
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>

        <div className={classes.cruise}>
          <div className={classes.outerCircle}>
            <div className={classes.innerCircle}>
              <NavigationIcon alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
