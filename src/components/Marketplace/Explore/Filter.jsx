import { useEffect } from 'react';
import { useState } from 'react';
import classes from './styles.module.css';

const Filter = ({ attributes, handleFilter, filterToDelete }) => {

  const [state, setState] = useState({
    toggleFilter: true,
    toggleAttribute: true,
    toggleLayer: -1,
    lowestPrice: '0',
    highestPrice: '0',
    filter: {
      price: { min: 0, max: 0 },
      onlyListed: false,
      attributes: []
    }
  })

  const { toggleFilter, lowestPrice, highestPrice, toggleAttribute, toggleLayer, filter } = state;

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const handleApplyPriceFilter = () => {
    handleSetState({ filter: { ...filter, price: { min: lowestPrice, max: highestPrice } } })
  }

  const handleStatus = () => {
    handleSetState({ filter: { ...filter, onlyListed: !filter.onlyListed } })
  }

  const handleAddToFilterAttribute = val => {
    let strAttributes = JSON.stringify(filter.attributes)
    let strVal = JSON.stringify(val)
    if (!strAttributes.includes(strVal)) {
      handleSetState({ filter: { ...filter, attributes: [...filter.attributes, val] } })
    }
  }

  const isSelected = val => {
    let res = filter.attributes.find(attr => JSON.stringify(attr) === JSON.stringify(val))
    return !!res
  }

  useEffect(() => {
    handleFilter(filter)
  }, [filter])

  useEffect(() => {
    let strVal = JSON.stringify(filterToDelete)
    let newAttributes = filter.attributes.filter(attr => JSON.stringify(attr) !== strVal)
    handleSetState({ filter: { ...filter, attributes: newAttributes } })
  }, [filterToDelete])

  return (
    <>
      {
        toggleFilter ?
          <aside className={classes.sidebar}>
            <div onClick={() => handleSetState({ toggleFilter: !toggleFilter })} className={classes.filterHeading}>
              <div>
                <img src="/assets/icon-filter.svg" alt="" />
                <span>Filter</span>
              </div>
              <img src="/assets/icon-arrow-left.svg" alt="" />
            </div>
            <div className={classes.statusFilter}>
              <div className={classes.title}>
                <img src="/assets/icon-status.svg" alt="" />
                <span>Item status</span>
              </div>
              <div className={classes.filter}>
                <span>show only listed item</span>
                <div onClick={handleStatus} className={`${classes.toggleButton} ${filter.onlyListed && classes.active}`}>
                  <div></div>
                </div>
              </div>
            </div>
            <div className={classes.priceFilter}>
              <div className={classes.title}>
                <img src="/assets/icon-price-filter.svg" alt="" />
                <span>Price</span>
              </div>
              <div className={classes.filter}>
                <div className={classes.filterInput}>
                  <div>
                    <label>lowest</label>
                    <input value={lowestPrice} onChange={event => handleSetState({ lowestPrice: event.target.value })} type="number" />
                  </div>
                  <div>
                    <label>highest</label>
                    <input value={highestPrice} onChange={event => handleSetState({ highestPrice: event.target.value })} type="number" />
                  </div>
                  <img src="/assets/icon-eth.svg" alt="" />
                </div>
                <button onClick={handleApplyPriceFilter}>Apply</button>
              </div>
            </div>
            <div className={classes.attributeFilter}>
              <div onClick={() => handleSetState({ toggleAttribute: !toggleAttribute })} className={classes.title}>
                <img src="/assets/icon-attribute-filter.svg" alt="" />
                <span>attribute filter</span>
              </div>
              <div className={`${classes.attribute} ${toggleAttribute && classes.active}`}>
                {
                  attributes && attributes.map((attr, idx) => (
                    <div key={idx}>
                      <div className={classes.layerTitle} onClick={() => handleSetState({ toggleLayer: idx === toggleLayer ? -1 : idx })} key={idx}>{attr.trait_type}</div>
                      <div className={`${classes.layer} ${toggleLayer === idx && classes.active}`}>
                        {
                          attr.value.map((val, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleAddToFilterAttribute({ trait_type: attr.trait_type, value: val })}
                              className={classes.value}
                            >
                              <span>{isSelected({ trait_type: attr.trait_type, value: val }) ? <img src="/assets/icon-mark-dark.svg" alt="" /> : ''}</span>
                              <span>{val}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </aside>
          :
          <aside
            onClick={() => handleSetState({ toggleFilter: !toggleFilter })}
            className={classes.sidebar2}
          >
            <img src="/assets/icon-arrow-right.svg" alt="" />
          </aside>
      }
    </>
  )
}

export default Filter;