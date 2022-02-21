import LayerOrders from '../../components/layerorders/layerorders';
import CollectionDescription from '../../components/description/collection-description';
import CollectionOverview from '../../components/overview/collection-overview';
import classes from './create.module.css';
import CreatePageUseGuide from '../../components/use-guide/createUseGuide';
import { useState } from 'react';

const Create = () => {
  const [toggleGuide, setGuide] = useState(true);

  return (
    <div className={classes.container}>
      <img onClick={() => setGuide(true)} className={`${classes.icon} ${!toggleGuide && classes.active}`} src="/assets/icon-help.svg" alt='' />
      <CreatePageUseGuide toggleGuide={toggleGuide} setGuide={setGuide} />
      <div className={classes.layer_overview}>
        <LayerOrders />
        <CollectionOverview />
      </div>
      <CollectionDescription />
    </div>
  )
}

export default Create;