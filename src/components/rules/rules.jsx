import { useEffect } from 'react';
import { useState } from 'react';
import Select from '../select/select';
import cx from './rules.module.css';

const model = {
  head: ['head-one', 'head-two', 'head-three', 'head-four', 'head-five', 'head-six', 'head-seven'],
  body: ['body-one', 'body-two', 'body-three', 'body-four'],
  eyewear: ['eyewear-one', 'eyewear-two', 'eyewear-three', 'eyewear-four'],
}

const Rules = () => {
  const [filteredAttribute, setFilteredAttribute] = useState([])
  const [conflict, setConflict] = useState([])
  const [conflictModel, setConflictModel] = useState(model)

  const handleSetAttribute = data => {
    let isUnique = filteredAttribute.find(d => d.layer === data.layer);
    if (isUnique) {
      let newFiltered = filteredAttribute.map(d => d.layer === data.layer ? data : d)
      setFilteredAttribute(newFiltered)
    } else {
      setFilteredAttribute([...filteredAttribute, data])
    }
  }

  const handleRemoveAttribute = data => {
    let newFiltered = filteredAttribute.filter(d => d.layer !== data.layer)
    setFilteredAttribute(newFiltered)
  }

  const handleSetConflict = data => {
    let isUnique = conflict.find(d => d.layer === data.layer);
    if (isUnique) {
      let newFiltered = conflict.map(d => d.layer === data.layer ? data : d)
      setConflict(newFiltered)
    } else {
      setConflict([...conflict, data])
    }
  }

  const handleRemoveConflict = data => {
    let newFiltered = conflict.filter(d => d.layer !== data.layer)
    setConflict(newFiltered)
  }

  useEffect(() => {
    let newConflictModel = {};
    filteredAttribute.forEach(attr => {
      let filteredModel = model[attr.layer].filter(m => m !== attr.attr)
      newConflictModel[attr.layer] = filteredModel
    })
    setConflictModel({ ...model, ...newConflictModel })
  }, [filteredAttribute])

  useEffect(() => {
    console.log(conflict);
    console.log(filteredAttribute);
    for (let f of filteredAttribute) {
      let result = conflict.find(c => c.layer === f.layer && c.attr === f.attr)
      console.log(result);
      if (result) {
        let newConflict = conflict.filter(c => c.layer !== result.layer)
        setConflict(newConflict)
        return
      }
    }
  }, [conflictModel])

  return (
    <div className={cx.container}>
      <div className={cx.rulesContainer}>
        <div className={cx.title}>Add Conflict Rule</div>
        <div className={cx.filterAttribute}>
          <div className={cx.heading}>Filter Attribute</div>
          <div className={cx.filterSection}>
            <div className={cx.filterContainer}>
              <Select selectionList={model} select={handleSetAttribute} selected={filteredAttribute} heading={"Select Filter"} />
            </div>
            <div className={cx.filteredList}>
              {
                filteredAttribute.map(f => (
                  <div className={cx.filteredItem} key={f.layer}>
                    <span>{`{"${f.layer}" : "${f.attr}}"`}</span>
                    <i onClick={() => handleRemoveAttribute(f)} className={`${cx.closeIcon} fas fa-times`}></i>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className={cx.addConflict}>
          <div className={cx.heading}>Set Conflict</div>
          <div className={cx.filterSection}>
            <div className={cx.filterContainer}>
              <Select selectionList={conflictModel} select={handleSetConflict} selected={conflict} heading={"Select Conflict"} />
            </div>
            <div className={cx.filteredList}>
              {
                conflict.map(f => (
                  <div className={cx.filteredItem} key={f.layer}>
                    <span>{`{"${f.layer}" : "${f.attr}}"`}</span>
                    <i onClick={() => handleRemoveConflict(f)} className={`${cx.closeIcon} fas fa-times`}></i>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div className={cx.btn}>
        <div>save and add new</div>
        <div>save and close</div>
      </div>

      </div>
    </div>
  )
}

export default Rules;