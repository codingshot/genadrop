import React from 'react';
import classes from './footer.module.css';
import logo from '../../assets/genadrop-logo.svg';
import twitterIcon from '../../assets/icon-twitter.svg';
import discordIcon from '../../assets/icon-discord.svg';
import linkedInIcon from '../../assets/icon-linkedin.svg';
import youTubeIcon from '../../assets/icon-youtube.svg';

const footerLinks = [
  {
    id: '1',
    title: 'App',
    content: [
      { name: 'Create', link: '/create', id: '1' },
      { name: 'Mint', link: '/mint', id: '2' },
      { name: 'Marketplace', link: '/marketplace', id: '3' },
    ],
  },
  {
    id: '2',
    title: 'Quick Links',
    content: [
      { name: 'DAO', link: 'https://snapshot.org/#/minorityprogrammers.eth', id: '1' },
      { name: 'MPA', link: 'https://www.minorityprogrammers.org', id: '2' },
      { name: 'HERDrop', link: 'https://www.herdrop.com', id: '3' },
    ],
  },
  {
    id: '3',
    title: 'Support',
    content: [
      { name: 'Docs', link: 'https://doc.clickup.com/4659940/d/4e6q4-2087/gena-drop-docs', id: '1' },
      { name: 'Contact Us', link: 'https://linktr.ee/MinorityProgrammers', id: '2' },
    ],
  },
];

const Footer = () => (
  <div className={classes.container}>
    <div className={classes.top}>
      <div className={classes.wrapper}>
        <div className={classes.topLeft}>
          <a href="/">
            <img src={logo} alt="" />
          </a>
          <div className={classes.socialIcons}>
            <a
              className={classes.icon}
              target="_blank"
              href="https://discord.gg/4vdtmQqz6d"
              rel="noreferrer"
            >
              <img src={discordIcon} alt="" />
            </a>

            <a
              className={classes.icon}
              href="https://twitter.com/minorityprogram"
            >
              <img src={twitterIcon} alt="" />
            </a>

            <a
              className={classes.icon}
              href="https://linkedin.com/company/minority-programmers/"
            >
              <img src={linkedInIcon} alt="" />
            </a>

            <a
              className={classes.icon}
              href="https://youtube.com/c/minorityprogrammers"
            >
              <img src={youTubeIcon} alt="" />
            </a>
          </div>
        </div>
        <div className={classes.topRight}>
          {footerLinks.map((link) => (
            <div key={link.id} className={classes.links}>
              <div className={classes.title}>{link.title}</div>
              {link.content.map((linkE) => (
                <a href={linkE.link} target="_blank" key={linkE.id} rel="noreferrer">
                  {linkE.name}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className={classes.bottom}>
      <div className={classes.wrapper}>
        <a
          href="https://www.minorityprogrammers.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={classes.build}>
            Built with
            <span>&#x2764;</span>
            {' '}
            by the Minority Programmers Association
          </div>
        </a>
        <div className={classes.bottomRight}>
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Use</a>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
