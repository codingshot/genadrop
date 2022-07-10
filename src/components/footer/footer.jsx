import React from "react";
import classes from "./footer.module.css";
import logo from "../../assets/genadrop-logo-light.svg";
import { footerLinks, orgs, socialLinks } from "./footer-script";

const Footer = () => (
  <div id="hide-footer">
    <div className={classes.container}>
      <div className={classes.top}>
        <div className={classes.wrapper}>
          <div className={classes.topLeft}>
            <a href="/">
              <img src={logo} alt="" />
            </a>
            <div className={classes.socialIcons}>
              {socialLinks.map((social, idx) => (
                <a key={idx} className={classes.icon} href={social.link} target="_blank" rel="noopener noreferrer">
                  <img src={social.icon} alt={`Minority Programmers ${social.name}`} />
                </a>
              ))}
            </div>
          </div>
          <div className={classes.topRight}>
            {footerLinks.map((link) => (
              <div key={link.id} className={classes.links}>
                <div className={classes.title}>{link.title}</div>
                {link.content.map((linkE) => (
                  <a href={linkE.link} key={linkE.id}>
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
          <div>
            <div>This Project is in Public Beta</div>
            <div className={classes.termsAndPolicy}>
              2022 Genadrop |
              <a
                href="https://docs.google.com/document/d/16tRGt3sCIauMNDCwq5A99zYUxwU8S5bpGhI0eaJzwAw/edit?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy |
              </a>
              <a
                href="https://docs.google.com/document/d/1Ofbw5j9l3MnOFSa2cALcnJJI6iQz86SdiNmQAp1f6AE/edit?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                Terms of Use |
              </a>
              <div className={classes.orgs}>
                Powered by
                {orgs.map((org) => (
                  <a href={org.link} target="_blank" rel="noopener noreferrer">
                    <img key={org.name} src={org.icon} alt="" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a
            className={classes.build}
            href="https://www.minorityprogrammers.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built with ❤️ by the Minority Programmers Association
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
