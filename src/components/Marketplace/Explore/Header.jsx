import classes from './styles.module.css';

const Header = () => {
  return (
    <header className={classes.header}>
    <div className={classes.imageContainer}>
      <img src="" alt="" />
    </div>
    <div className={classes.collectionName}>name</div>
    <div className={classes.creator}>created by</div>
    <div className={classes.details}>
      <div> 10k <br /> total nfts</div>
      <div>11k <br /> owners</div>
      <div> 0.2 <br /> floor price</div>
    </div>
    <div className={classes.description}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum non, eum vero dolorem autem est cumque. Est tenetur, quaerat et, eius autem culpa itaque explicabo eum accusantium similique odio dolores.
    </div>
  </header>
  )
}

export default Header