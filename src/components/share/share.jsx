import React, { useState, useRef, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import classes from "./share.module.css";
import copiedIcon from "../../assets/copied.svg";
import copyIcon from "../../assets/copy-solid.svg";
import twitterIcon from "../../assets/twitter.svg";
import facebookIcon from "../../assets/facebook.svg";
// import instagramIcon from '../../assets/instagramIcon';

const Share = ({ url }) => {
  const path = url;

  const [state, setState] = useState({
    isCopied: false,
  });
  const { isCopied } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const wrapperRef = useRef(null);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          handleSetState({ showSocial: false });
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(wrapperRef);

  const icons = [
    {
      icon: facebookIcon,
      link: "https://www.facebook.com/MinorityProgrammers",
    },
    // {
    //   icon: instagramIcon,
    //   link: 'https://www.instagram.com/minorityprogrammers/',
    // },
    {
      icon: twitterIcon,
      link: "https://www.twitter.com/minorityprogram",
    },
  ];
  // const handleHide = payload => {
  //   setTimeout(() => { handleSetState(payload); }, 1000)
  // }
  const onCopyText = () => {
    handleSetState({ isCopied: true });
    setTimeout(() => {
      handleSetState({ isCopied: false });
    }, 1000);
  };
  return (
    <div ref={wrapperRef} className={classes.share}>
      <div className={classes.copy}>
        <input type="text" value={path} readOnly className={classes.textArea} />
        <CopyToClipboard text={path} onCopy={onCopyText}>
          <div className={classes.copy_area}>
            {!isCopied ? (
              <img className={classes.shareicon} src={copyIcon} alt="" />
            ) : (
              <img className={classes.shareicon} src={copiedIcon} alt="" />
            )}
          </div>
        </CopyToClipboard>
      </div>
      <div className={classes.shareContent}>
        {icons.map((icon) => (
          <a href={icon.link} target="_blank" rel="noreferrer">
            <img
              className={classes.icon}
              onClick={() => handleSetState({ text: icon.link })}
              src={icon.icon}
              alt="Social Icon"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Share;
