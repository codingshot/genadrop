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
          (Array(8).fill(null)).map((_, idx) => (
            <div className={classes.loader} key={idx} >
              <Skeleton count={1} height={200} />
              <br />
              <Skeleton count={1} height={40} />
            </div>
          ))
      }
    </div>
  )
}

export default NFTDisplay;