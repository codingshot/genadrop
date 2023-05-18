/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from "react";
import classes from "./Filter.module.css";
import arrowIconLeft from "../../../assets/icon-arrow-left.svg";
import arrowIconRight from "../../../assets/icon-arrow-right.svg";
import filterIcon from "../../../assets/icon-filter.svg";
import dropdownIcon from "../../../assets/icon-dropdown.svg";
import Dropdown from "../Dropdown/Dropdown";
import RadioButton from "../Radio-Button/RadioButton";
import { ReactComponent as MarkIcon } from "../../../assets/icon-mark.svg";

const Filter = ({ attributes, handleFilter, filterToDelete, toggleFilter, handleExploreSetState }) => {
  const [state, setState] = useState({
    toggleAttribute: true,
    toggleLayer: -1,
    filter: {
      status: "not listed",
      sortby: "newest",
      attributes: [],
    },
  });

  const { toggleAttribute, toggleLayer, filter } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const countOccurrences = (arr, val) => arr?.reduce((a, v) => (v === val ? a + 1 : a), 0);
  const capitalize = (arr) => arr?.charAt(0)?.toUpperCase() + arr?.slice(1); // Capitalize first letter of the word
  const toPercent = (count, total) => (count >= 0 && total > 0 ? ((100 * count) / total).toFixed(1) : "NaN");

  const handleStatus = (status) => {
    handleSetState({ filter: { ...filter, status } });
  };

  const handleSort = (sort) => {
    handleSetState({ filter: { ...filter, sortby: sort } });
  };

  const handleToggleLayer = (idx) => {
    handleSetState({
      toggleLayer: idx === toggleLayer ? -1 : idx,
    });
  };

  const handleAddToFilterAttribute = (val) => {
    const strAttributes = JSON.stringify(filter.attributes);
    const strVal = JSON.stringify(val);
    if (!strAttributes.includes(strVal)) {
      handleSetState({
        filter: { ...filter, attributes: [...filter.attributes, val] },
      });
    }
  };

  const isSelected = (val) => {
    const res = filter.attributes.find((attr) => JSON.stringify(attr) === JSON.stringify(val));
    return !!res;
  };

  const handleFilterAttribute = (val) => {
    const result = isSelected(val);
    if (result) {
      const strVal = JSON.stringify(val);
      const newAttributes = filter.attributes.filter((attr) => JSON.stringify(attr) !== strVal);
      handleSetState({ filter: { ...filter, attributes: newAttributes } });
    } else {
      handleAddToFilterAttribute(val);
    }
  };

  const statusFilter = ["listed", "not listed", "on auction"];
  const sortFilter = ["newest", "oldest", "highest price", "lowest price", "a - z", "z - a"];

  useEffect(() => {
    if (Array.isArray(filterToDelete) && !filterToDelete.length) {
      handleSetState({ filter: { ...filter, attributes: [] } });
    } else {
      const strVal = JSON.stringify(filterToDelete);
      const newAttributes = filter.attributes.filter((attr) => JSON.stringify(attr) !== strVal);
      handleSetState({ filter: { ...filter, attributes: newAttributes } });
    }
  }, [filterToDelete]);

  useEffect(() => {
    handleFilter(filter);
  }, [filter]);

  return (
    <>
      {toggleFilter ? (
        <aside className={classes.sidebar}>
          <div onClick={() => handleExploreSetState({ toggleFilter: !toggleFilter })} className={classes.filterHeading}>
            <div>
              <img src={filterIcon} alt="" />
              <span>Filter</span>
            </div>
            <img className={classes.leftArrow} src={arrowIconLeft} alt="" />
          </div>
          <div className={classes.sideOverflowWrapper}>
            <Dropdown title="Status">
              {statusFilter.map((status, idx) => (
                <div key={idx} className={classes.status}>
                  <RadioButton onClick={() => handleStatus(status)} active={status === filter.status} />
                  <div>{status}</div>
                </div>
              ))}
            </Dropdown>
            <Dropdown title="Sort by">
              {sortFilter.map((sort, idx) => (
                <div key={idx} className={classes.sort}>
                  <RadioButton onClick={() => handleSort(sort)} active={sort === filter.sortby} />
                  <div>{sort}</div>
                </div>
              ))}
            </Dropdown>
            <Dropdown title="Attribute" isAttribute>
              <div className={classes.attributeFilter}>
                <div className={`${classes.attribute} ${toggleAttribute && classes.active}`}>
                  {attributes &&
                    attributes.map((attr, idx) => (
                      <div key={idx}>
                        <div onClick={() => handleToggleLayer(idx)} key={idx} className={classes.layerWrapper}>
                          <div className={classes.attributeName}>{capitalize(attr.trait_type)}</div>
                          <div className={`${classes.layerIcon} ${toggleLayer === idx && classes.active}`}>
                            <div>{attr.value.length}</div>
                            <img src={dropdownIcon} alt="" />
                          </div>
                        </div>

                        <div className={`${classes.layer} ${toggleLayer === idx && classes.active}`}>
                          {attr.value.map((val, idx) => (
                            <div
                              key={idx}
                              onClick={() =>
                                handleFilterAttribute({
                                  trait_type: attr.trait_type,
                                  value: val,
                                  rarity: attr.rarity[idx],
                                })
                              }
                              className={classes.value}
                            >
                              {isSelected({
                                trait_type: attr.trait_type,
                                value: val,
                                rarity: attr.rarity[idx],
                              }) ? (
                                <span className={`${classes.statusIcon} ${classes.active}`}>
                                  <MarkIcon className={classes.markIcon} />
                                </span>
                              ) : (
                                <span className={`${classes.statusIcon}`} />
                              )}
                              <div className={classes.valuesOfAttr}>
                                <span className={classes.attributeValue}>{capitalize(val)}</span>
                                <span>
                                  <span style={{ marginRight: "3px" }}>{countOccurrences(attr.value, val)}</span>(
                                  {toPercent(countOccurrences(attr.value, val), attr.value.length)}
                                  %)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </Dropdown>
          </div>
        </aside>
      ) : (
        <aside className={classes.sidebar2}>
          <img
            onClick={() => handleExploreSetState({ toggleFilter: !toggleFilter })}
            className={classes.rightArrow}
            src={arrowIconRight}
            alt=""
          />
        </aside>
      )}
    </>
  );
};

export default Filter;
