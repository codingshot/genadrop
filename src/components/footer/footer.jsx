import classes from './footer.module.css';
import logo from "../../assets/genadrop-logo.svg";
import twitterIcon from "../../assets/icon-twitter.svg";
import discordIcon from "../../assets/icon-discord.svg";
import linkedInIcon from "../../assets/icon-linkedin.svg";
import youTubeIcon from "../../assets/icon-youtube.svg";

const footerLinks = [
  {
    "title": "App",
    "content": [
      { "name": "Create", "link": "/create" },
      { "name": "Mint", "link": "/mint" },
      { "name": "Marketplace", "link": "/marketplace" }
    ]
  },
  {
    "title": "Quick Links",
    "content": [
      { "name": "DAO", "link": "https://snapshot.org/#/minorityprogrammers.eth" },
      { "name": "MPA", "link": "https://www.minorityprogrammers.org" },
      { "name": "HERDrop", "link": "https://www.herdrop.com" }
    ]
  },
  {
    "title": "Support",
    "content": [
      { "name": "Docs", "link": "https://doc.clickup.com/4659940/d/4e6q4-2087/gena-drop-docs" },
      { "name": "Contact Us", "link": "https://linktr.ee/MinorityProgrammers" },
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
              <img src={logo} alt="" />
            </a>
            <div className={classes.socialIcons}>
              <a className={classes.icon} href="https://discord.gg/4vdtmQqz6d" target="_blank" rel="noopener noreferrer">
                <img src={discordIcon} alt="Minority Programmers Discord" />
              </a>

              <a className={classes.icon} href="https://twitter.com/minorityprogram" target="_blank" rel="noopener noreferrer">
                <img src={twitterIcon} alt="Minority Programmers Twitter" />
              </a>

              <a className={classes.icon} href="https://linkedin.com/company/minority-programmers/" target="_blank" rel="noopener noreferrer">
                <img src={linkedInIcon} alt="Minoirty Programmers LinkedIn" />
              </a>

              <a className={classes.icon} href="https://youtube.com/c/minorityprogrammers" target="_blank" rel="noopener noreferrer">
                <img src={youTubeIcon} alt="Minority Programmers Youtube" />
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
                      <a href={link.link} key={idx} target="_blank" rel="noopener noreferrer">{link.name}</a>
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
          <a href="https://www.minorityprogrammers.com/" target="_blank" rel="noopener noreferrer">
          <div className={classes.build}>Built with <span>&#x2764;</span> by the Minority Programmers Association</div>
          </a>
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
