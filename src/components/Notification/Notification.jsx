import { useEffect, useRef, useContext, useState } from 'react';
import { setFeedback } from '../../gen-state/gen.actions';
import { GenContext } from '../../gen-state/gen.context';
import classes from './Notification.module.css';

const Notification = () => {
  const feedbackRef = useRef(null);
  const { feedback, loaderMessage, dispatch } = useContext(GenContext);
  const [state, setState] = useState({
    toggleFeedback: false
  });
  const { toggleFeedback } = state;
  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  useEffect(() => {
    if (!feedback) return;
    handleSetState({ toggleFeedback: true })
    setTimeout(() => {
      handleSetState({ toggleFeedback: false })
    }, 5000);
  }, [feedback]);

  useEffect(() => {
    feedbackRef.current.onanimationend = e => {
      if (e.animationName.includes('slide-out')) {
        dispatch(setFeedback(''))
      }
    }
  }, [])



  return (
    <div style={{top: loaderMessage ? '7em' : '4em'}} className={`${classes.container} ${toggleFeedback && classes.active}`}>
      <div ref={feedbackRef} className={classes.feedback}>
        <div className={classes.icon}></div>
        <div className={classes.message}>{feedback}</div>
      </div>
    </div>
  );
}

export default Notification;