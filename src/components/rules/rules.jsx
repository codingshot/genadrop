import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import Select from '../select/select';
import cx from './rules.module.css';

const Rules = ({ show, setRule }) => {
  const [filteredAttribute, setFilteredAttribute] = useState([])
  const [conflict, setConflict] = useState([])
  const [conflictModel, setConflictModel] = useState({})
  const [collection, setCollection] = useState({})
  const { layers } = useContext(GenContext)

  useEffect(() => {
    const col = {}
    layers.forEach(layer => {
      col[layer.layerTitle] = layer.traits
    })
    console.log(col);
    setCollection(col)
  }, [layers])

  useEffect(() => {
    setFilteredAttribute([])
    setConflict([])
  }, [show])

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
    Object.keys(collection).forEach(key => {
      let layers = filteredAttribute.map(data => data.layer)
      let res = layers.includes(key)
      if (!res) {
        newConflictModel[key] = collection[key]
      }
    })
    setConflictModel(newConflictModel)
  }, [filteredAttribute])

  useEffect(() => {
    let key = Object.keys(conflictModel)
    let newConflict = conflict.filter(data => key.includes(data.layer))
    setConflict(newConflict)
  }, [conflictModel])

  return (
    <div className={`${cx.container} ${show ? cx.active : cx.inactive}`}>
      <div className={cx.rulesContainer}>
        <i onClick={() => setRule(false)} className={`fas fa-times ${cx.cancelBtn}`}></i>
        <div className={cx.title}>Add Conflict Rule</div>
        <div className={cx.filterAttribute}>
          <div className={cx.heading}>Filter Attribute</div>
          <div className={cx.filterSection}>
            <div className={cx.filterContainer}>
              <Select selectionList={collection} select={handleSetAttribute} selected={filteredAttribute} heading={"Select Filter"} />
            </div>
            <div className={cx.filteredList}>
              {
                filteredAttribute.map(f => (
                  <div className={cx.filteredItem} key={f.layer}>
                    <img src={URL.createObjectURL(f.image)} alt="" />
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
                    <img src={URL.createObjectURL(f.image)} alt="" />
                    <span>{`{"${f.layer}" : "${f.attr}}"`}</span>
                    <i onClick={() => handleRemoveConflict(f)} className={`${cx.closeIcon} fas fa-times`}></i>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      <div className={cx.btn}>
        <div>save and add new</div>
        <div>save and close</div>
      </div>
    </div>
  )
}

export default Rules;