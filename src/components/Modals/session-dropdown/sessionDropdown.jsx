import { useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import classes from "./sessionDropdown.module.css";
import { useHistory } from "react-router-dom";
import { setUpgradePlan } from "../../../gen-state/gen.actions";

const SessionDropdown = ({ dropdown }) => {
  const history = useHistory();
  const { sessions, dispatch, collectionName } = useContext(GenContext);

  const handleUpgrade = () => {
    dispatch(setUpgradePlan(true));
    history.push("/create/session/pricing");
  };

  return (
    <div className={`${classes.container} ${dropdown && classes.active}`}>
      <div className={classes.wrapper}>
        <div className={`${classes.session} ${classes.active}`}>
          <div>session {collectionName}</div>
          <div onClick={handleUpgrade}>Upgrade session</div>
        </div>
        {sessions &&
          sessions.map(({ session }, idx) => (
            <div key={idx} className={classes.session}>
              session {session.collectionName}
            </div>
          ))}
        <div onClick={() => history.push("/create/session/pricing")} className={`${classes.session} ${classes.create}`}>
          create new session
        </div>
      </div>
    </div>
  );
};

export default SessionDropdown;
