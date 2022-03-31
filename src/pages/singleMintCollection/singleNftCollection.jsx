import React, { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { getSingleNfts } from '../../utils';
import classes from './singleNftCollection.module.css';
import NftCard from '../../components/Marketplace/NftCard/NftCard';
import { readAllSingleNft } from '../../utils/firebase';
import NotFound from '../../components/not-found/notFound';
import SearchBar from '../../components/Marketplace/Search-bar/searchBar.component';
import ChainDropdown from '../../components/Marketplace/Chain-dropdown/chainDropdown';
import PriceDropdown from '../../components/Marketplace/Price-dropdown/priceDropdown';

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
      price: 'low',
      chain: 'Algorand',
    },
  });

  const {
    algoCollection,
    polyCollection,
    celoCollection,
    nearCollection,
    filter,
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
  };

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  // ****************************** get singleNft collections for all the blockchains ******************
  useEffect(() => {
    try {
      (async function getAlgoSingleNftCollection() {
        const singleNftCollections = await readAllSingleNft();
        const result = await getSingleNfts(singleNftCollections);
        console.log('single result: ', result);
        handleSetState({
          algoCollection: result,
        });
      })();
    } catch (error) {
      console.log(error);
    }
  }, []);
  // ***************************** get search result for different blockchains ************************
  useEffect(() => {
    let collection = getCollectionByChain();
    if (!collection) return;
    let filtered = collection.filter((col) => {
      return col.name.toLowerCase().includes(filter.searchValue.toLowerCase());
    });
    if (filtered.length) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
  }, [filter.searchValue]);
  // ************************* sort by price function for different blockchains *********************
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
  // ********************************* render blockchains *******************************************
  useEffect(() => {
    if (domMountRef.current) {
      sortPrice(getCollectionByChain());
    } else {
      domMountRef.current = true;
    }
  }, [
    filter.chain,
    filter.price,
    algoCollection,
    polyCollection,
    celoCollection,
    nearCollection,
  ]);

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.heading}>
          <h3>1 of 1s</h3>
        </div>
        <div className={classes.searchAndFilter}>
          <SearchBar
            onSearch={(value) =>
              handleSetState({ filter: { ...filter, searchValue: value } })
            }
          />
          <ChainDropdown
            onChainFilter={(value) =>
              handleSetState({ filter: { ...filter, chain: value } })
            }
          />
          <PriceDropdown
            onPriceFilter={(value) =>
              handleSetState({ filter: { ...filter, price: value } })
            }
          />
        </div>
        {filteredCollection?.length ? (
          <div className={classes.wrapper}>
            {filteredCollection.map((nft, idx) => (
              <NftCard key={idx} nft={nft} />
            ))}
          </div>
        ) : !filteredCollection ? (
          <NotFound />
        ) : (
          <div className={classes.skeleton}>
            {Array(5)
              .fill(null)
              .map((_, idx) => (
                <div key={idx}>
                  <Skeleton count={1} height={200} />
                  <Skeleton count={3} height={40} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleNftCollection;
