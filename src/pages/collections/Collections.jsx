import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import classes from './collections.module.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { getNftCollections } from '../../utils';
import { GenContext } from '../../gen-state/gen.context';
import CollectionsCard from '../../components/Marketplace/collectionsCard/collectionsCard';

const Collections = () => {

  const [state, setState] = useState({
    allCollections: null
  })
  const { collections } = useContext(GenContext)
  const { allCollections } = state
  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

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
      <div className={classes.header}>
        <h1 >Collections</h1>
        <div className={classes.filter}>
          <input className={classes.search} type="text" />
          <div className={classes.sort}>sort by</div>
        </div>
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
              (Array(6).fill(null)).map((_, idx) => (
                <div key={idx}>
                  <Skeleton count={1} height={400} />
                </div>
              ))
            }
          </div>
      }
    </div>
  )
}

export default Collections