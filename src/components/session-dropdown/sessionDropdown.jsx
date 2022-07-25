import { useContext } from "react";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./sessionDropdown.module.css";
import { useHistory } from "react-router-dom";

const SessionDropdown = ({ dropdown }) => {
  const history = useHistory();
  const { sessions } = useContext(GenContext);

  return (
    <div className={`${classes.container} ${dropdown && classes.active}`}>
      <div className={classes.wrapper}>
        <div className={`${classes.session} ${classes.active}`}>session active</div>
        {sessions &&
          sessions.map((el, idx) => (
            <div key={idx} className={classes.session}>
              session {el}
            </div>
          ))}
        <div onClick={() => history.push("/create/pricing")} className={`${classes.session} ${classes.create}`}>
          create new session
        </div>
      </div>
    </div>
  );
};

export default SessionDropdown;
