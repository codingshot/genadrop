import { useEffect } from 'react';
import { useState } from 'react';
import cx from './rules.module.css';


const model = {
  head: ['head-one', 'head-two', 'head-three', 'head-four', 'head-five', 'head-six', 'head-seven'],
  body: ['body-one', 'body-two', 'body-three', 'body-four'],
  eyewear: ['eyewear-one', 'eyewear-two', 'eyewear-three', 'eyewear-four'],
}

const Rules = () => {
  const [toggle, toggleShow] = useState(false);
  const [inShow, setInShow] = useState(-1);
  const [filtered, setFiltered] = useState([])

  const handleClick = id => {
    if (inShow === id) {
      toggleShow(!toggle)
    } else {
      toggleShow(true)
    }
    setInShow(id)
  }

  const getHeight = layer => {
    return model[layer].length * 2 + 'em'
  }

  const handleAddAttribute = data => {
    let isUnique = filtered.find(d => d.layer === data.layer);
    if (isUnique) {
      let newFiltered = filtered.map(d => d.layer === data.layer ? data : d)
      setFiltered(newFiltered)
    } else {
      setFiltered([...filtered, data])
    }
  }

  const handleRemoveAttribute = data => {
    console.log(data);
    let newFiltered = filtered.filter(d => d.layer !== data.layer)
    setFiltered(newFiltered)
  }

  useEffect(() => {
    console.log(filtered);
  }, [filtered])

  return (
    <div className={cx.container}>
      <div className={cx.filteredList}>
        {
          filtered.map(f => (
            <div className={cx.filteredItem} key={f.layer}>
              <span>{`{"${f.layer}" : "${f.attr}}"`}</span>
              <i onClick={()=> handleRemoveAttribute(f)} className={`${cx.closeIcon} fas fa-times`}></i>
            </div>
          ))
        }
      </div>
      {
        Object.keys(model).map((layer, idx) => (
          <div key={idx} className={cx.layers}>
            <div onClick={() => handleClick(idx)} className={cx.layer}>{layer}</div>
            <div style={{ height: inShow === idx && toggle ? getHeight(layer) : '0' }} className={`${cx.attributes}`}>
              {
                model[layer].map((attr, idx) => (
                  <div key={idx} onClick={() => handleAddAttribute({ layer, attr })} className={cx.attribute}>{attr}</div>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Rules;