import { useState, useContext } from 'react';
import { updateLayer } from '../../gen-state/gen.actions';
import { GenContext } from '../../gen-state/gen.context';
import classes from './layer.module.css';

const Layer = ({ name, trait, click, id, activeInput, setActiveInput }) => {
  const [inputValue, setInputValue] = useState('');
  const { dispatch } = useContext(GenContext);

  const handleRename = () => {
    setActiveInput('')
    if(!inputValue) return
    dispatch(updateLayer({layerTitle: inputValue, id: id}))
  }

  const handleEdit = name => {
    setActiveInput(name)
    setInputValue(name)
  }

  const handleChange = event => {
    setInputValue(event.target.value)
  }

  return (
    <div className={classes.item}>
      <div className={classes._name}>
        <div className={classes.line}>
          <i className="fas fa-arrows-alt-v"></i>
        </div>
        <div onClick={click} className={classes.icon}>
          <i className="far fa-trash-alt"></i>
        </div>
        
        <div className={classes.renameBtn}>
          {activeInput === name
            ?
            <form onSubmit={handleRename}>
              <input
                className={`${classes.renameInput} ${classes.active}`}
                type="text"
                onChange={handleChange}
                value={inputValue}
                autoFocus
              />
            </form>
            :
            <div className={classes.nameHeader}>{name}</div>
          }
          <div className={classes.editBtn} >
            {activeInput === name
              ? <i onClick={handleRename} className="fas fa-minus"></i>
              : <i onClick={()=>handleEdit(name)} className="fas fa-edit"></i>
            }
          </div>
        </div>

      </div>
      <div className={classes.trait}>{trait}</div>
    </div>
  )
}

export default Layer;