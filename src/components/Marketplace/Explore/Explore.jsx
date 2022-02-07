import { useContext, useState, useEffect } from 'react';
import { GenContext } from '../../../gen-state/gen.context';
import classes from './styles.module.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import data from './Data.json';
import Filter from './Filter';
import Header from './Header';
import NFTDisplay from './NFTDisplay';
import { getNftData, mapAttributeToFilter } from './Explore-script';

const Explore = ({ collectionName }) => {
  const [state, setState] = useState({
    togglePriceFilter: false,
    NFTs: null,
    attributes: null,
    filter: null,
    filterToDelete: null,
    priceFilter: 'high'
  })
  const { NFTs, attributes, filter, filterToDelete, togglePriceFilter, priceFilter } = state;
  const { collections } = useContext(GenContext)

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const handleFilter = filter => {
    handleSetState({ filter })
  }

  useEffect(() => {
    if (Object.keys(collections).length) {
      const collection = collections.allCollections.find(col => col.name === collectionName);
      (async function getResult() {
        let result = await getNftData(collection)
        console.log('result: nfts', result);
        handleSetState({
          NFTs: result
        })
      }())
    }
  }, [collections])

  useEffect(() => {
    // console.log(NFTs);
    handleSetState({
      attributes: mapAttributeToFilter(data)
    })
  }, [NFTs])

  useEffect(() => {
    console.log(filter);
  }, [filter])


  return (
    <div className={classes.container}>
      <Header />
      <div className={classes.wrapper}>
        <Filter handleFilter={handleFilter} filterToDelete={filterToDelete} attributes={attributes} />
        <main className={classes.main}>
          <div className={classes.searchAndPriceFilter}>
            <input type="search" placeholder='search' />
            <div className={classes.priceDropdown}>
              <div onClick={()=> handleSetState({togglePriceFilter: !togglePriceFilter})} className={classes.selectedPrice}>
                {priceFilter === 'low' ? 'Price: low to high' : 'Price: high to low' }
              </div>
              <div className={`${classes.dropdown} ${togglePriceFilter && classes.active}`}>
                <div onClick={()=> handleSetState({priceFilter: 'low', togglePriceFilter: !togglePriceFilter})}>price: low to high</div>
                <div onClick={()=> handleSetState({priceFilter: 'high', togglePriceFilter: !togglePriceFilter})}>Price: high to low</div>
              </div>
            </div>
          </div>

          <div className={classes.filterDisplay}>
            {
              filter && filter.attributes.map((f, idx) => (
                <div key={idx} className={classes.filteredItem}>
                  <span>{`${f.trait_type}: ${f.value}`}</span>
                  <img onClick={() => handleSetState({ filterToDelete: f })} src="/assets/icon-close.svg" alt="" />
                </div>
              ))
            }
          </div>
          <NFTDisplay NFTs={NFTs} />
        </main>
      </div>
    </div>
  )
}

export default Explore