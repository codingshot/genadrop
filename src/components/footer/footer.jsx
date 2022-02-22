import classes from './footer.module.css';

const footerLinks = [
  {
    "title": "Tools",
    "content": [
      { "name": "Create", "link": "/create" },
      { "name": "Mint", "link": "/mint/single-mint" },
      { "name": "Marketplace", "link": "/marketplace" }
    ]
  },
  {
    "title": "Quick Links",
    "content": [
      { "name": "DAO", "link": "https://snapshot.org/#/minorityprogrammers.eth" },
      { "name": "MPA", "link": "https://www.minorityprogrammers.org" },
      { "name": "MinorityNFT", "link": "https://www.minoritynft.com" }
    ]
  },
  {
    "title": "Support",
    "content": [
      { "name": "FAQ", "link": "/" },
      { "name": "Contact Us", "link": "/" },
    ]
  }
]

const Footer = () => {
  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <div className={classes.wrapper}>
          <div className={classes.topLeft}>
            <a href='/'>
              <img src="/assets/genadrop-logo.svg" alt="" />
            </a>
            <div className={classes.socialIcons}>
              <a className={classes.icon} href="https://discord.gg/4vdtmQqz6d">
                <img src="/assets/icon-discord.svg" alt="" />
              </a>

              <a className={classes.icon} href="https://twitter.com/minorityprogram">
                <img src="/assets/icon-twitter.svg" alt="" />
              </a>

              <a className={classes.icon} href="https://linkedin.com/company/minority-programmers/">
                <img src="/assets/icon-linkedin.svg" alt="" />
              </a>

              <a className={classes.icon} href="https://youtube.com/c/minorityprogrammers">
                <img src="/assets/icon-youtube.svg" alt="" />
              </a>
            </div>
          </div>
          <div className={classes.topRight}>
            {
              footerLinks.map((link, idx) => (
                <div key={idx} className={classes.links}>
                  <div className={classes.title}>{link.title}</div>
                  {
                    link.content.map((link, idx) => (
                      <a href={link.link} key={idx}>{link.name}</a>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <div className={classes.bottom}>
        <div className={classes.wrapper}>
          <div className={classes.build}>Built with <span>&#x2764;</span> by the Minority Programmers Association</div>
          <div className={classes.bottomRight}>
            <a href='/'>Privacy Policy</a>
            <a href='/'>Terms of Use</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer;