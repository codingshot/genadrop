import classes from './collection-menu.module.css';
import ArtCard from '../art-card/art-card';
import { useRef, useContext, useEffect, useState } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { addImage, setCombinations } from '../../gen-state/gen.actions';
import { getImageSize } from '../utils/getImageSize';
import ButtonClickEffect from '../button-effect/button-effect';

const CollectionMenu = ({ layer: { layerTitle, traits } }) => {

  const { dispatch, layers } = useContext(GenContext);
  const [activeCard, setActiveCard] = useState("");

  const fileRef = useRef(null);

  const handleUpload = () => {
    fileRef.current.click();
  }

  const handleFileChange = event => {
    const { files } = event.target;
    let imageFiles = Object.values(files);
    let uniqueImageFile = [...traits];
    let filterArr = traits.map(({ image }) => image.name);

    imageFiles.forEach(imageFile => {
      if (!filterArr.includes(imageFile.name)) {
        uniqueImageFile.push({ traitTitle: imageFile.name, Rarity: "1", image: imageFile })
        filterArr.push(imageFile.name)
      }
    })

    dispatch(addImage({ layerTitle, traits: uniqueImageFile }))
  }

  // draw empty image
  const canvas = document.createElement("canvas");
  const handleImage = async img => {
    const { height, width } = await getImageSize(img);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    const ctx = canvas.getContext("2d");
    const image = await new Promise(resolve => {
      const image = new Image();
      image.src = "/assets/blank.png";
      image.onload = () => {
        resolve(image);
      };
    });
    image && ctx.drawImage(image, 0, 0, width, height);
  };

  const dataURItoBlob = (dataURI) => {
    let byteString = atob(dataURI.split(',')[1]);
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  const handleAddBlank = async () => {
    await handleImage(traits[0].image)
    const imageUrl = canvas.toDataURL();
    let imageFile = new File([dataURItoBlob(imageUrl)], "blank_image");
    let uniqueImageFile = [...traits];
    let filterArr = traits.map(({ image }) => image.name);
    if (!filterArr.includes(imageFile.name)) {
      uniqueImageFile.push({ traitTitle: imageFile.name, Rarity: "1", image: imageFile })
    }
    dispatch(addImage({ layerTitle, traits: uniqueImageFile }))
  }

  useEffect(() => {
    const amtArr = layers.map(layer => layer.traitsAmount);
    const amt = amtArr.reduce((acc, curr) => (
      acc * curr
    ), 1)

    dispatch(setCombinations(amt))
  }, [layers, dispatch])

  return (
    <div className={classes.container}>
      <section className={classes.layer}>
        <h3 className={classes.header}>{layerTitle}</h3>
        <div className={classes.wrapper}>
          {
            traits.map((trait, index) => (
              <ArtCard
                layerTitle={layerTitle}
                trait={trait} key={index}
                setActiveCard={setActiveCard}
                activeCard={activeCard}
              />
            ))
          }
        </div>
        <div className={classes.uploadBtnContainer}>
          <button onClick={handleUpload} className={classes.uploadBtn}>upload</button>
          {
            traits[0] && (
              <ButtonClickEffect>
                <button onClick={handleAddBlank} className={classes.addBlankBtn}>Add blank image</button>
              </ButtonClickEffect>
            )
          }
        </div>
      </section>

      <input onChange={handleFileChange} ref={fileRef} style={{ display: "none" }} type="file" name="avatar" id="avatar" accept="image/png" multiple />
    </div>
  )
}

export default CollectionMenu;


