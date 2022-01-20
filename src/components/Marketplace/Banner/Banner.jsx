import classes from './styles.module.css'

const bgImage = { backgroundImage: 'url(./assets/Banner-background-image.png)' }

const Banner = () => {
  return (
    <div style={bgImage} className={classes.container}>
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
            <button>Explore</button>
            <button>Create</button>
          </div>
        </div>
        <img src='./assets/banner-image.png' alt='' />
      </div>
    </div>
  )
}

export default Banner