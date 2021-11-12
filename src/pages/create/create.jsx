import LayerOrders from '../../components/layerorders/layerorders';
import CollectionDescription from '../../components/description/collection-description';
import CollectionOverview from '../../components/overview/collection-overview';
import classes from './create.module.css';
import { GenContext } from "../../gen-state/gen.context";
import { useContext } from 'react';

const Create = () => {
  const { isLoading } = useContext(GenContext);

  return (
    <div className={classes.container}>
      <div className={`${classes.overlay} ${isLoading && classes.isLoading}`}>
        <i className="fas fa-spinner"></i>
      </div>

      <div className={classes.layer_overview}>
        <LayerOrders />
        <CollectionOverview />
      </div>
      <CollectionDescription />
    </div>
  )
}

export default Create;