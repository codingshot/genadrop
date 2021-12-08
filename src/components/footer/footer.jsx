import React from "react";
import classes from './footer.module.css';

const Footer = () => {
  return (
    <div className={classes.container}>
      <a href="https://minorityprogrammers.com/" target="_blank" rel="noreferrer noopener">
        Built with &#x2764; by Minority Programmers Association 
      </a>
    </div>
  )
}

export default Footer;