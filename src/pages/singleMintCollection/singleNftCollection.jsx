import React, { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { getSingleNfts } from '../../utils';
import classes from './singleNftCollection.module.css';
import NftCard from '../../components/Marketplace/NftCard/NftCard';
import chainIcon from './singleNftCollection.script';
import dropdownIcon from '../../assets/icon-dropdown.svg';
import arrowDown from '../../assets/icon-arrow-down-long.svg';
import arrowUp from '../../assets/icon-arrow-up-long.svg';
import { readAllSingleNft } from '../../utils/firebase';
import NotFound from '../../components/not-found/notFound';

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
    filter: {
      searchValue: '',
      price: 'high',
      chain: 'Algorand',
    },
  });

  const {
    algoCollection,
    polyCollection,
    celoCollection,
    nearCollection,
    filter,
    togglePriceFilter,
    toggleChainFilter,
    filteredCollection,
  } = state;

  const getCollectionByChain = () => {
    switch (filter.chain) {
      case 'Algorand':
        return algoCollection;
      case 'Polygon':
        return polyCollection;
      case 'Celo':
        return celoCollection;
      case 'Near':
        return nearCollection;
      default:
        break;
    }
    return null;
  };

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  // ******************* get singleNft collections for all the blockchains *******************
  useEffect(() => {
    try {
      (async function getAlgoSingleNftCollection() {
        const singleNftCollections = await readAllSingleNft();
        const result = await getSingleNfts(singleNftCollections);
        console.log('single result: ', result);
        handleSetState({
          algoCollection: result,
        });
      }());
    } catch (error) {
      console.log(error);
    }

    // get singleNftCollection for other chains: polygon|celo|near
  }, []);
  // *******************************************************************************************

  // ********************** get search result for different blockchains ************************
  useEffect(() => {
    const collection = getCollectionByChain();
    if (!collection) return;
    const filtered = collection.filter(
      (col) => col.name.toLowerCase().includes(filter.searchValue.toLowerCase()),
    );
    if (filtered.length) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
  }, [filter.searchValue]);
  // *******************************************************************************************

  // ********************* sort by price function for different blockchains ********************
  // eslint-disable-next-line consistent-return
  const sortPrice = (collection) => {
    if (!collection) return handleSetState({ filteredCollection: null });
    let sorted = [];
    if (filter.price === 'low') {
      sorted = collection.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      sorted = collection.sort((a, b) => Number(b.price) - Number(a.price));
    }
    handleSetState({ filteredCollection: sorted });
  };
  // *******************************************************************************************

  // *********************************** render blockchains ************************************
  useEffect(() => {
    if (domMountRef.current) {
      sortPrice(getCollectionByChain());
    } else {
      domMountRef.current = true;
    }
  }, [filter.chain, filter.price, algoCollection, polyCollection, celoCollection, nearCollection]);
  // *******************************************************************************************

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.heading}>
          <h3>1 of 1s</h3>
        </div>
        <div className={classes.searchAndPriceFilter}>
          <input
            type="search"
            onChange={(event) => handleSetState(
              { filter: { ...filter, searchValue: event.target.value } },
            )}
            value={filter.searchValue}
            placeholder="search"
          />

          <div className={classes.chainDropdown}>
            <div
              onClick={() => handleSetState(
                { toggleChainFilter: !toggleChainFilter, togglePriceFilter: false },
              )}
              className={classes.selectedChain}
            >
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
            <div
              onClick={() => handleSetState(
                { togglePriceFilter: !togglePriceFilter, toggleChainFilter: false },
              )}
              className={classes.selectedPrice}
            >
              Price
              {filter.price === 'low' ? <span>Low to High</span> : <span>High to Low</span>}
              <img src={dropdownIcon} alt="" className={`${classes.dropdownIcon} ${togglePriceFilter && classes.active}`} />
            </div>
            <div className={`${classes.dropdown} ${togglePriceFilter && classes.active}`}>
              <div onClick={() => handleSetState({ filter: { ...filter, price: 'low' }, togglePriceFilter: false })}>
                price
                {' '}
                <span>Low to High</span>
                {' '}
                <img src={arrowUp} alt="" />

              </div>
              <div onClick={() => handleSetState({ filter: { ...filter, price: 'high' }, togglePriceFilter: false })}>
                price
                {' '}
                <span>High to Low</span>
                <img src={arrowDown} alt="" />

              </div>
            </div>
          </div>
        </div>
        {
          filteredCollection?.length
            ? (
              <div className={classes.wrapper}>
                {
                filteredCollection
                  .map((nft, idx) => (
                    <NftCard key={idx} nft={nft} />
                  ))
              }
              </div>
            )
            : !filteredCollection
              ? <NotFound />
              : (
                <div className={classes.skeleton}>
                  {
                  ([...new Array(10)].map((_, idx) => idx)).map((id) => (
                    <div key={id}>
                      <Skeleton count={1} height={200} />
                      <Skeleton count={3} height={40} />
                    </div>
                  ))
                }
                </div>
              )
        }
      </div>
    </div>
  );
};

export default SingleNftCollection;
