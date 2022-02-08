import classes from './styles.module.css'
import { useHistory } from 'react-router-dom'
const bgImage = { backgroundImage: 'url(/assets/Banner-background-image.png)' }

const Banner = () => {
  const history = useHistory()

  return (
    <div style={bgImage} className={classes.container}>
      {/* <div className={classes.soon}>This page will be available shortly. <br />Thank you!</div> */}
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
          <img src='/assets/banner-image-2.png' alt='' />
          <div className={classes.imageDetails}>
            <div>
              <div>#9212 MinorityNFT</div>
              <span>5.98 ALGO</span>
            </div>
            <div>MinorityNFTCollection</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner