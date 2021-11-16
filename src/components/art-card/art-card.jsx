import { useContext, useEffect, useState } from 'react';
import { addPreview, removeImage, removePreview, updateImage, updatePreview } from '../../gen-state/gen.actions';
import { GenContext } from '../../gen-state/gen.context';
import classes from './art-card.module.css';

const ArtCard = ({ layerTitle, trait, setActiveCard, activeCard }) => {
  const { dispatch, preview } = useContext(GenContext);

  const [prompt, setPrompt] = useState("");
  const [inputValue, setValue] = useState({ name: trait.traitTitle, rarity: trait.Rarity });
  const [previousValue, setPrevious] = useState("");

  const { name, rarity } = inputValue;

  const { image, traitTitle, Rarity } = trait;

  const handleAdd = () => {
    dispatch(addPreview({ layerTitle, imageName: traitTitle }))
  }

  const handleRemove = () => {
    dispatch(removePreview({ layerTitle, imageName: traitTitle }))
    dispatch(removeImage({ layerTitle, traitTitle }))
  }

  const handleChange = event => {
    const { name, value } = event.target;
    setValue(v => ({ ...v, [name]: value }))
    setPrevious(inputValue.name)
  }

  const handleActive = () => {
    setActiveCard(traitTitle)
  }

  const handleUpdate = () => {
    setPrompt("");
  }

  useEffect(() => {
    preview.forEach(item => {
      if (item["layerTitle"] === layerTitle && item["imageName"] === previousValue) {
        dispatch(updatePreview({ layerTitle, imageName: inputValue.name }))
      }
    })
    dispatch(updateImage({ layerTitle, image, traitTitle: inputValue.name, Rarity: inputValue.rarity }))
  }, [inputValue, dispatch, image, layerTitle, preview, previousValue])

  return (
    <div onClick={handleActive} className={`${classes.container} ${activeCard === traitTitle ? classes.active : classes.inActive}`}>
      <div className={classes.remove}>
        <div onClick={handleRemove}>x</div>
      </div>
      <img onClick={handleAdd} className={classes.image} src={URL.createObjectURL(image)} alt="avatar" />
      <div className={classes.details}>
        <div>
          {
            prompt &&
            <div className={classes.reset} onClick={handleUpdate}>
              <i className="fas fa-chevron-down"></i>
            </div>
          }
        </div>
        <div onClick={() => setPrompt("name")}>
          {
            prompt !== "name" ? traitTitle : <input autoFocus type="text" name="name" value={name} onChange={handleChange} />
          }
        </div>
        <div onClick={() => setPrompt("rarity")}>
          {
            prompt !== "rarity" ? <span>Rarity: {Rarity}</span> : <input autoFocus type="number" min="0" name="rarity" value={rarity} onChange={handleChange} />
          }
        </div>
      </div>
    </div>
  )
}

export default ArtCard;