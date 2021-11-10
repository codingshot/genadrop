import { useContext } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import classes from './mint.module.css';

const Mint = () => {
  const { nftLayers } = useContext(GenContext);
  const images = [];
  nftLayers.forEach(layer => {
    images.push(layer.image)
  })

  return (
    <div className={classes.container}>
      {
        images.length ? images.map((img, idx) => (
          <img key={idx} src={img} alt="" />
        )) : <div>Feature coming soon</div>
      }
    </div>
  )
}

export default Mint