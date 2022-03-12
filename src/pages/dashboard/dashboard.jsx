import { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useRouteMatch } from 'react-router-dom';
import CollectionsCard from '../../components/Marketplace/collectionsCard/collectionsCard';
import NftCard from '../../components/Marketplace/NftCard/NftCard';
import { GenContext } from '../../gen-state/gen.context';
import { getNftCollection, getNftCollections, getUserNftCollection } from '../../utils';
import { fetchAllNfts, fetchUserCollections, fetchUserNfts } from '../../utils/firebase';
import classes from './dashboard.module.css';

const Dashboard = () => {

  const [state, setState] = useState({
    togglePriceFilter: false,
    filter: {
      searchValue: '',
      price: 'high',
    },
    activeDetail: 'created',
    collectedNfts: null,
    createdNfts: null,
    myCollections: null,
    filteredCollection: null
  });

  const { filter, togglePriceFilter, activeDetail, myCollections, createdNfts, collectedNfts, filteredCollection } = state;
  const { account } = useContext(GenContext);

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const breakAddress = (address = "", width = 6) => {
    return `${address.slice(0, width)}...${address.slice(-width)}`
  }

  useEffect(() => {
    if (!account) return;

    (async function readAllSingle() {
      let userCollections = await fetchUserCollections(account);
      let myCollections = await getNftCollections(userCollections);
      handleSetState({ myCollections });
    }());

    (async function getCollections() {
      let userNftCollections = await fetchUserNfts(account);
      let createdNfts = await getUserNftCollection(userNftCollections);
      handleSetState({ createdNfts });
    }());

    (async function getCollections() {
      let userNftCollections = await fetchAllNfts(account);
      console.log(userNftCollections);
      let result = await getUserNftCollection(userNftCollections);
      // console.log('result: ', result);
      // handleSetState({ createdNfts })
    }());

  }, [account]);

  const getCollectionToFilter = () => {
    switch (activeDetail) {
      case 'collected':
        return collectedNfts
      case 'created':
        return createdNfts
      case 'collections':
        return myCollections
      default:
        break;
    }
  }

  useEffect(() => {
    if (!account) return
    if(!filteredCollection) return
    let filtered = getCollectionToFilter().filter(col => {
      return col.name.toLowerCase().includes(filter.searchValue.toLowerCase());
    });
    handleSetState({ filteredCollection: filtered });
  }, [filter.searchValue]);

  useEffect(() => {
    if (!account) return
    if(!filteredCollection) return
    let filtered = null;
    if (filter.price === "low") {
      filtered = getCollectionToFilter().sort((a, b) => Number(a.price) - Number(b.price))
    } else {
      filtered = getCollectionToFilter().sort((a, b) => Number(b.price) - Number(a.price))
    }
    handleSetState({ filteredCollection: filtered });
  }, [filter.price]);

  useEffect(() => {
    if (!account) return;
    let filteredCollection = getCollectionToFilter();
    if (!filteredCollection) return;
    handleSetState({ filteredCollection })
  }, [activeDetail, createdNfts, collectedNfts, myCollections])

  const { url } = useRouteMatch();

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <section className={classes.header}>
          <div className={classes.imageContainer}></div>
          <div className={classes.address}>{breakAddress(account)}</div>
          <Link to={`${url}/settings`}>
            <div className={classes.profile}>Edit Profile</div>
          </Link>
          <div className={classes.details}>
            <div onClick={() => handleSetState({ activeDetail: 'created' })} className={`${classes.detail} ${activeDetail === "created" && classes.active}`}>
              <p>Created NFT</p>
              <span>{createdNfts && createdNfts.length}</span>
            </div>
            <div onClick={() => handleSetState({ activeDetail: 'collected' })} className={`${classes.detail} ${activeDetail === "collected" && classes.active}`}>
              <p>Collected NFTs</p>
              <span>{collectedNfts && collectedNfts.length}</span>
            </div>
            <div onClick={() => handleSetState({ activeDetail: 'collections' })} className={`${classes.detail} ${activeDetail === "collections" && classes.active}`}>
              <p>My Collections</p>
              <span>{myCollections && myCollections.length}</span>
            </div>
          </div>
        </section>

        <section className={classes.main}>
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

          {
            filteredCollection && activeDetail === 'collections' ?
              <div className={classes.overview}>
                {
                  filteredCollection
                    .map((collection, idx) => (
                      <CollectionsCard key={idx} collection={collection} />
                    ))
                }
              </div>
              :
              filteredCollection && activeDetail === 'created' ?
                <div className={classes.overview}>
                  {
                    filteredCollection
                      .map((nft, idx) => (
                        <NftCard key={idx} nft={nft} list={true} />
                      ))
                  }
                </div>
                :
                filteredCollection && activeDetail === 'collected' ?
                  <div className={classes.overview}>
                    {
                      filteredCollection
                        .map((nft, idx) => (
                          <NftCard key={idx} nft={nft} list={true} />
                        ))
                    }
                  </div>
                  :
                  <div className={classes.skeleton}>
                    {
                      (Array(5).fill(null)).map((_, idx) => (
                        <div key={idx}>
                          <Skeleton count={1} height={300} />
                        </div>
                      ))
                    }
                  </div>
          }
        </section>
      </div>
    </div>
  )
}

export default Dashboard;