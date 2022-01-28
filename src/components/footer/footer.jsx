import classes from './footer.module.css'

const Footer = () => {

  return (
    <div className={classes.container}>
      <div className={classes.leftFrame}>
        <a href="/">
          <img src="/assets/genadrop-logo.png" alt="" />
        </a>
        <p>
          GenaDrop Is the no-code solution for artists to create, mint,
          and sell generative art across multiple blockchains,
          built with <span>&#x2764;</span> by the Minority Programmers Association
        </p>
      </div>
      <div className={classes.centerFrame}>
        <h3>quick links</h3>
        <a href="https://snapshot.org/#/minorityprogrammers.eth">
          <p>DAO</p>
        </a>
        <a href="https://www.minorityprogrammers.org/">
          <p>MPA</p>
        </a>

        <a href="https://www.minoritynft.com/">
          <p>MinorityNFT</p>
        </a>

        <a href="https://linktr.ee/MinorityProgrammers">
          <p>Minority Link Tree</p>
        </a>

      </div>
      <div className={classes.rightFrame}>
        <h3>Join the community</h3>
        <div className={classes.socialIcons}>
          <div className={classes.icon}>
            <a href="https://discord.gg/4vdtmQqz6d">
              <img src="/assets/icon-discord.svg" alt="" />
            </a>
          </div>

          <div className={classes.icon}>
            <a href="https://linkedin.com/company/minority-programmers/">
              <img src="/assets/icon-linkedin.svg" alt="" />
            </a>
          </div>

          <div className={classes.icon}>
            <a href="https://youtube.com/c/minorityprogrammers">
              <img src="/assets/icon-youtube.svg" alt="" />
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Footer
