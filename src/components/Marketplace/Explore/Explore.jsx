import { useContext, useState, useEffect } from 'react';
import { GenContext } from '../../../gen-state/gen.context';
import classes from './styles.module.css';
import 'react-loading-skeleton/dist/skeleton.css'
import Filter from './Filter';
import Header from './Header';
import NFTDisplay from './NFTDisplay';
import { mapAttributeToFilter } from './Explore-script';
import { getNftCollection } from '../../../utils';

const Explore = ({ collectionName }) => {
  const [state, setState] = useState({
    togglePriceFilter: false,
    NFTCollection: null,
    FilteredCollection: null,
    collection: null,
    attributes: null,
    filterToDelete: null,
    filter: {
      searchValue: '',
      price: 'high',
    },
  })
  const { collection, NFTCollection, attributes, filter, filterToDelete, togglePriceFilter, FilteredCollection } = state;
  const { collections } = useContext(GenContext)

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const handleFilter = _filter => {
    handleSetState({ filter: {...filter, ..._filter} })
  }

  useEffect(() => {
    if (Object.keys(collections).length) {
      const collection = collections.allCollections.find(col => col.name === collectionName);
      (async function getResult() {
        let result = await getNftCollection(collection)
        handleSetState({
          collection,
          NFTCollection: result
        })
      }())
    }
  }, [collections])

  useEffect(() => {
    if (!NFTCollection) return
    handleSetState({
      attributes: mapAttributeToFilter(NFTCollection)
    })
  }, [NFTCollection])

  useEffect(() => {
    if(!NFTCollection) return;
    let filtered = NFTCollection.filter(col => {
      return col.name.includes(filter.searchValue)
    })
    handleSetState({FilteredCollection: filtered})
  }, [filter, NFTCollection])

  return (
    <div className={classes.container}>
      <Header collection={{
        ...collection,
        numberOfNfts: NFTCollection
          && NFTCollection.length,
        imageUrl: NFTCollection
          && NFTCollection[Math.floor(Math.random() * NFTCollection.length)].image_url
      }}
      />
      <div className={classes.wrapper}>
        <Filter handleFilter={handleFilter} filterToDelete={filterToDelete} attributes={attributes} />
        <main className={classes.main}>
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

          <div className={classes.filterDisplay}>
            {
              filter?.attributes && filter.attributes.map((f, idx) => (
                <div key={idx} className={classes.filteredItem}>
                  <span>{`${f.trait_type}: ${f.value}`}</span>
                  <img onClick={() => handleSetState({ filterToDelete: f })} src="/assets/icon-close.svg" alt="" />
                </div>
              ))
            }
          </div>
          <NFTDisplay NFTCollection={FilteredCollection} />
        </main>
      </div>
    </div>
  )
}

export default Explore