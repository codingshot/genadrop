import classes from "./Creators.module.css";

const Creators = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.heading}>
          <h3>Popular Creators</h3>
          <button>See all</button>
        </div>
        <div className={classes.innerWrapper}>
          {[...new Array(4)].map((_, idx) => (
            <div key={idx} className={classes.cardContainer}>
              <div className={classes.profile}>
                <div className={classes.image}></div>
                <div className={classes.name}>Sahne shift Sahne</div>
                <div className={classes.text}>Everyday NFT everyday drops</div>
              </div>
              <div className={classes.drops}>
                <div className={classes.count}>647</div>
                <div className={classes.text}>
                  NFT <br /> drops
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Creators;
