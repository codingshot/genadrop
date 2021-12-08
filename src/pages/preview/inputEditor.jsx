import { useState } from "react";
import classes from './inputEditor.module.css';

const InputEditor = ({
  name,
  id,
  editorAction,
  value,
  clickHandler,
  inputIndex,
  inputType
}) => {
  
  const [inputValue, setInputValue] = useState();

  const handleChange = event => {
    setInputValue(event.target.value)
  }

  return (
    <div className={classes.renameInputContainer}>
      <button
        className={classes.renameBtn}
        onClick={() => clickHandler(id, inputValue, inputIndex)}
      >
        {name ? name : value} <i className="fas fa-ellipsis-h"></i>
      </button>
      {
        editorAction.index === inputIndex && editorAction.id === id
          ?
          <form onSubmit={() => clickHandler(id, inputValue, inputIndex)}>
            {inputType === "textarea"
              ?
              <textarea
                className={`${classes.renameInput} ${classes.active}`}
                onChange={handleChange}
                value={inputValue}
                autoFocus
              />
              :
              <input
                className={`${classes.renameInput} ${classes.active}`}
                type="text"
                onChange={handleChange}
                value={inputValue}
                autoFocus
              />
            }

          </form>
          : null
      }
    </div>
  )
}

export default InputEditor