import { useEffect, useRef, useState } from 'react';
import classes from './collections.module.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { getNftCollections } from '../../utils';
import CollectionsCard from '../../components/Marketplace/collectionsCard/collectionsCard';
import { getPolygonNfts } from '../../utils/arc_ipfs';
import { transformArrayOfArraysToArrayOfObjects } from './collection-script';
import { fetchCollections } from '../../utils/firebase';
import axios from 'axios';
import NotFound from '../../components/not-found/notFound';
import PriceDropdown from '../../components/Marketplace/Price-dropdown/priceDropdown';
import ChainDropdown from '../../components/Marketplace/Chain-dropdown/chainDropdown';
import SearchBar from '../../components/Marketplace/Search-bar/searchBar.component';

const Collections = () => {
  const domMountRef = useRef(false);

  const [state, setState] = useState({
    filteredCollection: [],
    algoCollection: null,
    polyCollection: null,
    celoCollection: null,
    nearCollection: null,
    filter: {
      searchValue: '',
      price: 'low',
      chain: 'Algorand'
    }
  });

  const {
    algoCollection,
    polyCollection,
    celoCollection,
    nearCollection,
    filter,
    filteredCollection
  } = state;

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const getCollectionByChain = () => {
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

  // *************************get results from different blockchains**************************************
  useEffect(() => {
    try {
      (async function getAlgoCollection() {
        let collections = await fetchCollections();
        let result = await getNftCollections(collections)
        handleSetState({ algoCollection: result })
      }())
    } catch (error) {
      console.log(error);
    }

    try {
      (async function getPolygonCollection() {
        const result = await getPolygonNfts();
        let data = transformArrayOfArraysToArrayOfObjects(result);
        for (let d of data) {
          let response = await axios.get(d['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));

        }
        // handleSetState({ polyCollection: result });
        // console.log(result);
      }())
    } catch (error) {
      console.log(error);
    }
  }, []);
  // **************************************************************************************************



  // ***************************** get search result for different blockchains ************************
  useEffect(() => {
    let collection = getCollectionByChain();
    if (!collection) return;
    let filtered = collection.filter(col => {
      return col.name.toLowerCase().includes(filter.searchValue.toLowerCase());
    });
    if (filtered.length) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
  }, [filter.searchValue]);
  // ************************************************************************************************



  // ************************* sort by price function for different blockchains *********************
  const sortPrice = collection => {
    if (!collection) return handleSetState({ filteredCollection: null });
    let sorted = [];
    if (filter.price === "low") {
      sorted = collection.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      sorted = collection.sort((a, b) => Number(b.price) - Number(a.price));
    }
    handleSetState({ filteredCollection: sorted });
  }
  // ************************************************************************************************



  // ********************************* render blockchains *******************************************
  useEffect(() => {
    console.log(filter);
    if (domMountRef.current) {
      sortPrice(getCollectionByChain());
    } else {
      domMountRef.current = true;
    }
  }, [filter.chain, filter.price, algoCollection, polyCollection, celoCollection, nearCollection]);
  // **************************************************************************************************

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.header}>
          <h1 >Collections</h1>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={value => handleSetState({ filter: { ...filter, searchValue: value } })} />
            <ChainDropdown onChainFilter={value => handleSetState({ filter: { ...filter, chain: value } })} />
            <PriceDropdown onPriceFilter={value => handleSetState({ filter: { ...filter, price: value } })} />
          </div>
        </div>
        {
          filteredCollection?.length ?
            <div className={classes.wrapper}>
              {
                filteredCollection
                  .map((collection, idx) => (
                    <CollectionsCard key={idx} collection={collection} />
                  ))
              }
            </div>
            :
            !filteredCollection
              ?
              <NotFound />
              :
              <div className={classes.skeleton}>
                {
                  (Array(4).fill(null)).map((_, idx) => (
                    <div key={idx}>
                      <Skeleton count={1} height={250} />
                      <br />
                      <Skeleton count={1} height={30} />
                      <br />
                      <Skeleton count={1} height={30} />
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