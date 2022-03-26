import { useContext, useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { GenContext } from '../../../gen-state/gen.context';
import { getSingleNfts } from '../../../utils';
import NftCard from '../NftCard/NftCard';
import classes from './SingleNft.module.css';

const SingleNft = () => {

  const [state, setState] = useState({
    allSingleNfts: null
  });
  const { allSingleNfts } = state
  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }
  const { singleNfts } = useContext(GenContext);

  const { url } = useRouteMatch();
  const history = useHistory();

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
        <h3>1 of 1s</h3>
        <button onClick={() => history.push(`${url}/single-mint`)}>view all</button>
      </div>
      <div className={classes.wrapper}>
        {
          allSingleNfts ? allSingleNfts
            .map((nft, idx) => (
              <NftCard key={idx} nft={nft} extend='/single-mint' />
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