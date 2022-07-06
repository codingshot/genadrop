import classes from "./Nav.module.css";
import arrowBack from "../../../assets/icon-arrow-left.svg";
import { useHistory } from "react-router-dom";

const Nav = () => {
  const history = useHistory();

  return (
    <div className={classes.container}>
      <div onClick={() => history.goBack()} className={classes.backBtnContainer}>
        <img src={arrowBack} alt="" />
        <span>Back</span>
      </div>
      <div className={classes.detailsContainer}>
        <div className={classes.gifContainer}>
          <div className={classes.gif}>Gif</div>
          <div className={classes.gifCount}>0</div>
        </div>
        <div className={classes.artStatusContainer}>
          <div className={classes.status}>No. of Generated Arts</div>
          <div className={classes.artCount}>100</div>
        </div>
        <div className={classes.artStatusContainer}>
          <div className={classes.status}>No. of Generated Arts</div>
          <div className={classes.artCount}>100</div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
