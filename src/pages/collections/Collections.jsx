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

  const { collections } = useContext(GenContext);

  const [state, setState] = useState({
    allCollections: null,
    togglePriceFilter: false,
    filteredCollection: null,
    filter: {
      searchValue: '',
      price: 'high',
    }
  });

  const { allCollections, filter, togglePriceFilter, filteredCollection } = state;

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  useEffect(() => {
    if (Object.keys(collections).length) {
      (async function getResult() {
        let result = await getNftCollections(collections)
        handleSetState({
          allCollections: result,
          filteredCollection: result
        })
      }())
    }
  }, [collections]);

  useEffect(() => {
    if (!allCollections) return;

    let filtered = allCollections.filter(col => {
      return col.name.toLowerCase().includes(filter.searchValue.toLowerCase());
    });
    handleSetState({ filteredCollection: filtered });
  }, [filter.searchValue]);

  useEffect(() => {
    if (!allCollections) return;
    let filtered = null;
    if (filter.price === "low") {
      filtered = allCollections.sort((a, b) => Number(a.price) - Number(b.price))
    } else {
      filtered = allCollections.sort((a, b) => Number(b.price) - Number(a.price))
    }
    handleSetState({ filteredCollection: filtered });
  }, [filter.price]);

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.header}>
          <h1 >Collections</h1>
          <div className={classes.searchAndPriceFilter}>
            <input
              type="search"
              onChange={event => handleSetState({ filter: { ...filter, searchValue: event.target.value } })}
              value={filter.searchValue}
              placeholder='search'
            />
            <div className={classes.priceDropdown}>
              <div onClick={() => handleSetState({ togglePriceFilter: !togglePriceFilter })} className={classes.selectedPrice}>
                {filter.price === 'low' ? 'Price: low to high' : 'Price: high to low'}
              </div>
              <div className={`${classes.dropdown} ${togglePriceFilter && classes.active}`}>
                <div onClick={() => handleSetState({ filter: { ...filter, price: 'low' }, togglePriceFilter: !togglePriceFilter })}>price: low to high</div>
                <div onClick={() => handleSetState({ filter: { ...filter, price: 'high' }, togglePriceFilter: !togglePriceFilter })}>Price: high to low</div>
              </div>
            </div>
          </div>
        </div>

        {
          filteredCollection ?
            <div className={classes.wrapper}>
              {
                filteredCollection
                  .filter((_, idx) => 10 > idx)
                  .map((collection, idx) => (
                    <CollectionsCard key={idx} collection={collection} />
                  ))
              }
            </div>
            :
            <div className={classes.skeleton}>
              {
                (Array(5).fill(null)).map((_, idx) => (
                  <div key={idx}>
                    <Skeleton count={1} height={300} />
                  </div>
                ))
              }
            </div>
        }
      </div>
    </div>
  )
}

export default Collections