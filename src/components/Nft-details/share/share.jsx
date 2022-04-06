import React, { useEffect, useRef, useState } from "react";
import classes from "./share.module.css";

const Share = () => {
  const [state, setState] = useState({
    showShare: false,
    showSocial: false,
  });

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
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
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  // const icons = [
  //   {
  //     icon: 'assets/icon-instagram.png',
  //     link: 'www.facebook.com/mpa',
  //   },
  //   {
  //     icon: 'assets/icon-instagram.png',
  //     link: 'www.insta.com/mpa',
  //   },
  //   {
  //     icon: 'assets/icon-instagram.png',
  //     link: 'www.facebook.com/mpa',
  //   },
  // ];

  // const { showSocial, showShare } = state;
  // const [text, setText] = useState('');
  // const [isCopied, setIsCopied] = useState(false);

  // const handleHide = (payload) => {
  //   setTimeout(() => {
  //     handleSetState(payload);
  //   }, 1000);
  // };
  // const onCopyText = () => {
  //   setIsCopied(true);
  //   setTimeout(() => {
  //     setIsCopied(false);
  //   }, 1000);
  // };
  return <div className={classes.container} />;
};

export default Share;
