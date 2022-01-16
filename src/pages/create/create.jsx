import LayerOrders from '../../components/layerorders/layerorders';
import CollectionDescription from '../../components/description/collection-description';
import CollectionOverview from '../../components/overview/collection-overview';
import classes from './create.module.css';
import { useContext, useState } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { addRule, clearPreview, setConflictRule } from '../../gen-state/gen.actions';
import RulesCard from '../../components/rulesCard/rulesCard.component';
import { isUnique } from './create-script';

const Create = () => {

  const { dispatch, isRule, preview, rule, layers } = useContext(GenContext)
  const [state, setState] = useState({
    showRule: false
  });

  const { showRule } = state;

  const handleSetState = payload => {
    setState(state => ({...state, ...payload}))
  }

  const openRule = () => {
    dispatch(setConflictRule(true))
    dispatch(clearPreview())
    handleSetState({showRule: false})
  }

  const closeRule = () => {
    dispatch(setConflictRule(false))
  }

  const handleRules = () => {
    handleSetState({showRule: !showRule})
  }

  const handleAddRule = () => {
    if (isUnique({rule, preview}) && preview.length) dispatch(addRule([...rule, preview]))
    dispatch(clearPreview())
    closeRule()
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