import React, {
  useEffect, useState, useContext,
} from 'react';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
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
  const { mainnet } = useContext(GenContext);
  const history = useHistory();
  const location = useLocation();
  const [state, setState] = useState({
    filteredCollection: [],
    algoCollection: null,
    polyCollection: null,
    celoCollection: null,
    nearCollection: null,
    filter: {
      searchValue: '',
      price: 'low',
      chain: 'all',
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

  const getCollectionByChain = (network = filter.chain) => {
    switch (network.toLowerCase()) {
      case 'all':
        return [
          ...(algoCollection || []),
          ...(polyCollection || []),
          ...(celoCollection || []),
          ...(nearCollection || [])];
      case 'algorand':
        return algoCollection;
      case 'polygon':
        return polyCollection;
      case 'celo':
        return celoCollection;
      case 'near':
        return nearCollection;
      default:
        break;
    }
    return null;
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
        data.forEach(async (d) => {
          const response = await axios.get(
            d.url.replace('ipfs://', 'https://ipfs.io/ipfs/'),
          );
        });
        // handleSetState({ polyCollection: result });
        // console.log(result);
      }());
    } catch (error) {
      console.log(error);
    }
  }, []);

  // *********************** sort by price function for different blockchains **********************
  const sortPrice = () => {
    const collection = getCollectionByChain();
    if (!collection) return handleSetState({ filteredCollection: null });
    let sorted = [];
    if (filter.price === 'low') {
      sorted = collection.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      sorted = collection.sort((a, b) => Number(b.price) - Number(a.price));
    }
    handleSetState({ filteredCollection: sorted });
    return sorted;
  };

  useEffect(() => {
    const { search } = location;
    const name = new URLSearchParams(search).get('search');
    const chainParameter = new URLSearchParams(search).get('chain');
    if (chainParameter) {
      handleSetState({ filter: { ...filter, chain: chainParameter } });
    }
    const collection = getCollectionByChain();
    if (!collection) return handleSetState({ filteredCollection: null });
    if (name) {
      handleSetState({ filter: { ...filter, searchValue: name } });
    }
    const filtered = collection.filter(
      (col) => col.name.toLowerCase().includes(name ? name.toLowerCase() : ''),
    );
    if (filtered?.length) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
    return null;
  }, [
    algoCollection,
    polyCollection,
    celoCollection,
    nearCollection,
  ]);

  const searchHandler = (value) => {
    handleSetState({ filter: { ...filter, searchValue: value } });
    const { search } = location;
    const chainParam = new URLSearchParams(search).get('chain');
    const params = new URLSearchParams(
      {
        search: value,
        ...(chainParam && { chain: chainParam }),
      },
    );
    history.replace({ pathname: location.pathname, search: params.toString() });
    const collection = getCollectionByChain();
    if (!collection) return;
    const filtered = collection.filter(
      (col) => col.name.toLowerCase().includes(value.toLowerCase()),
    );
    if (filtered.length) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
  };

  const chainChange = (value) => {
    const { search } = location;
    const name = new URLSearchParams(search).get('search');
    const params = new URLSearchParams(
      {
        chain: value.toLowerCase(),
        ...(name && { search: name }),
      },
    );
    history.replace(
      { pathname: location.pathname, search: params.toString() },
    );
    handleSetState({ filter: { ...filter, chain: value } });
    const collection = getCollectionByChain(value);
    if (collection) {
      if (filter.searchValue) {
        const filtered = collection.filter(
          (col) => col.name.toLowerCase().includes(filter.searchValue.toLowerCase()),
        );
        if (filtered.length) {
          handleSetState({ filteredCollection: filtered });
        } else {
          handleSetState({ filteredCollection: null });
        }
      } else {
        handleSetState({ filteredCollection: collection });
      }
    } else {
      handleSetState({ filteredCollection: null });
    }
  };

  const priceUpdate = (value) => {
    handleSetState({ filter: { ...filter, price: value } });
    sortPrice();
  };
  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.header}>
          <h1>Collections</h1>
          <div className={classes.searchAndFilter}>
            <SearchBar
              onSearch={searchHandler}
            />
            <ChainDropdown
              onChainFilter={chainChange}
            />
            <PriceDropdown
              onPriceFilter={priceUpdate}
            />
          </div>
        </div>
        {filteredCollection?.length ? (
          <div className={classes.wrapper}>
            {filteredCollection.map((collection) => (
              <CollectionsCard key={collection.collection} collection={collection} />
            ))}
          </div>
        ) : !filteredCollection ? (
          <NotFound />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Collections;
