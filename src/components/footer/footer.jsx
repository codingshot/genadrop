import classes from './footer.module.css'

const Footer = () => {

  return (
    <div className={classes.container}>
      <div className={classes.aboutUs}>
        <div className={classes.contacts}>
          <a href="https://linktr.ee/MinorityProgrammers">
            <p>Contacts</p>
          </a>
          <div className={classes.list}>
            <a href="https://discord.gg/4vdtmQqz6d">
              <img src="./assets/icon-discord.svg" alt="" />
            </a>
            <a href="https://linkedin.com/company/minority-programmers/">
              <img src="./assets/icon-linkedin.svg" alt="" />
            </a>
            <a href="https://youtube.com/c/minorityprogrammers">
              <img src="./assets/icon-youtube.svg" alt="" />
            </a>
          </div>
        </div>

        <a href="https://www.minorityprogrammers.com/partner">
          <p>Partner with us</p>
        </a>
        <a href="https://snapshot.org/#/minorityprogrammers.eth">
          <p>DAO</p>
        </a>

      </div>


      <a href="https://minorityprogrammers.com/" target="_blank" rel="noreferrer noopener">
        Built with <span>&#x2764;</span> by Minority Programmers Association
      </a>
    </div>
  )
}

export default Footer