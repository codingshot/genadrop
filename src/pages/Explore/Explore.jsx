import { useContext, useState, useEffect } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { useParams } from 'react-router-dom';
import classes from './Explore.module.css';
import 'react-loading-skeleton/dist/skeleton.css'
import Filter from './Filter/Filter';
import Header from './Header/Header';
import { groupAttributesByTraitType, mapAttributeToFilter } from './Explore-script';
import { getNftCollection } from '../../utils';
import Menu from './Menu/Menu';
import closeIcon from '../../assets/icon-close.svg';
import dropdownIcon from '../../assets/icon-dropdown.svg';
import arrowDown from '../../assets/icon-arrow-down-long.svg';
import arrowUp from '../../assets/icon-arrow-up-long.svg';

const Explore = () => {

  const [state, setState] = useState({
    togglePriceFilter: false,
    NFTCollection: null,
    FilteredCollection: null,
    collection: null,
    attributes: null,
    filterToDelete: null,
    headerHeight: 0,
    filter: {
      searchValue: '',
      price: 'high',
    },
  })
  const { collection, NFTCollection, attributes, filter, filterToDelete, togglePriceFilter, FilteredCollection, headerHeight } = state;
  const { collections } = useContext(GenContext);

  const { collectionName } = useParams();

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const handleFilter = _filter => {
    handleSetState({ filter: { ...filter, ..._filter } })
  }

  const getHeight = res => {
    handleSetState({headerHeight: res})
  }

  useEffect(() => {
    if (Object.keys(collections).length) {
      const collection = collections.find(col => col.name === collectionName);
      (async function getResult() {
        let result = await getNftCollection(collection);
        handleSetState({
          collection,
          NFTCollection: result
        })
      }())
    }
  }, [collections]);

  useEffect(() => {
    if (!NFTCollection) return
    handleSetState({
      attributes: mapAttributeToFilter(NFTCollection),
      FilteredCollection: NFTCollection
    })
  }, [NFTCollection]);

  useEffect(() => {
    if (!NFTCollection) return;
    let filtered = NFTCollection.filter(col => {
      return col.name.toLowerCase().includes(filter.searchValue.toLowerCase());
    })
    handleSetState({ FilteredCollection: filtered });
  }, [filter.searchValue]);

  useEffect(() => {
    if (!NFTCollection) return;
    let filtered = null;
    if (filter.price === "low") {
      filtered = NFTCollection.sort((a, b) => Number(a.price) - Number(b.price))
    } else {
      filtered = NFTCollection.sort((a, b) => Number(b.price) - Number(a.price))
    }
    handleSetState({ FilteredCollection: filtered });
  }, [filter.price]);

  useEffect(() => {
    if (!NFTCollection) return;
    let filtered = NFTCollection.filter(col => {
      return Number(col.price) >= Number(filter.priceRange.min) && Number(col.price) <= Number(filter.priceRange.max);
    });
    handleSetState({ FilteredCollection: filtered });
  }, [filter.priceRange]);

  useEffect(() => {
    if (!NFTCollection) return;
    let groupedAttributes = groupAttributesByTraitType(filter.attributes);
    let filtered = NFTCollection.filter(col => {
      return Object.keys(groupedAttributes).every(attributeKey => {
        return groupedAttributes[attributeKey].some(el => {
          return JSON.stringify(col.ipfs_data.properties).includes(JSON.stringify(el));
        });
      });
    });
    handleSetState({ FilteredCollection: filtered });
    console.log(headerHeight);
    document.documentElement.scrollTop = headerHeight;

  }, [filter.attributes]);

  return (
    <div className={classes.container}>
      <Header getHeight={getHeight} collection={{
        ...collection,
        numberOfNfts: NFTCollection
          && NFTCollection.length,
        imageUrl: NFTCollection
          && NFTCollection[Math.floor(Math.random() * NFTCollection.length)].image_url
      }}
      />

      <div className={classes.displayContainer}>
        <Filter handleFilter={handleFilter} filterToDelete={filterToDelete} attributes={attributes} />
        <main className={classes.displayWrapper}>
          <div className={classes.searchAndPriceFilter}>
            <input
              type="search"
              onChange={event => handleSetState({ filter: { ...filter, searchValue: event.target.value } })}
              value={filter.searchValue}
              placeholder='search'
            />
            <div className={classes.priceDropdown}>
              <div onClick={() => handleSetState({ togglePriceFilter: !togglePriceFilter, toggleChainFilter: false })} className={classes.selectedPrice}>
                <span>price {filter.price === 'low' ? <img src={arrowUp} alt="" /> : <img src={arrowDown} alt="" />}</span>
                <img src={dropdownIcon} alt="" className={`${classes.dropdownIcon} ${togglePriceFilter && classes.active}`} />
              </div>
              <div className={`${classes.dropdown} ${togglePriceFilter && classes.active}`}>
                <div onClick={() => handleSetState({ filter: { ...filter, price: 'low' }, togglePriceFilter: false })}>
                  price <img src={arrowUp} alt="" /></div>
                <div onClick={() => handleSetState({ filter: { ...filter, price: 'high' }, togglePriceFilter: false })}>
                  price <img src={arrowDown} alt="" /></div>
              </div>
            </div>
          </div>

          <div className={classes.filterDisplay}>
            {
              filter?.attributes && filter.attributes.map((f, idx) => (
                <div key={idx} className={classes.filteredItem}>
                  <span>{`${f.trait_type}: ${f.value}`}</span>
                  <div onClick={() => handleSetState({ filterToDelete: f })} className={classes.closeIcon}>
                    <img src={closeIcon} alt="" />
                  </div>
                </div>
              ))
            }
            {
              filter?.attributes && filter.attributes.length
                ? <div onClick={() => handleSetState({ filterToDelete: [] })} className={classes.clearFilter}>clear all</div>
                : null
            }
          </div>
          <Menu NFTCollection={FilteredCollection} />
        </main>
      </div>
    </div>
  )
}

export default Explore