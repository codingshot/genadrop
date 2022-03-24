import { useContext, useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { GenContext } from '../../gen-state/gen.context';
import { getSingleNfts } from '../../utils';
import classes from './singleNftCollection.module.css';
import NftCard from '../../components/Marketplace/NftCard/NftCard';
import { chainIcon } from './singleNftCollection.script';
import dropdownIcon from '../../assets/icon-dropdown.svg';
import axios from 'axios';
import arrowDown from '../../assets/icon-arrow-down-long.svg';
import arrowUp from '../../assets/icon-arrow-up-long.svg';

const SingleNftCollection = () => {
  const domMountRef = useRef(false);

  const [state, setState] = useState({
    togglePriceFilter: false,
    toggleChainFilter: false,
    filteredCollection: [],
    algoCollection: null,
    polyCollection: null,
    celoCollection: null,
    nearCollection: null,
    allSingleNfts: null,
    filter: {
      searchValue: '',
      price: 'high',
      chain: 'Algorand'
    }
  });

  const {
    allSingleNfts,
    algoCollection,
    polyCollection,
    celoCollection,
    nearCollection,
    filter,
    togglePriceFilter,
    toggleChainFilter,
    filteredCollection
  } = state;

  const getCollectionToFilter = () => {
    switch (filter.chain) {
      case 'Algorand':
        return algoCollection
      case 'Polygon':
        return polyCollection
      case 'Celo':
        return celoCollection
      case 'Near':
        return nearCollection
      default:
        break;
    }
  }
  
  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const { singleNfts } = useContext(GenContext);

  useEffect(() => {
    if (singleNfts.length) {
      (async function getResult() {
        let result = await getSingleNfts(singleNfts);
        handleSetState({
          allSingleNfts: result
        })
      }())
    }
  }, [singleNfts]);

  // useEffect(() => {
  //   if (!algoCollection) return;
  //   let filtered = algoCollection.filter(col => {
  //     return col.name.toLowerCase().includes(filter.searchValue.toLowerCase());
  //   });
  //   handleSetState({ filteredCollection: filtered });
  // }, [filter.searchValue]);

  // useEffect(() => {
  //   if (!algoCollection) return;
  //   let filtered = null;
  //   if (filter.price === "low") {
  //     filtered = algoCollection.sort((a, b) => Number(a.price) - Number(b.price))
  //   } else {
  //     filtered = algoCollection.sort((a, b) => Number(b.price) - Number(a.price))
  //   }
  //   handleSetState({ filteredCollection: filtered });
  // }, [filter.price]);

  // useEffect(() => {
  //   if (domMountRef.current) {
  //     console.log('mounted');
  //     let filteredCollection = getCollectionToFilter();
  //     handleSetState({ filteredCollection })
  //   } else {
  //     domMountRef.current = true;
  //   }
  //   console.log('dom');
  // }, [filter.chain, algoCollection, polyCollection, celoCollection, nearCollection]);


  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.heading}>
          <h3>Single Mint</h3>
        </div>
        <div className={classes.searchAndPriceFilter}>
          <input
            type="search"
            onChange={event => handleSetState({ filter: { ...filter, searchValue: event.target.value } })}
            value={filter.searchValue}
            placeholder='search'
          />

          <div className={classes.chainDropdown}>
            <div onClick={() => handleSetState({ toggleChainFilter: !toggleChainFilter, togglePriceFilter: false })} className={classes.selectedChain}>
              <div>
                <img src={chainIcon[filter.chain]} alt="" />
                <span>{filter.chain}</span>
              </div>
              <img src={dropdownIcon} alt="" className={`${classes.dropdownIcon} ${toggleChainFilter && classes.active}`} />
            </div>
            <div className={`${classes.dropdown} ${toggleChainFilter && classes.active}`}>
              <div onClick={() => handleSetState({ filter: { ...filter, chain: 'Algorand' }, toggleChainFilter: false })}>
                <img src={chainIcon.Algorand} alt="" />
                <span>Algorand</span>
              </div>
              <div onClick={() => handleSetState({ filter: { ...filter, chain: 'Polygon' }, toggleChainFilter: false })}>
                <img src={chainIcon.Polygon} alt="" />
                <span>Polygon</span>
              </div>
              <div onClick={() => handleSetState({ filter: { ...filter, chain: 'Near' }, toggleChainFilter: false })}>
                <img src={chainIcon.Near} alt="" />
                <span>Near</span>
              </div>
              <div onClick={() => handleSetState({ filter: { ...filter, chain: 'Celo' }, toggleChainFilter: false })}>
                <img src={chainIcon.Celo} alt="" />
                <span>Celo</span>
              </div>
            </div>
          </div>

          <div className={classes.priceDropdown}>
            <div onClick={() => handleSetState({ togglePriceFilter: !togglePriceFilter, toggleChainFilter: false })} className={classes.selectedPrice}>
              Price{filter.price === 'low' ? <span>Low to High</span> : <span>High to Low</span>}
              <img src={dropdownIcon} alt="" className={`${classes.dropdownIcon} ${togglePriceFilter && classes.active}`} />
            </div>
            <div className={`${classes.dropdown} ${togglePriceFilter && classes.active}`}>
              <div onClick={() => handleSetState({ filter: { ...filter, price: 'low' }, togglePriceFilter: false })}>
                price <span>Low to High</span> <img src={arrowUp} alt="" /></div>
              <div onClick={() => handleSetState({ filter: { ...filter, price: 'high' }, togglePriceFilter: false })}>
                price <span>High to Low</span><img src={arrowDown} alt="" /></div>
            </div>
          </div>
        </div>
        <div className={classes.wrapper}>
          {
            allSingleNfts ? allSingleNfts
              .map((nft, idx) => (
                <NftCard key={idx} nft={nft} />
              ))
              :
              (Array(5).fill(null)).map((_, idx) => (
                <div key={idx}>
                  <Skeleton count={1} height={200} />
                  <Skeleton count={3} height={40} />
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default SingleNftCollection;