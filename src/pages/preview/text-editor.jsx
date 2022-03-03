import { useState } from "react";
import classes from './text-editor.module.css'

const TextEditor = ({ placeholder, submitHandler, invert }) => {
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
    <div className={`${classes.container} ${invert && classes.invert}`}>
      {
        editor
          ?
          <form onSubmit={handleSubmit}>
            <input autoFocus type="text" value={value} onChange={e => handleSetState({ value: e.target.value })} />
            <button>
            <img src="/assets/icon-mark.svg" alt="" />
            </button>
          </form>
          :
          <div>
            <p>{placeholder}</p>
            <button type="button" onClick={() => handleSetState({ editor: true, value: placeholder })}>
              <img src="/assets/icon-edit.svg" alt="" />
            </button>
          </div>
      }
    </div>
  )
}

export default TextEditor;