import React, { useState, useRef, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import classes from './share.module.css';

const Share = ({ url }) => {

    const path = url;

    const [state, setState] = useState({
        isCopied: false
    })
    const { isCopied } = state;

    const handleSetState = payload => {
        setState(state => ({ ...state, ...payload }))
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    function useOutsideAlerter(ref) {
        useEffect(() => {
            /**
             * Alert if clicked on outside of element
             */
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    handleSetState({ showSocial: false })
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

    const icons = [
        {
            icon: "assets/facebook.svg",
            link: "https://www.facebook.com"
        },
        {
            icon: "assets/instagram.svg",
            link: "https://www.instagram.com"
        },
        {
            icon: "assets/twitter.svg",
            link: "https://www.twitter.com/mpa"
        },

    ]
    // const handleHide = payload => {
    //   setTimeout(() => { handleSetState(payload); }, 1000)
    // }
    const onCopyText = () => {
        handleSetState({ isCopied: true })
        setTimeout(() => {
            handleSetState({ isCopied: false })
        }, 1000);
    };
    return (
        <div ref={wrapperRef} className={classes.share}>

            <div className={classes.copy} >
                <input
                    type="text"
                    value={path}
                    readOnly
                    className={classes.textArea}
                />
                <CopyToClipboard text={path} onCopy={onCopyText}>
                    <div className={classes.copy_area}>
                        {
                            !isCopied ?
                                <img
                                    className={classes.shareicon} src="assets/copy-solid.svg" alt="" />
                                :
                                <img className={classes.shareicon} src="assets/copied.svg" alt="" />
                        }

                    </div>
                </CopyToClipboard>

            </div>
            <div className={classes.shareContent}>
                {icons.map((icon) => {
                    return (
                        <a href={icon.link} target="_blank">
                            < img className={classes.icon} onClick={() => handleSetState({ text: icon.link })} src={icon.icon} alt="" />
                        </a>

                    )
                })}
            </div>
        </div>
    )
}

export default Share;