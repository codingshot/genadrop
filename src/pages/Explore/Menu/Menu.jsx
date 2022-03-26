import Skeleton from 'react-loading-skeleton';
import NftCard from '../../../components/Marketplace/NftCard/NftCard'
import classes from './Menu.module.css';

const Menu = ({ NFTCollection }) => {

  return (
    <div className={classes.menu}>
      {
        NFTCollection ?
          NFTCollection.map((nft, idx) => (
            <div className={classes.nftCardWrapper}>
              <NftCard key={idx} nft={nft} index={idx} />
            </div>
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

export default Menu;