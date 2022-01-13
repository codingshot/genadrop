import LayerOrders from '../../components/layerorders/layerorders';
import CollectionDescription from '../../components/description/collection-description';
import CollectionOverview from '../../components/overview/collection-overview';
import classes from './create.module.css';
import { useContext, useState } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { addRule, clearPreview, setConflictRule, clearRule } from '../../gen-state/gen.actions';
import { useEffect } from 'react';
import RulesCard from '../../components/rulesCard/rulesCard.component';
// import Rules from '../../components/rules/rules';

const Create = () => {

  const { dispatch, isRule, preview, rule, layers } = useContext(GenContext)
  const [showRule, toggleRule] = useState(false)

  const openRule = () => {
    dispatch(setConflictRule(true))
    dispatch(clearPreview())
    toggleRule(false)
  }

  const closeRule = () => {
    dispatch(setConflictRule(false))
  }

  const isUnique = () => {
    let prev_str = JSON.stringify(preview);
    for (let r of rule) {
      let _attr_str = JSON.stringify(r);
      if (_attr_str === prev_str) return false;
    }
    return true
  }

  const handleAddRule = () => {
    if (isUnique() && preview.length) dispatch(addRule([...rule, preview]))
    dispatch(clearPreview())
    closeRule()
  }

  const handleRules = () => {
    toggleRule(!showRule)
  }

  return (
    <div className={classes.container}>
      <div className={classes.layer_overview}>
        <LayerOrders />
        <CollectionOverview />
      </div>
      <CollectionDescription />
      {
        layers[0]?.traits.length && (
          <div className={classes.ruleSelectButton}>
            {
              isRule ?
                <>
                  <button onClick={handleAddRule} className={`${classes.ruleBtn}`}>add rule</button>
                  <button onClick={closeRule} className={`${classes.ruleBtn}`}>cancel</button>
                </>
                :
                <>
                  <button onClick={openRule} className={`${classes.ruleBtn}`}>Set conflict rules</button>
                  <div className={classes.rulesContainer}>
                    <button onClick={handleRules} className={`${classes.ruleBtn}`}>rules{' '}{rule.length}</button>
                    {
                      showRule &&
                      <div className={classes.ruleCardWrapper}>
                        <RulesCard />
                      </div>
                    }
                  </div>
                </>
            }
          </div>
        )}
    </div>
  )
}

export default Create;