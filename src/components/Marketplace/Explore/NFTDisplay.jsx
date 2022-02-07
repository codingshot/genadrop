import NftCard from '../../NftCard/NftCard';
import classes from './styles.module.css';

const NFTDisplay = () => {
  return (
    <div className={classes.menu}>
    {
      (Array(20).fill({ name: 'name', price: '10 algo', owner: 'owner', image_url: '/assets/explore-image-2.png' }))
        .map((nft, idx) => (
          <NftCard key={idx} nft={nft} />
        ))
    }
  </div>
  )
}

export default NFTDisplay;