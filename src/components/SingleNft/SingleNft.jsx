import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import NftCard from '../NftCard/NftCard';
import classes from './SingleNft.module.css';

const SingleNft = () => {
  const [state, setState] = useState({
    viewAll: false,
  })

  const { viewAll } = state

  const handleSetState = payload => {
    setState(state => ({...state, ...payload}))
  }

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>Newest NFTs</h3>
        <button onClick={() => handleSetState({ viewAll: !viewAll })}>
          view all {
            viewAll
              ? <img src="/assets/icon-chevron-up.svg" alt="" />
              : <img src="/assets/icon-chevron-down.svg" alt="" />
          }
        </button>
      </div>
      <div className={classes.wrapper}>
        {
          true ? (Array(20).fill({ name: 'name', price: '10 algo', owner: 'owner', image_url: '/assets/explore-image-2.png' }))
            .filter((_, idx) => viewAll ? true : 10 > idx)
            .map((nft, idx) => (
              <NftCard key={idx} nft={nft}/>
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
    </div>
  )
}

export default SingleNft;