import LayerOrders from '../../components/layerorders/layerorders';
import CollectionDescription from '../../components/description/collection-description';
import CollectionOverview from '../../components/overview/collection-overview';
import classes from './create.module.css';
import Rules from '../../components/rules/rules';
import { useState } from 'react';

const Create = () => {
  const [rule, setRule] = useState(false)

  return (
    <div className={classes.container}>
      <div className={`${classes.rulesWrapper} ${rule ? classes.active : classes.inactive}`}>
        <Rules show={rule} setRule={setRule} />
      </div>
      <div className={classes.layer_overview}>
        <LayerOrders />
        <CollectionOverview />
      </div>
      <CollectionDescription />

      <button onClick={() => setRule(true)} className={`${classes.ruleBtn} ${rule && classes.active}`}>Add conflict rule</button>
    </div>
  )
}

export default Create;