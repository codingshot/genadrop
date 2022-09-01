import classes from "./PriceHistory.module.css";

const PriceHistory = () => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>PriceHistory</div>
      <div className={classes.history}></div>
    </div>
  );
};

export default PriceHistory;
