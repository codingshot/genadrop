import { useEffect } from 'react';
import { useState } from 'react';
import cx from './select.module.css';

const Select = ({ heading, selectionList, select, selected }) => {

  const [toggle, toggleShow] = useState(false);
  const [inShow, setInShow] = useState(-1);

  const handleClick = id => {
    if (inShow === id) {
      toggleShow(!toggle)
    } else {
      toggleShow(true)
    }
    setInShow(id)
  }

  const getHeight = layer => {
    return selectionList[layer].length * 2.1 + 'em'
  }

  const handleAddAttribute = data => {
    select(data)
  }

  const isSlected = data => {
    let result = JSON.stringify(selected).includes(JSON.stringify(data))
    // console.log(result);
    return result
  }

  return (
    <div className={cx.container}>
      <div className={cx.heading}>{heading}</div>
      <div className={cx.layersContainer}>
        {
          Object.keys(selectionList).map((layer, idx) => (
            <div key={idx} className={cx.layers}>
              <div onClick={() => handleClick(idx)} className={cx.layer}>{layer}</div>
              <div style={{ height: inShow === idx && toggle ? getHeight(layer) : '0' }} className={`${cx.attributes}`}>
                {
                  selectionList[layer].map((attr, idx) => (
                    <div key={idx} onClick={() => handleAddAttribute({ layer, attr })} className={cx.attribute}>
                      <span className={cx.icon}>
                        {
                          isSlected({ layer, attr })
                            ? <i className={`fas fa-times`}></i>
                            : <i className={`fas fa-minus`}></i>
                        }
                      </span>
                      <span>{attr}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Select;