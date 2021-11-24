import classes from './collection-preview.module.css';
import { useEffect, useRef, useContext } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { getImageSize } from '../utils/getImageSize';

const CollectionPreview = () => {
  const { layers, preview } = useContext(GenContext);
  const canvasRef = useRef(null);
  const newPreview = [];

  useEffect(() => {
    const handleImage = async () => {
      const canvas = canvasRef.current;
      canvas.setAttribute("width", "250px");
      canvas.setAttribute("height", "250px");
      const ctx = canvas.getContext("2d");
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
 
  const handleDownload = async () => {
    const canvas = document.createElement("canvas");
    const { width, height } = await getImageSize(newPreview[0])
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    const ctx = canvas.getContext("2d");
    for (let img of newPreview) {
      const image = await new Promise(resolve => {
        const image = new Image();
        image.src = URL.createObjectURL(img);
        image.onload = () => {
          resolve(image);
        };
      });

      image && ctx.drawImage(image, 0, 0, width, height);
    };
    let image = canvas.toDataURL();  
  
    let link = document.createElement( 'a' );  
    link.download = 'asset.png'; 
    link.href = image;  
  
    document.body.appendChild( link );  
    link.click();  
    document.body.removeChild( link );  
  }

  return (
    <div className={classes.container}>
      <canvas className={classes.canvas} ref={canvasRef}></canvas>
      {preview.length ? <button onClick={handleDownload}>download</button> : null}
    </div>
  )
}

export default CollectionPreview;