import axios from 'axios';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { GenContext } from '../../../gen-state/gen.context';
import { getAlgoData } from '../../utils/arc_ipfs';
import classes from './styles.module.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Explore = ({ collectionName }) => {
  const [state, setState] = useState({
    viewAll: false,
    activeSearch: false,
    activeFilter: 'recentlySold',
    NFTs: null,
  })

  const { collections } = useContext(GenContext)
  const { viewAll, activeSearch, activeFilter, NFTs } = state;

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  useEffect(() => {

    const getNftData = async collection => {
      let nftArr = []
      let { data } = await axios.get(collection['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
      for (let i = 0; i < data.length; i++) {
        try {
          let nftObj = {}
          nftObj.collection_name = collection.name
          nftObj.owner = collection.owner
          nftObj.price = collection.price
          let { params } = await getAlgoData(data[i])
          nftObj.algo_data = params
          let response = await axios.get(params['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
          nftObj.ipfs_data = response.data
          nftObj.name = response.data.name;
          nftObj.image_url = response.data.properties.file_url
          nftArr.push(nftObj)
        } catch (error) {
          console.error('|=> --- error --- <=|', error);
        }
      }
      return nftArr
    }

    if (Object.keys(collections).length) {
      const collection = collections.allCollections.filter(col => col.name === collectionName);
      (async function getResult() {
        let result = await getNftData(collection[0])
        handleSetState({
          NFTs: result
        })
      }())
    }
  }, [collections])

  useEffect(() => {
    console.log(NFTs);
  },[NFTs])

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>Explore</h3>
        <div className={classes.control}>
          <div className={classes.inputContainer}>
            <input className={`${activeSearch && classes.active}`} type="text" />
          </div>
          <img onClick={() => handleSetState({ activeSearch: !activeSearch })} src="/assets/icon-search.png" alt="" />
          <div className={classes.select}>
            <p>Alphabetical</p>
            <img src="/assets/icon-dropdown.png" alt="" />
          </div>
          <button onClick={() => handleSetState({ viewAll: !viewAll })}>
            view all {
              viewAll
              ? <img src="/assets/icon-chevron-up.svg" alt="" />
              : <img src="/assets/icon-chevron-down.svg" alt="" />
            }
          </button>
        </div>
      </div>

      <div className={classes.filter}>
        <button
          onClick={() => handleSetState({ activeFilter: 'recentlySold' })}
          className={`${activeFilter === 'recentlySold' && classes.active}`}>
          Recently sold
        </button>
        <button
          onClick={() => handleSetState({ activeFilter: 'newMints' })}
          className={`${activeFilter === 'newMints' && classes.active}`}>
          New mints
        </button>
        <button
          onClick={() => handleSetState({ activeFilter: 'topGainers' })}
          className={`${activeFilter === 'topGainers' && classes.active}`}>
          Top Gainers
        </button>
      </div>

      <div className={classes.wrapper}>
        {
          NFTs ? NFTs
            .filter((_, idx) => viewAll ? true : 10 > idx)
            .map(({name, price, collection_name, owner, image_url}, idx) => (
              <div key={idx} className={classes.card}>
                <div style={{ backgroundImage: `url(${image_url})` }} className={classes.imgContainer}></div>
                <div className={classes.cardBody}>
                  <p className={classes.title}>{collection_name}</p>
                  <div className={classes.info}>
                    <p className={classes.name}>{name}</p>
                    <span className={classes.price}>{price} Algo</span>
                  </div>
                  <div className={classes.tokenId}>
                    <img src="/assets/explore-thumbnail-1.png" alt="" />
                    <span>{owner.substring(0, 5)}...{owner.substring(owner.length-4, owner.length)}</span>
                  </div>
                  <div className={classes.buttons}>
                    <button>make offer</button>
                    <button>buy now</button>
                  </div>
                </div>
              </div>
            ))
            :
            (Array(6).fill(null)).map((_, idx) => (
              <div key={idx}>
                <Skeleton count={1} height={200} />
                <Skeleton count={3} height={40} />
              </div>
            ))
        }
      </div>

      <div>

      </div>
    </div>
  )
}

export default Explore