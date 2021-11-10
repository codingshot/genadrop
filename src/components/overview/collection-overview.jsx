import CollectionMenu from '../menu/collection-menu';
import classes from './collection-overview.module.css';
import { useContext } from 'react';
import { GenContext } from '../../gen-state/gen.context';

const CollectionOverview = () => {
  const { layers } = useContext(GenContext);
  console.log(layers.length)

  return (
    <div className={classes.container}>
      {
        layers.length ? layers.map(layer => (
          <CollectionMenu key={layer.id} layer={layer}/>
        ))
        : <div className={classes.fallback}>Add layers To generate art</div>
      }
    </div>
  )
}

export default CollectionOverview;