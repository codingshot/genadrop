import Skeleton from 'react-loading-skeleton';
import NftCard from '../../NftCard/NftCard';
import classes from './styles.module.css';

const NFTDisplay = ({ NFTCollection }) => {

  return (
    <div className={classes.menu}>
      {
        NFTCollection ?
          NFTCollection.map((nft, idx) => (
            <NftCard key={idx} nft={nft} index={idx} />
          ))
          :
          <div className={classes.loadingContainer}>
            {
              (Array(8).fill(null)).map((_, idx) => (
                <div key={idx} >
                  <Skeleton count={1} height={200} />
                  <br />
                  <Skeleton count={1} height={40} />
                </div>
              ))
            }
          </div>
      }
    </div>
  )
}

export default NFTDisplay;