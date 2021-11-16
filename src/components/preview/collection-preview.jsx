import classes from './collection-preview.module.css';
import { useEffect, useRef, useContext } from 'react';
import { GenContext } from '../../gen-state/gen.context';

const CollectionPreview = () => {
  const { layers, preview } = useContext(GenContext);
  const canvasRef = useRef(null);

  useEffect(() => {

    const handleImage = async () => {
      const canvas = canvasRef.current;
      canvas.setAttribute("width", "250px");
      canvas.setAttribute("height", "250px");
      const ctx = canvas.getContext("2d");
      const newPreview = [];
      const newLayers = [...layers];

      newLayers.reverse().forEach(({ layerTitle: name, traits }) => {
        traits.forEach(({traitTitle, image}) => {
          preview.forEach(({ layerTitle, imageName }) => {
            if (name === layerTitle && traitTitle === imageName) {
              newPreview.push(image)
            }
          })
        })
      })

      for (let img of newPreview) {
        const image = await new Promise(resolve => {
          const image = new Image();
          image.src = URL.createObjectURL(img);
          image.onload = () => {
            resolve(image);
          };
        });

        image && ctx.drawImage(image, 0, 0, 250, 250);
      };
    };

    handleImage();

  }, [preview, layers])
 
  return (
    <div className={classes.container}>
      <canvas className={classes.canvas} ref={canvasRef}></canvas>
    </div>
  )
}

export default CollectionPreview;