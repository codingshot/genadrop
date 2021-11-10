import LayerOrders from '../../components/layerorders/layerorders';
import CollectionDescription from '../../components/description/collection-description';
import CollectionOverview from '../../components/overview/collection-overview';
import classes from './create.module.css';

const Create = () => {
  return (
    <div className={classes.container}>
      <div className={classes.layer_overview}>
        <LayerOrders />
        <CollectionOverview />
      </div>
        <CollectionDescription />
    </div>
  )
}

export default Create;