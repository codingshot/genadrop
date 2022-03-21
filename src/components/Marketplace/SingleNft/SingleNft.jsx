import { useContext, useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { GenContext } from '../../../gen-state/gen.context';
import { getSingleNfts } from '../../../utils';
import NftCard from '../NftCard/NftCard';
import classes from './SingleNft.module.css';
import chevronDownIcon from '../../../assets/icon-chevron-down.svg';
import chevronUpIcon from '../../../assets/icon-chevron-up.svg';
import blank from '../../../assets/blank.png';

const SingleNft = () => {
  const [state, setState] = useState({
    viewAll: false,
    allSingleNfts: null
  });
  const { viewAll, allSingleNfts } = state
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
  }, [singleNfts])

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>Newest NFTs</h3>
        <button onClick={() => handleSetState({ viewAll: !viewAll })}>
          view all {
            viewAll
              ? <img src={chevronUpIcon} alt="" />
              : <img src={chevronDownIcon} alt="" />
          }
        </button>
      </div>
      <div className={classes.wrapper}>
        {
          allSingleNfts ? allSingleNfts
            .filter((_, idx) => viewAll ? true : 10 > idx)
            .map((nft, idx) => (
              <NftCard key={idx} nft={nft} extend='/nft' />
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
  )
}

export default SingleNft;