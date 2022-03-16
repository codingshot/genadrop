import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import classes from './collections.module.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { getNftCollections } from '../../utils';
import { GenContext } from '../../gen-state/gen.context';
import CollectionsCard from '../../components/Marketplace/collectionsCard/collectionsCard';
import { getPolygonNfts } from '../../utils/arc_ipfs';
import { chainIcon } from './collection-script';

const Collections = () => {

  const { collections } = useContext(GenContext);

  const [state, setState] = useState({
    allCollections: null,
    togglePriceFilter: false,
    toggleChainFilter: false,
    filteredCollection: null,
    filter: {
      searchValue: '',
      price: 'high',
      chain: 'All Chains'
    }
  });

  const { allCollections, filter, togglePriceFilter, toggleChainFilter, filteredCollection } = state;

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

  useEffect(()=> {
    (async function getPolygonCollections(){
      console.log('calling you ');
      const res = await getPolygonNfts();
      console.log(res);
    }());
  },[]);

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
              <div onClick={() => handleSetState({ toggleChainFilter: !toggleChainFilter, togglePriceFilter: false })} className={classes.selectedPrice}>
                <img src={chainIcon[filter.chain]} alt="" />
                <span>{filter.chain}</span>
              </div>
              <div className={`${classes.dropdown} ${toggleChainFilter && classes.active}`}>
                <div onClick={() => handleSetState({ filter: { ...filter, chain: 'Polygon' }, toggleChainFilter: false })}>
                  <img src={chainIcon.Polygon} alt="" />
                  <span>Polygon</span>
                </div>
                <div onClick={() => handleSetState({ filter: { ...filter, chain: 'Algorand' }, toggleChainFilter: false })}>
                  <img src={chainIcon.Algorand} alt="" />
                  <span>Algorand</span>
                </div>
                <div onClick={() => handleSetState({ filter: { ...filter, chain: 'Near' }, toggleChainFilter: false })}>
                  <img src={chainIcon.Near} alt="" />
                  <span>Near</span>
                </div>
                <div onClick={() => handleSetState({ filter: { ...filter, chain: 'Celo' }, toggleChainFilter: false })}>
                  <img src={chainIcon.CeloIcon} alt="" />
                  <span>Celo</span>
                </div>
                <div onClick={() => handleSetState({ filter: { ...filter, chain: 'All Chains' }, toggleChainFilter: false })}>All Chains</div>
              </div>
            </div>

            <div className={classes.priceDropdown}>
              <div onClick={() => handleSetState({ togglePriceFilter: !togglePriceFilter, toggleChainFilter: false })} className={classes.selectedPrice}>
                {filter.price === 'low' ? 'Price: low to high' : 'Price: high to low'}
              </div>
              <div className={`${classes.dropdown} ${togglePriceFilter && classes.active}`}>
                <div onClick={() => handleSetState({ filter: { ...filter, price: 'low' }, togglePriceFilter: false })}>price: low to high</div>
                <div onClick={() => handleSetState({ filter: { ...filter, price: 'high' }, togglePriceFilter: false })}>Price: high to low</div>
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
                (Array(4).fill(null)).map((_, idx) => (
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