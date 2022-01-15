import classes from './collection-preview.module.css';
import { useEffect, useRef, useContext } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { getImageSize } from '../utils';
import ButtonClickEffect from '../button-effect/button-effect';

const CollectionPreview = () => {
  const { layers, preview } = useContext(GenContext);
  const canvasRef = useRef(null);

  const handleImage = async (canvas, width = 250, height = 250) => {
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    const ctx = canvas.getContext("2d");
    const newLayers = [...layers];
    const newPreview = [];
    newLayers.reverse().forEach(({ layerTitle: name, traits }) => {
      traits.forEach(({ traitTitle, image }) => {
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

      image && ctx.drawImage(image, 0, 0, width, height);
    };
  };


  const handleDownload = async () => {
    const { width, height } = await getImageSize(layers[0].traits[0].image)
    const canvas = document.createElement("canvas");
    await handleImage(canvas, width, height)
    let image = canvas.toDataURL();
    let link = document.createElement('a');
    link.download = 'asset.png';
    link.href = image;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    const imageHandler = async () => {
      const canvas = canvasRef.current;
      await handleImage(canvas, 250, 250);
    }
    imageHandler()
  }, [preview, layers])

  return (
    <div className={classes.container}>
      <canvas className={classes.canvas} ref={canvasRef}></canvas>
      {preview.length ?
        <button onClick={handleDownload}>
          <ButtonClickEffect>
            download
          </ButtonClickEffect>
        </button>
        : null}
    </div>
  )
}

export default CollectionPreview;