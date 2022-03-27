import classes from "./fallback.module.css";
import left from "../../assets/ion_arrow-back.png";
import notFound from "../../assets/404.svg";
import { useHistory } from "react-router-dom";
import home from "../../assets/home_small.png";

const Fallback = () => {
  const history = useHistory();
  return (
    <div className={classes.container}>
      <div className={classes["not-found"]}>
        <img src={notFound} alt="" />
        <h1>Oh No! Page Not Found.</h1>
        <div className={classes["text"]}>
          <span>
            The page you are looking for does not exist. Proceed with one of the
            actions below.
          </span>
        </div>
      </div>
      <div className={classes["button-container"]}>
        <button onClick={() => history.goBack()} className={classes["go-back"]}>
          Go Back
        </button>
        <button onClick={() => history.push("/")} className={classes["home"]}>
          Take me Home
        </button>
      </div>
    </div>
  );
};

export default Fallback;
