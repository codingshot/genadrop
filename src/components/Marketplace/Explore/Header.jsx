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
        <div> {owner && 1} <br /> owner</div>
        <div> {price} <br /> floor price</div>
      </div>
      <div className={classes.description}>
        {description || "Your childhood memories brought back in one piece of art! 1753 living memories inside the Solana Blockchain."}
      </div>
    </header>
  )
}

export default Header