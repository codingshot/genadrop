import classes from './NftCard.module.css';

const NftCard = ({ nft }) => {

  const { name, price, owner, image_url } = nft;

  return (
    <div className={classes.card}>
      <img src={image_url} alt="" />
      <div className={classes.cardBody}>
        <p className={classes.name}>{name}</p>
        <div className={classes.owner}>
          <img src={image_url} alt="" />
          <span>{owner.substring(0, 5)}...{owner.substring(owner.length - 4, owner.length)}</span>
        </div>
        <div className={classes.divider}></div>
        <div className={classes.price}>{price} Algo</div>
      </div>
    </div>
  )
}

export default NftCard;