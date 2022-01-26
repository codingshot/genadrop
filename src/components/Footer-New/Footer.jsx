import classes from './styles.module.css'
const Footer = () => {
  return (
    <div className={classes.container}>
      <img src="./assets/genadrop-logo.png" alt="" />
      <div className={classes.center}>
        <div>
          <div>My Account</div>
          <div>Profile</div>
          <div>My Collections</div>
          <div>Legal</div>
        </div>
        <div>
          <div>Marketplace</div>
          <div>All NFTs</div>
        </div>
        <div>
          <div>Resources</div>
          <div>Help Center</div>
          <div>Blog</div>
          <div>Newsletter</div>
        </div>
        <div>
          <div>Company</div>
          <div>About</div>
          <div>Carriers</div>
        </div>
      </div>
      <div className={classes.end}>
        <div>Social Media</div>
        <div className={classes.contacts}>
          <img src="./assets/icon-facebook.png" alt="" />
          <img src="./assets/icon-twitter.png" alt="" />
          <img src="./assets/icon-instagram.png" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Footer