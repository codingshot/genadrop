import React, { useContext, useState } from 'react';
import CollectionMenu from '../menu/collection-menu';
import classes from './collection-overview.module.css';
import { GenContext } from '../../gen-state/gen.context';
import {
  addRule,
  clearPreview,
  setConflictRule,
} from '../../gen-state/gen.actions';
import { isUnique } from './collection-overview-script';
import RulesCard from '../rulesCard/rulesCard.component';

const CollectionOverview = () => {
  const { dispatch, isRule, preview, rule, layers } = useContext(GenContext);
  const [state, setState] = useState({
    showRule: false,
  });

  const { showRule } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const openRule = () => {
    dispatch(setConflictRule(true));
    dispatch(clearPreview());
    handleSetState({ showRule: false });
  };

  const closeRule = () => {
    dispatch(setConflictRule(false));
  };

  const handleRules = () => {
    handleSetState({ showRule: !showRule });
  };

  const handleAddRule = () => {
    if (isUnique({ rule, preview }) && preview.length)
      dispatch(addRule([...rule, preview]));
    dispatch(clearPreview());
    closeRule();
  };

  return (
    <div className={classes.container}>
      {layers[0]?.traits.length ? (
        <div className={classes.rules}>
          {isRule ? (
            <>
              <button onClick={handleAddRule} className={classes.addRuleBtn}>
                Add Rule
              </button>
              <button onClick={closeRule} className={classes.showRuleBtn}>
                Cancel <span>0</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={openRule} className={classes.addRuleBtn}>
                Set Conflict
              </button>
              <button onClick={handleRules} className={classes.showRuleBtn}>
                Rules <span>{rule.length}</span>
              </button>
              {showRule && (
                <div className={classes.ruleCardWrapper}>
                  <RulesCard />
                </div>
              )}
            </>
          )}
        </div>
      ) : null}

      {layers.length ? (
        layers.map((layer) => <CollectionMenu key={layer.id} layer={layer} />)
      ) : (
        <div className={classes.fallback}>Add layers To generate art</div>
      )}
    </div>
  );
};

export default CollectionOverview;
