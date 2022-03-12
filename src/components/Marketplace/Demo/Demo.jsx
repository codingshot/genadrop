import classes from './styles.module.css';
import createIcon from "../../../assets/create-icon.png";
import mintIcon from "../../../assets/mint-icon.png";
import walletIcon from "../../../assets/wallet-icon.png";
import listIcon from "../../../assets/list-icon.png";

const Demo = () => {
  return (
    <div className={classes.container}>
      <h3 className={classes.heading}>Create and Sell Your NFTs</h3>
      <div className={classes.wrapper}>
        <div className={classes.videoContainer}>
          <video src="/videos/GenadropMinorityWorldPreview.mp4" controls></video>
        </div>
        <div className={classes.operations}>
          <div className={classes.card}>
            <div className={classes.operation}>
            <img src={createIcon} alt="" />
              <span>create your collection</span>
            </div>
            <div className={classes.description}>Generate and design your collection</div>
          </div>
          <div className={classes.card}>
            <div className={classes.operation}>
              <img src={mintIcon} alt="" />
              <span>Mint your NFTs</span>
            </div>
            <div className={classes.description}>Upload your work (image, video, audio, or 3D art), add a title and description, and customize your NFTs</div>
          </div>
          <div className={classes.card}>
            <div className={classes.operation}>
              <img src={walletIcon} alt="" />
              <span>Set Up your Wallet</span>
            </div>
            <div className={classes.description}>Connect your wallet then mint your NFTs</div>
          </div>
          <div className={classes.card}>
            <div className={classes.operation}>
              <img src={listIcon} alt="" />
              <span>List Them for sale</span>
            </div>
            <div className={classes.description}>Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Demo