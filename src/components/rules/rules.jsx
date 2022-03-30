import { useState, useContext, useEffect } from 'react';
import { setConflictRule } from '../../gen-state/gen.actions';
import { GenContext } from '../../gen-state/gen.context';
import Select from '../select/select';
import cx from './rules.module.css';

const Rules = ({ show, setRule }) => {
  const [filteredAttribute, setFilteredAttribute] = useState([]);
  const [conflict, setConflict] = useState([]);
  const [conflictModel, setConflictModel] = useState({});
  const [collection, setCollection] = useState({});
  const { layers, dispatch } = useContext(GenContext);

  useEffect(() => {
    const col = {};
    layers.forEach((layer) => {
      col[layer.layerTitle] = layer.traits;
    });
    setCollection(col);
  }, [layers]);

  const handleSetAttribute = (data) => {
    const isUnique = filteredAttribute.find((d) => d.layer === data.layer);
    if (isUnique) {
      const newFiltered = filteredAttribute.map((d) => (d.layer === data.layer ? data : d));
      setFilteredAttribute(newFiltered);
    } else {
      setFilteredAttribute([...filteredAttribute, data]);
    }
  };

  const handleRemoveAttribute = (data) => {
    const newFiltered = filteredAttribute.filter((d) => d.layer !== data.layer);
    setFilteredAttribute(newFiltered);
  };

  const handleSetConflict = (data) => {
    const isUnique = conflict.find((d) => d.layer === data.layer);
    if (isUnique) {
      const newFiltered = conflict.map((d) => (d.layer === data.layer ? data : d));
      setConflict(newFiltered);
    } else {
      setConflict([...conflict, data]);
    }
  };

  const handleRemoveConflict = (data) => {
    const newFiltered = conflict.filter((d) => d.layer !== data.layer);
    setConflict(newFiltered);
  };

  const handleClose = () => {
    setFilteredAttribute([]);
    setConflict([]);
    setRule(false);
  };

  const handleSaveRule = () => {
    dispatch(setConflictRule({ filteredAttribute, conflict }));
    setFilteredAttribute([]);
    setConflict([]);
  };

  useEffect(() => {
    const newConflictModel = {};
    Object.keys(collection).forEach((key) => {
      const layers = filteredAttribute.map((data) => data.layer);
      const res = layers.includes(key);
      if (!res) {
        newConflictModel[key] = collection[key];
      }
    });
    setConflictModel(newConflictModel);
  }, [filteredAttribute]);

  useEffect(() => {
    const key = Object.keys(conflictModel);
    const newConflict = conflict.filter((data) => key.includes(data.layer));
    setConflict(newConflict);
  }, [conflictModel]);

  return (
    <div className={`${cx.container} ${show ? cx.active : cx.inactive}`}>
      <div className={cx.rulesContainer}>
        <i onClick={handleClose} className={`fas fa-times ${cx.cancelBtn}`} />
        <div className={cx.title}>Add Conflict Rule</div>
        <div className={cx.filterAttribute}>
          <div className={cx.heading}>Filter Attribute</div>
          <div className={cx.filterSection}>
            <div className={cx.filterContainer}>
              <Select selectionList={collection} select={handleSetAttribute} selected={filteredAttribute} heading="Select Filter" />
            </div>
            <div className={cx.filteredList}>
              {
                filteredAttribute.map((f) => (
                  <div key={f.layer} className={cx.filteredItem}>
                    <img src={URL.createObjectURL(f.image)} alt="" />
                    <span>{`{"${f.layer}" : "${f.attr}}"`}</span>
                    <i onClick={() => handleRemoveAttribute(f)} className={`${cx.closeIcon} fas fa-times`} />
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
              <Select selectionList={conflictModel} select={handleSetConflict} selected={conflict} heading="Select Conflict" />
            </div>
            <div className={cx.filteredList}>
              {
                conflict.map((f) => (
                  <div key={f.layer} className={cx.filteredItem}>
                    <img src={URL.createObjectURL(f.image)} alt="" />
                    <span>{`{"${f.layer}" : "${f.attr}}"`}</span>
                    <i onClick={() => handleRemoveConflict(f)} className={`${cx.closeIcon} fas fa-times`} />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      <div className={cx.btn}>
        <div onClick={handleSaveRule}>save</div>
        <div onClick={handleClose}>close</div>
      </div>
    </div>
  );
};

export default Rules;
