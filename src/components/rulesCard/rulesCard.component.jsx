import React, { useContext, useEffect } from "react";
import { clearRule, deleteRule, promptDeleteRules, setPrompt } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./rulesCard.module.css";
import closeIcon from "../../assets/icon-close.svg";
import leftArrow from "../../assets/icon-arrow-left-long.svg";

const RulesCard = ({ showRule }) => {
  const { dispatch, rule, promptRules } = useContext(GenContext);

  const handleClearRule = () => {
    dispatch(setPrompt(promptDeleteRules({})));
  };

  const handleDelete = (deletRule) => {
    dispatch(deleteRule(deletRule));
  };

  useEffect(() => {
    if (promptRules) {
      dispatch(clearRule());
      showRule(false);
      dispatch(promptDeleteRules(null));
    }
  }, [promptRules]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        {rule.map((rl, idx) => (
          <div key={idx} className={classes.conflictCard}>
            <div className={classes.content}>
              {rl.map((r, idx) => (
                <div key={idx} className={classes.innerContent}>
                  <img className={classes.image} src={URL.createObjectURL(r.imageFile)} alt="" />
                  <div className={classes.description}>
                    <div className={classes.title}>{r.layerTitle}</div>
                    <div className={classes.text}>{r.imageName}</div>
                  </div>
                </div>
              ))}
            </div>
            <div onClick={() => handleDelete(rl)} className={classes.deleteRule}>
              Delete Rule
            </div>
          </div>
        ))}
      </div>
      {true ? (
        <div className={classes.btnContainer}>
          <button type="button" onClick={() => showRule(false)} className={classes.closeBtn}>
            <img src={leftArrow} alt="" />
            Go back
          </button>
          <button type="button" onClick={handleClearRule} className={classes.deleteBtn}>
            Delete all rules
          </button>
        </div>
      ) : (
        <div className={classes.notification}>you have not set any rule</div>
      )}
    </div>
  );
};

export default RulesCard;
