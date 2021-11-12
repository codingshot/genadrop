import { useContext } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import classes from './preview.module.css';
import { useHistory } from 'react-router';

const Preview = () => {
  const history = useHistory();
  const { nftLayers } = useContext(GenContext);
  const images = [];
  nftLayers.forEach(layer => {
    images.push(layer.image)
  })

  return (
    <div className={classes.container}>
      <div onClick={()=> history.goBack()} className={classes.goBackBtn}><i className="fas fa-arrow-left"></i></div>
      <div className={classes.preview}>
        {
          images.length && images.map((img, idx) => (
            <img key={idx} src={img} alt="" />
          ))
        }
      </div>
    </div>
  )
}

export default Preview