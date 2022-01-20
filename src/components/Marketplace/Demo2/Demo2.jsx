import classes from './styles.module.css';

const Demo2 = () => {
  return (
    <div className={classes.container}>
      <div className={classes.text}>
        <h3>
          Genadrop likes Generative Marketplace
        </h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porttitor dictum nulla hendrerit dignissim neque.
          Pellentesque massa feugiat nisi enim id morbi mi. Quam consequat, scelerisque eu enim aliquam.
          Commodo adipiscing iaculis in venenatis, elit nunc pulvinar eget.
        </p>
      </div>
      <div className={classes.video}>
        <img src="./assets/icon-play.png" alt="" />
      </div>
    </div>
  )
}

export default Demo2