import { useHistory, useRouteMatch } from 'react-router-dom';
import classes from './collectionsCard.module.css';

const CollectionsCard = ({ collection }) => {
  const { name, price, description, owner, number_of_nfts, image_url } = collection;
  const history = useHistory();
  const match = useRouteMatch();

  return (
    <div onClick={() => history.push(`/marketplace/collections/${name}`)} className={classes.card}>
      <div style={{backgroundImage: `url(${image_url})`}} className={classes.imageContainer} />
      <div className={classes.body}>
        <div className={classes.thumbnail}>
          <img src={image_url} alt="" />
        </div>
        <div className={classes.name}>{name}</div>
        <div className={classes.description}>
          {description}
        </div>
        <div className={classes.wrapper}>
          <div className={classes.floorPrice}>
            <div className={classes.floor}>FLOORPRICE</div>
            <div className={classes.price}>{price} <span className={classes.chain}>Algo</span></div>
          </div>
          <div className={classes.nOfNfts}>{number_of_nfts} NFTs</div>
        </div>
      </div>
    </div>
  )
}

export default CollectionsCard;