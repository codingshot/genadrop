import classes from './styles.module.css';

const Header = ({ collection }) => {

  const { name, owner, price, imageUrl, numberOfNfts, description } = collection;

  return (
    <header className={classes.header}>
      {
        imageUrl ? <img className={classes.imageContainer} src={imageUrl} alt="asset" /> : <div className={classes.imageLoadingContainer}></div>
      }
      <div className={classes.collectionName}>{name}</div>
      <div className={classes.creator}>created by {owner && `${owner.substring(0, 5)}...${owner.substring(owner.length - 4, owner.length)}`}</div>
      <div className={classes.details}>
        <div> {numberOfNfts} <br /> total nfts</div>
        <div>1 <br /> owner</div>
        <div> {price} <br /> floor price</div>
      </div>
      <div className={classes.description}>
        {description || 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae mollitia libero qui totam, laboriosam dolor nisi porro natus harum dolores excepturi architecto commodi ipsam saepe, animi, magnam expedita veniam? Quidem.'}
      </div>
    </header>
  )
}

export default Header