import classes from "./Description.module.css";

const Description = ({ nftDetails }) => {
  const { description } = nftDetails;

  return (
    <div className={classes.container}>
      <div className={classes.heading}>Description</div>
      <div className={classes.content}>
        <div>{description}</div> <div>Show more</div>
      </div>
    </div>
  );
};

export default Description;
