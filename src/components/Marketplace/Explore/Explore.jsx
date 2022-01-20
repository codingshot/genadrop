import { useState } from 'react';
import classes from './styles.module.css';

const bgImage = {
  backgroundImage: 'url(./assets/explore-image-1.png)'
}

const Explore = () => {
  const [state, setState] = useState({
    viewAll: false,
    activeSearch: false,
    activeFilter: 'recentlySold'
  })

  const { viewAll, activeSearch, activeFilter } = state

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>Explore</h3>
        <div className={classes.control}>
          <div className={classes.inputContainer}>
            <input className={`${activeSearch && classes.active}`} type="text" />
          </div>
          <img onClick={() => handleSetState({ activeSearch: !activeSearch })} src="./assets/icon-search.png" alt="" />
          <div className={classes.select}>
            <p>Alphabetical</p>
            <img src="./assets/icon-dropdown.png" alt="" />
          </div>
          <button onClick={() => handleSetState({ viewAll: !viewAll })}>
            view all {
              viewAll
                ? <i class="fas fa-angle-up"></i>
                : <i class="fas fa-angle-down"></i>
            }
          </button>
        </div>
      </div>

      <div className={classes.filter}>
        <button
          onClick={() => handleSetState({ activeFilter: 'recentlySold' })}
          className={`${activeFilter === 'recentlySold' && classes.active}`}>
          Recently sold
        </button>
        <button
          onClick={() => handleSetState({ activeFilter: 'newMints' })}
          className={`${activeFilter === 'newMints' && classes.active}`}>
          New mints
        </button>
        <button
          onClick={() => handleSetState({ activeFilter: 'topGainers' })}
          className={`${activeFilter === 'topGainers' && classes.active}`}>
          Top Gainers
        </button>
      </div>

      <input type="text" />

      <div className={classes.wrapper}>
        {
          (Array(10).fill(null))
            .filter((_, idx) => viewAll ? true : 4 > idx)
            .map((d, idx) => (
              <div key={idx} className={classes.card}>
                <div style={bgImage} className={classes.imgContainer}></div>
                <div className={classes.cardBody}>
                  <p className={classes.title}>#name</p>
                  <div className={classes.info}>
                    <p className={classes.name}>name naememe</p>
                    <span className={classes.price}>5.98 Algo</span>
                  </div>
                  <div className={classes.tokenId}>
                    <img src="./assets/explore-thumbnail-1.png" alt="" />
                    <span>0x7c0c7c...DaD0</span>
                  </div>
                  <div className={classes.buttons}>
                    <button>make offer</button>
                    <button>buy now</button>
                  </div>
                </div>
              </div>
            ))
        }
      </div>

      <div>

      </div>
    </div>
  )
}

export default Explore