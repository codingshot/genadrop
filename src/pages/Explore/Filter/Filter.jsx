import React, { useEffect, useState } from "react";
import classes from "./Filter.module.css";
import arrowIconLeft from "../../../assets/icon-arrow-left.svg";
import arrowIconRight from "../../../assets/icon-arrow-right.svg";
import filterIcon from "../../../assets/icon-filter.svg";
import dropdownIcon from "../../../assets/icon-dropdown.svg";
import Dropdown from "../Dropdown/Dropdown";

const Filter = ({ attributes, handleFilter, filterToDelete }) => {
  const [state, setState] = useState({
    toggleFilter: true,
    toggleAttribute: true,
    toggleLayer: -1,
    lowestPrice: "0",
    highestPrice: "0",
    filter: {
      priceRange: { min: 0, max: 0 },
      onlyListed: false,
      attributes: [],
    },
  });

  const { toggleFilter, lowestPrice, highestPrice, toggleAttribute, toggleLayer, filter } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  const capitalize = (arr) => arr.charAt(0).toUpperCase() + arr.slice(1); // Capitalize first letter of the word
  const toPercent = (count, total) => (count >= 0 && total > 0 ? ((100 * count) / total).toFixed(1) : "NaN");

  const handleApplyPriceFilter = () => {
    handleSetState({
      filter: {
        ...filter,
        priceRange: { min: lowestPrice, max: highestPrice },
      },
    });
  };

  const handleStatus = () => {
    handleSetState({ filter: { ...filter, onlyListed: !filter.onlyListed } });
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

  useEffect(() => {
    handleFilter(filter);
  }, [filter]);

  useEffect(() => {
    if (Array.isArray(filterToDelete) && !filterToDelete.length) {
      handleSetState({ filter: { ...filter, attributes: [] } });
    } else {
      const strVal = JSON.stringify(filterToDelete);
      const newAttributes = filter.attributes.filter((attr) => JSON.stringify(attr) !== strVal);
      handleSetState({ filter: { ...filter, attributes: newAttributes } });
    }
  }, [filterToDelete]);

  return (
    <>
      {toggleFilter ? (
        <aside className={classes.sidebar}>
          <div onClick={() => handleSetState({ toggleFilter: !toggleFilter })} className={classes.filterHeading}>
            <div>
              <img src={filterIcon} alt="" />
              <span>Filter</span>
            </div>
            <img src={arrowIconLeft} alt="" />
          </div>
          <div className={classes.sideOverflowWrapper}>
            <Dropdown title="Status">
              <div className={classes.statusFilter}>
                <span>Show only listed item</span>
                <div
                  onClick={handleStatus}
                  className={`${classes.toggleButton} ${filter.onlyListed && classes.active}`}
                >
                  <div className={classes.toggle} />
                </div>
              </div>
            </Dropdown>
            <Dropdown title="Price">
              <div className={classes.priceFilter}>
                <div className={classes.filterInput}>
                  <div>
                    <input
                      value={lowestPrice}
                      onChange={(event) => handleSetState({ lowestPrice: event.target.value })}
                      type="number"
                    />
                  </div>
                  to
                  <div>
                    <input
                      value={highestPrice}
                      onChange={(event) => handleSetState({ highestPrice: event.target.value })}
                      type="number"
                    />
                  </div>
                </div>
                <button onClick={handleApplyPriceFilter}>Apply</button>
              </div>
            </Dropdown>
            <Dropdown title="Attribute">
              <div className={classes.attributeFilter}>
                <div className={`${classes.attribute} ${toggleAttribute && classes.active}`}>
                  {attributes &&
                    attributes.map((attr, idx) => (
                      <div key={idx}>
                        <div
                          onClick={() =>
                            handleSetState({
                              toggleLayer: idx === toggleLayer ? -1 : idx,
                            })
                          }
                          key={idx}
                          className={classes.layerWrapper}
                        >
                          <div>{capitalize(attr.trait_type)}</div>
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
                              <span className={classes.statusIcon}>
                                {isSelected({
                                  trait_type: attr.trait_type,
                                  value: val,
                                  rarity: attr.rarity[idx],
                                })
                                  ? "+"
                                  : "-"}
                              </span>
                              {/* percentage of each value in an attribute */}
                              <div className={classes.valuesOfAttr}>
                                <span>{capitalize(val)}</span>
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
          <img onClick={() => handleSetState({ toggleFilter: !toggleFilter })} src={arrowIconRight} alt="" />
        </aside>
      )}
    </>
  );
};

export default Filter;
