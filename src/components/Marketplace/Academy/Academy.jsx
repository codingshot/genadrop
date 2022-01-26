import { useState } from 'react';
import classes from './styles.module.css';

const bgImage = {
  backgroundImage: 'url(./assets/academy-image-1.png)'
}

const Academy = () => {
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
        <h3>GenaDrop Academy</h3>
        <button onClick={() => handleSetState({ viewAll: !viewAll })}>
          view all {
            viewAll
              ? <i className="fas fa-angle-up"></i>
              : <i className="fas fa-angle-down"></i>
          }
        </button>      </div>
      <div className={classes.wrapper}>
        {
          (Array(7).fill(null))
          .filter((_, idx) => viewAll ? true : 4 > idx)
          .map((id, idx) => (
            <div key={idx} className={classes.card}>
              <div style={bgImage} className={classes.imgContainer}></div>
              <div className={classes.cardBody}>
                <div className={classes.text}>
                  Top 10 tips on getting better on NFT minting
                </div>
                <button>Read more</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Academy