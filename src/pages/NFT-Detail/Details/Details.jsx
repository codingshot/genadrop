import classes from "./Details.module.css";

const Details = () => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>Details</div>
      <div className={classes.list}>
        <div>Mint address</div>
        <div>%</div>
      </div>
      <div className={classes.list}>
        <div>Minted</div>
        <div>%</div>
      </div>
      <div className={classes.list}>
        <div>Creator Royalty</div>
        <div>%</div>
      </div>
      <div className={classes.list}>
        <div>Genadrop Royalty</div>
        <div>%</div>
      </div>
      <div className={`${classes.list} ${classes.total}`}>
        <div>Total</div>
        <div>%</div>
      </div>
    </div>
  );
};

export default Details;
