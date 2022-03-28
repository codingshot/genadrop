import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { GenContext } from '../../../gen-state/gen.context';
import classes from './collections.module.css';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { getNftCollections } from '../../../utils';
import CollectionsCard from '../collectionsCard/collectionsCard';

const Collections = () => {

  const [state, setState] = useState({
    allCollections: null
  })
  const { collections, mainnet } = useContext(GenContext)
  const { allCollections } = state
  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }
  const history = useHistory();
  const { url } = useRouteMatch();

  useEffect(() => {
    console.log('nipghkeys', Object.keys(collections).length)
    if (Object.keys(collections).length) {
      (async function getResult() {
        let result = await getNftCollections(collections, mainnet);
        console.log(result)
        handleSetState({
          allCollections: result
        })
      }());
    } else {
      handleSetState({
        allCollections: []
      })
    }
  }, [collections]);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>Top Collections</h3>
        <button onClick={() => history.push(`${url}/collections`)}>view all</button>
      </div>

      {
        allCollections ?
          <div className={classes.wrapper}>
            {
              allCollections
                .filter((_, idx) => 10 > idx)
                .map((collection, idx) => (
                  <CollectionsCard key={idx} collection={collection} />
                ))
            }
          </div>
          :
          <div className={classes.skeleton}>
            {
              (Array(4).fill(null)).map((_, idx) => (
                <div key={idx}>
                  <Skeleton count={1} height={250} />
                  <br />
                  <Skeleton count={1} height={30} />
                  <br />
                  <Skeleton count={1} height={30} />
                </div>
              ))
            }
          </div>
      }
    </div>
  )
}

export default Collections