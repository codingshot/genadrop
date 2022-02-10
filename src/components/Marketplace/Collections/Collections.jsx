import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { GenContext } from '../../../gen-state/gen.context';
import classes from './styles.module.css';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { getNftCollections } from '../../../utils';

const Collections = () => {

  const [state, setState] = useState({
    viewAll: false,
    allCollections: null
  })
  const { collections } = useContext(GenContext)
  const { viewAll, allCollections } = state
  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }
  const history = useHistory();
  const match = useRouteMatch();
  useEffect(() => {
    if (Object.keys(collections).length) {
      (async function getResult() {
        let result = await getNftCollections(collections.allCollections)
        handleSetState({
          allCollections: result
        })
      }())
    }
  }, [collections])


  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>Top Collections</h3>
        <button onClick={() => handleSetState({ viewAll: !viewAll })}>
          view all {
            viewAll
              ? <img src="/assets/icon-chevron-up.svg" alt="" />
              : <img src="/assets/icon-chevron-down.svg" alt="" />
          }
        </button>
      </div>

      <div className={classes.wrapper}>
        {
          allCollections ? allCollections
            .filter((_, idx) => viewAll ? true : 10 > idx)
            .map(({ name, price, description, owner, number_of_nfts, image_url }, idx) => (

              <div key={idx} onClick={() => history.push(`${match.url}/${name}`)} className={classes.card}>
                <div style={{ backgroundImage: `url(${image_url})` }} className={classes.imgContainer}></div>
                <div className={classes.cardBody}>

                  <img className={classes.thumbnail} src={image_url} alt="" />
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <div className={classes.info}>
                    <div className={classes.nfts}>
                      <span className={classes.dot}></span>
                      <span>{number_of_nfts} NFTs</span>
                    </div>
                    <div className={classes.price}>
                      Floor: {price} ALGO
                    </div>
                  </div>
                </div>
              </div>
            ))
            :
            (Array(6).fill(null)).map((_, idx) => (
              <div key={idx}>
                <Skeleton count={1} height={200} />
                <Skeleton count={3} height={40} />
              </div>
            ))
        }
      </div>

    </div>
  )
}

export default Collections