import classes from './Orgs.module.css';

const Orgs = () => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>Backed by the Web3's <span>Best Orgs</span></div>
      <div className={classes.description}>
        From the leading blockchains, creative groups, and DAOs, GenaDrop is supported by the industry’s best.
      </div>
      <div className={classes.orgs}>
        <img src="./assets/org4.svg" alt="" />
        <img src="./assets/org3.svg" alt="" />
        <img src="./assets/org2.svg" alt="" />
        <img src="./assets/org1.svg" alt="" />
      </div>
      <div className={classes.bgIcons}>
        <img src="./assets/box.svg" alt="" />
        <img src="./assets/ball.svg" alt="" />
      </div>
    </div>
  )
}

export default Orgs;