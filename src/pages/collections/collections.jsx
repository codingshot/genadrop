import React, {
  useEffect, useRef, useState, useContext,
} from 'react';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';
import classes from './collections.module.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { getNftCollections } from '../../utils';
import CollectionsCard from '../../components/Marketplace/collectionsCard/collectionsCard';
import { getPolygonNfts } from '../../utils/arc_ipfs';
import transformArrayOfArraysToArrayOfObjects from './collection-script';
import { fetchCollections } from '../../utils/firebase';
import { GenContext } from '../../gen-state/gen.context';
import NotFound from '../../components/not-found/notFound';
import PriceDropdown from '../../components/Marketplace/Price-dropdown/priceDropdown';
import ChainDropdown from '../../components/Marketplace/Chain-dropdown/chainDropdown';
import SearchBar from '../../components/Marketplace/Search-bar/searchBar.component';

const Collections = () => {
  const domMountRef = useRef(false);
  const { mainnet } = useContext(GenContext);

  const [state, setState] = useState({
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

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

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

  // *************************get results from different blockchains*************************
  useEffect(() => {
    try {
      (async function getAlgoCollection() {
        const collections = await fetchCollections(mainnet);
        const result = await getNftCollections(collections, mainnet);
        handleSetState({ algoCollection: result });
      }());
    } catch (error) {
      console.log(error);
    }

    try {
      (async function getPolygonCollection() {
        const result = await getPolygonNfts();
        const data = transformArrayOfArraysToArrayOfObjects(result);
        for (const d of data) {
          const response = await axios.get(d.url.replace('ipfs://', 'https://ipfs.io/ipfs/'));
        }
        // handleSetState({ polyCollection: result });
        // console.log(result);
      }());
    } catch (error) {
      console.log(error);
    }
  }, []);
  // ***********************************************************************************************

  // ************************* get search result for different blockchains *************************
  useEffect(() => {
    const collection = getCollectionByChain();
    if (!collection) return;
    const filtered = collection.filter((col) => col.name.toLowerCase().includes(filter.searchValue.toLowerCase()));
    if (filtered.length) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
  }, [filter.searchValue]);
  // ***********************************************************************************************

  // *********************** sort by price function for different blockchains **********************
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
  // ***********************************************************************************************

  // ********************************* render blockchains ******************************************
  useEffect(() => {
    if (domMountRef.current) {
      sortPrice(getCollectionByChain());
    } else {
      domMountRef.current = true;
    }
  }, [filter.chain, filter.price, algoCollection, polyCollection, celoCollection, nearCollection]);
  // ***********************************************************************************************

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.header}>
          <h1>Collections</h1>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={
              (value) => handleSetState({ filter: { ...filter, searchValue: value } })
              }
            />
            <ChainDropdown onChainFilter={
              (value) => handleSetState({ filter: { ...filter, chain: value } })
              }
            />
            <PriceDropdown onPriceFilter={
              (value) => handleSetState({ filter: { ...filter, price: value } })
              }
            />
          </div>
        </div>
        {
          filteredCollection?.length
            ? (
              <div className={classes.wrapper}>
                {
                filteredCollection
                  .map((collection, idx) => (
                    <CollectionsCard key={idx} collection={collection} />
                  ))
              }
              </div>
            )
            : !filteredCollection
              ? <NotFound />
              : (
                <div className={classes.skeleton}>
                  {
                  ([...new Array(4)].map((_, idx) => idx)).map((id) => (
                    <div key={id}>
                      <Skeleton count={1} height={250} />
                      <br />
                      <Skeleton count={1} height={30} />
                      <br />
                      <Skeleton count={1} height={30} />
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

export default Collections;
