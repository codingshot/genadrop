import { useRef } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { setClipboard } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from './clipboard.module.css';

const Clipboard = () => {
  const [state, setState] = useState({
    toggleClipboard: false,
    clipboardState: 'copy'
  })
  const { toggleClipboard, clipboardState } = state;
  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }
  const clipboardRef = useRef(null);

  const { feedback, clipboardMessage, loaderMessage, dispatch } = useContext(GenContext);

  const handleCopy = props => {
    const { navigator, clipboard } = props;
    clipboard.select();
    clipboard.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(clipboard.value);
    handleSetState({ clipboardState: 'copied' })
    setTimeout(() => {
      handleSetState({ clipboardState: 'copy' })
    }, 650);
  }

  const handleDiscard = () => {
    handleSetState({ toggleClipboard: false })
    dispatch(setClipboard(''))
  }

  useEffect(() => {
    if (!clipboardMessage) return;
    console.log(clipboardMessage);
    handleSetState({ toggleClipboard: true });
  }, [clipboardMessage])

  return (
    <div style={{ top: feedback && loaderMessage ? '12em' : loaderMessage ? '7em' : feedback ? '10em' : '4em' }} className={`${classes.container} ${toggleClipboard && classes.active}`}>
      <img className={classes.icon} onClick={handleDiscard} src="/assets/icon-close.svg" alt="" />
      <div className={classes.message}>
        {clipboardMessage} with some few testing messages and more to see how it can overflow and copy
      </div>
      <div className={classes.copy} onClick={() => handleCopy({ navigator, clipboard: clipboardRef.current })}>{clipboardState}</div>
      <input style={{ display: 'none' }} ref={clipboardRef} type="text" defaultValue={clipboardMessage} />
    </div>
  )
}

export default Clipboard;