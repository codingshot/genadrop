import { useState } from 'react';
import classes from './styles.module.css';

const bgImage = {
  backgroundImage: 'url(./assets/collections-image-1.png)'
}

const Collections = () => {
  const [state, setState] = useState({
    viewAll: false
  })

  const { viewAll } = state

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>Top Collections</h3>
        <button onClick={() => handleSetState({ viewAll: !viewAll })}>
          view all {
            viewAll
              ? <i class="fas fa-angle-up"></i>
              : <i class="fas fa-angle-down"></i>
          }
        </button>
      </div>

      <div className={classes.wrapper}>
        {
          (Array(7).fill(null))
            .filter((_, idx) => viewAll ? true : 3 > idx)
            .map((d, idx) => (
              <div key={idx} className={classes.card}>
                <div style={bgImage} className={classes.imgContainer}></div>
                <div className={classes.cardBody}>
                  <img className={classes.thumbnail} src="./assets/collections-thumbnail-1.png" alt="" />
                  <h3>Defi summer</h3>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, doloribus architecto? Dolor ea vitae accusamus cum, vel veritatis fuga, magnam quaerat officia inventore voluptatibus animi blanditiis ab minus! Nihil, consequatur?</p>
                  <div className={classes.info}>
                    <div className={classes.nfts}>
                      <span className={classes.dot}></span>
                      <span>10,000 NFTs</span>
                    </div>
                    <div className={classes.price}>
                      Floor: 3.5 ALGO
                    </div>
                  </div>
                </div>
              </div>
            ))
        }
      </div>

    </div>
  )
}

export default Collections