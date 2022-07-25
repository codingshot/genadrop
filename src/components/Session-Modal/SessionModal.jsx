import classes from "./SessionModal.module.css";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { useContext } from "react";
import { GenContext } from "../../gen-state/gen.context";
import { setToggleSessionModal } from "../../gen-state/gen.actions";
import { fetchUserSession } from "../../renderless/store-data/StoreData.script";
import { useHistory } from "react-router-dom";

const SessionModal = () => {
  const history = useHistory();
  const { dispatch, currentUser, toggleSessionModal, sessions } = useContext(GenContext);

  const handleLoad = (sessionId) => {
    console.log("clicked with: ", sessionId);
    fetchUserSession({ currentUser, sessionId, dispatch });
  };

  const handleCreate = () => {
    history.push("/create/pricing");
    handleClose();
  };

  const handleClose = () => {
    dispatch(setToggleSessionModal(false));
  };

  return (
    <div className={`${classes.container} ${toggleSessionModal && classes.active}`}>
      <div className={classes.wrapper}>
        <CloseIcon onClick={handleClose} className={classes.closeBtn} />
        <div className={classes.content}>
          <h1>Sessions</h1>
          <div className={classes.sessionContainer}>
            {sessions &&
              sessions.map((id, idx) => (
                <div key={idx} className={classes.session}>
                  <div className={classes.detail}>
                    <div className={classes.name}>Session name</div>
                    <div className={classes.edited}>Last edited</div>
                  </div>
                  <div className={classes.action}>
                    <div onClick={() => handleLoad(id)} className={classes.loadBtn}>
                      Load
                    </div>
                    <div className={classes.deleteBtn}>Delete</div>
                  </div>
                </div>
              ))}
          </div>
          <button onClick={handleCreate}>New Collection</button>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;
