import React from "react";
import classes from './footer.module.css';

const Footer = () => {
  return (
    <div className={classes.container}>
      <a href="https://minorityprogrammers.com/" target="_blank" rel="noreferrer noopener">
        Built by Minority Programmers Association &#x2764; 
      </a>
    </div>
  )
}

export default Footer;