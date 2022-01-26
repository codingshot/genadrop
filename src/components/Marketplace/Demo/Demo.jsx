import classes from './styles.module.css';

const Demo = () => {
  return (
    <div className={classes.container}>
      <h3 className={classes.heading}>Create and Sell Your NFTs</h3>
      <div className={classes.wrapper}>
        <div className={classes.video}>
          <img src="./assets/icon-play.png" alt="" />
        </div>
        <div className={classes.operations}>
          <div className={classes.card}>
            <div className={classes.operation}>
              <img src="./assets/icon-create.png" alt="" />
              <span>create your collection</span>
            </div>
            <div className={classes.description}>generate and design your collection</div>
          </div>
          <div className={classes.card}>
            <div className={classes.operation}>
              <img src="./assets/icon-create.png" alt="" />
              <span>create your collection</span>
            </div>
            <div className={classes.description}>generate and design your collection</div>
          </div>
          <div className={classes.card}>
            <div className={classes.operation}>
              <img src="./assets/icon-create.png" alt="" />
              <span>create your collection</span>
            </div>
            <div className={classes.description}>generate and design your collection</div>
          </div>
          <div className={classes.card}>
            <div className={classes.operation}>
              <img src="./assets/icon-create.png" alt="" />
              <span>create your collection</span>
            </div>
            <div className={classes.description}>generate and design your collection</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Demo