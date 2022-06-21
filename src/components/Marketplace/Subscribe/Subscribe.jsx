import classes from "./Subscribe.module.css";
import navigationIcon from "../../../assets/icon-navigation.svg";

const Subscribe = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.title}>Never miss a Drop</div>
        <div className={classes.description}>Join our alpha mailing list </div>
        <div className={classes.inputContainer}>
          <input type="email" placeholder="enter your Email" />
          <button>Subscribe</button>
        </div>

        <div className={classes.cruise}>
          <div className={classes.outerCircle}>
            {/* <div className={classes.circle}> */}
            <div className={classes.innerCircle}>
              <img src={navigationIcon} alt="" />
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
