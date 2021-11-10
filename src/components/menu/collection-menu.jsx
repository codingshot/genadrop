import classes from './collection-menu.module.css';
import ArtCard from '../art-card/art-card';
import { useRef, useContext, useEffect, useState } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { addImage, setCombinations } from '../../gen-state/gen.actions';

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

  useEffect(() => {
    const amtArr = layers.map(layer => layer.traitsAmount);
    const amt = amtArr.reduce((acc, curr) => (
      acc * curr
    ), 1)

    dispatch(setCombinations(amt))
  }, [layers])

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
        <button onClick={handleUpload} className={classes.uploadBtn}>upload</button>
      </section>

      <input onChange={handleFileChange} ref={fileRef} style={{ display: "none" }} type="file" name="avatar" id="avatar" accept="image/png" multiple />
    </div>
  )
}

export default CollectionMenu;


