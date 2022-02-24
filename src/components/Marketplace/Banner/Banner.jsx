import classes from './styles.module.css'
import { useHistory } from 'react-router-dom'
import banner from "../../../assets/marketplace-banner.png";

const Banner = () => {
  const history = useHistory()

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.bannerText}>
          <h4 className={classes.heading}>
            Discover, <br />
            Create & Sell Your <br />
            Awesome <span>Nfts</span>
          </h4>
          <p className={classes.description}>
            The first NFT marketplace that enables creators to create their generative NFTs and embed licenses when they mint NFTs. Creators know what they are selling, collectors know what they are buying.
          </p>
          <div className={classes.pageLinks}>
            <button onClick={() => history.push('./mint/single-nft')}>Mint</button>
            <button onClick={() => history.push('./create')}>Create</button>
          </div>
        </div>
        <div className={classes.imageContainer}>
          <img src={banner} alt='' />
        </div>
      </div>
    </div>
  )
}

export default Banner