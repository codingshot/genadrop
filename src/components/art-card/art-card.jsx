import { useContext, useState, useEffect } from 'react';
import { addPreview, addRule, clearPreview, removeImage, removePreview, updateImage, updatePreview } from '../../gen-state/gen.actions';
import { GenContext } from '../../gen-state/gen.context';
import classes from './art-card.module.css';

const ArtCard = ({ layerTitle, trait, setActiveCard, activeCard }) => {
  
  const { dispatch, preview, isRule } = useContext(GenContext);

  const [prompt, setPrompt] = useState("");
  const [inputValue, setValue] = useState({ name: trait.traitTitle, rarity: trait.Rarity });
  const [previousValue, setPreviousValue] = useState("");
  const { name, rarity } = inputValue;
  const { image, traitTitle, Rarity } = trait;

  const handleAddPreview = (name, imageFile) => {
    dispatch(addPreview({ layerTitle, imageName: name, imageFile }))
    setActiveCard(traitTitle)
  }

  const handleRemove = () => {
    dispatch(removePreview({ layerTitle, imageName: traitTitle }))
    dispatch(removeImage({ layerTitle, traitTitle }))
  }

  const handleChange = event => {
    const { name, value } = event.target;
    setValue(v => ({ ...v, [name]: value }))
  }

  const handleRename = (e, imageFile) => {
    e.preventDefault()
    setPrompt("");
    preview.forEach(item => {
      if (item["layerTitle"] === layerTitle && item["imageName"] === previousValue) {
        dispatch(updatePreview({ layerTitle, imageName: inputValue.name, imageFile }))
      }
    })
    dispatch(updateImage({ layerTitle, image, traitTitle: inputValue.name, Rarity: inputValue.rarity }))
  }

  const handlePrompt = value => {
    console.log('prompt');
    setPrompt(value);
    setActiveCard(traitTitle)
    setPreviousValue(traitTitle)
  }

  useEffect(() => {
    if (activeCard !== traitTitle) setPrompt("")
  }, [activeCard, traitTitle])

  useEffect(()=> {
    if(!preview.length) setActiveCard('')
  },[preview])

  return (
    <div className={`${classes.container} ${activeCard === traitTitle ? classes.active : classes.inActive}`}>
      <div className={classes.action}>
        {
          isRule ? <i onClick={() => handleAddPreview(traitTitle, image)} className={`fas fa-check-circle ${classes.addRuleBtn}`}></i> : <i/>
        }
        <i onClick={handleRemove} className="fas fa-times"></i>
      </div>
      <div onClick={() => handleAddPreview(traitTitle, image)} className={classes.imageContainer}>
        <img className={classes.image} src={URL.createObjectURL(image)} alt="avatar" />
      </div>
      <div className={classes.details}>
        <div>
          {prompt !== "name"
            ?
            <div className={classes.inputText}><div>{traitTitle}</div> <i onClick={() => handlePrompt("name")} className="fas fa-edit"></i></div>
            :
            <div className={classes.editInput}>
              <form onSubmit={e =>handleRename(e, image)}>
                <input
                  autoFocus type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                />
              </form>
              <i onClick={e =>handleRename(e, image)} className="fas fa-minus"></i>
            </div>
          }
        </div>

        <div>
          {prompt !== "rarity"
            ?
            <div className={classes.inputText}><div>Rarity: {Rarity}</div> <i onClick={() => handlePrompt("rarity")} className="fas fa-edit"></i></div>
            :
            <div className={classes.editInput}>
              <form onSubmit={handleRename}>
                <input
                  autoFocus
                  type="number"
                  min="0"
                  name="rarity"
                  value={rarity}
                  onChange={handleChange}
                />
              </form>
              <i onClick={handleRename} className="fas fa-minus"></i>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ArtCard;