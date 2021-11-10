import React from 'react';
import classes from './home.module.css';

const Home = () => {
  return (
    <div className={classes.container}>
      <main className={classes.main}>
        <div className={classes.features}>
          <div className={classes.feature}>
            <h3 className={classes.header}>For Creators</h3>
            <img className={classes.icon} src="/assets/gena-icon-1.png" alt="icon" />
          </div>
          <div className={classes.functionalities}>
            <p className={classes.function}>create layer names</p>
            <p className={classes.function}>upload same size png asset</p>
            <p className={classes.function}>input rarity and mint amount</p>
            <p className={classes.function}>mint, autolist, revenue + royalties</p>
          </div>
        </div>

        <div className={classes.features}>
          <div className={classes.icons}>
            <img className={classes.icon} src="/assets/gena-icon-2.png" alt="icon" />
            <img className={classes.icon} src="/assets/gena-icon-3.png" alt="icon" />
            <img className={classes.icon} src="/assets/gena-icon-4.png" alt="icon" />
          </div>
          <div className={classes.functionalities}>
            <p className={classes.function}>browse generative drop</p>
            <p className={classes.function}>get new drop</p>
            <p className={classes.function}>resell on marketplace</p>
          </div>
        </div>
      </main>

    </div>
  )
}

export default Home;