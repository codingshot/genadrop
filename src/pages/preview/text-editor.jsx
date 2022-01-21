import { useState } from "react";
import classes from './text-editor.module.css'

const TextEditor = ({ placeholder, submitHandler }) => {

  const [state, setState] = useState({
    value: '',
    editor: false
  })

  const { value, editor } = state;

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const handleSubmit = e => {
    e.preventDefault();
    submitHandler(value)
    handleSetState({ editor: false, value: '' })
  }

  return (
    <div className={classes.container}>
      {
        editor
          ?
          <form onSubmit={handleSubmit}>
            <input autoFocus type="text" value={value} onChange={e => handleSetState({ value: e.target.value })} />
            <button>
              <i className="fas fa-minus"></i>
            </button>
          </form>
          :
          <div>
            <p>{placeholder}</p>
            <button type="button" onClick={() => handleSetState({ editor: true })}>
              <i className="fas fa-pen"></i>
            </button>
          </div>
      }
    </div>
  )
}

export default TextEditor;