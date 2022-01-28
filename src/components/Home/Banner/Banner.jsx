import classes from './styles.module.css'
import { useHistory } from 'react-router-dom'

const Banner = () => {
  const history = useHistory()
  
  return (
    <div className={classes.container}>
      <div className={classes.bannerText}>
        <h4 className={classes.heading}>
          The no code NFT generative, <br />
          art creator tool & minter <br />
        </h4>
        <p className={classes.description}>
          Generate all combinations from your art assets, preview and edit meta data, upload to ipfs, mint, and list to multiple blockchains with NO CODE.          </p>
        <button onClick={()=> history.push('./create')}>Generate Collection</button>
      </div>
      <img src='/assets/home-banner-image.svg' alt='' />
    </div>
  )
}

export default Banner