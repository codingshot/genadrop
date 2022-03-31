import React, { useEffect, useState } from 'react';
import classes from './Filter.module.css';
import arrowIconLeft from '../../../assets/icon-arrow-left.svg';
import arrowIconRight from '../../../assets/icon-arrow-right.svg';
import filterIcon from '../../../assets/icon-filter.svg';
import dropdownIcon from '../../../assets/icon-dropdown.svg';
import Dropdown from '../Dropdown/Dropdown';

const Filter = ({ attributes, handleFilter, filterToDelete }) => {
  const [state, setState] = useState({
    toggleFilter: true,
    toggleAttribute: true,
    toggleLayer: -1,
    lowestPrice: '0',
    highestPrice: '0',
    filter: {
      priceRange: { min: 0, max: 0 },
      onlyListed: false,
      attributes: [],
    },
  });

  const {
    toggleFilter,
    lowestPrice,
    highestPrice,
    toggleAttribute,
    toggleLayer,
    filter,
  } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

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
    let strAttributes = JSON.stringify(filter.attributes);
    let strVal = JSON.stringify(val);
    if (!strAttributes.includes(strVal)) {
      handleSetState({
        filter: { ...filter, attributes: [...filter.attributes, val] },
      });
    }
  };

  const isSelected = (val) => {
    let res = filter.attributes.find(
      (attr) => JSON.stringify(attr) === JSON.stringify(val)
    );
    return !!res;
  };

  const handleFilterAttribute = (val) => {
    let result = isSelected(val);
    if (result) {
      let strVal = JSON.stringify(val);
      let newAttributes = filter.attributes.filter(
        (attr) => JSON.stringify(attr) !== strVal
      );
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
      let strVal = JSON.stringify(filterToDelete);
      let newAttributes = filter.attributes.filter(
        (attr) => JSON.stringify(attr) !== strVal
      );
      handleSetState({ filter: { ...filter, attributes: newAttributes } });
    }
  }, [filterToDelete]);

  return (
    <>
      {toggleFilter ? (
        <aside className={classes.sidebar}>
          <div
            onClick={() => handleSetState({ toggleFilter: !toggleFilter })}
            className={classes.filterHeading}
          >
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
                  className={`${classes.toggleButton} ${
                    filter.onlyListed && classes.active
                  }`}
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
                      onChange={(event) =>
                        handleSetState({ lowestPrice: event.target.value })
                      }
                      type="number"
                    />
                  </div>
                  to
                  <div>
                    <input
                      value={highestPrice}
                      onChange={(event) =>
                        handleSetState({ highestPrice: event.target.value })
                      }
                      type="number"
                    />
                  </div>
                </div>
                <button onClick={handleApplyPriceFilter}>Apply</button>
              </div>
            </Dropdown>
            <Dropdown title="Attribute">
              <div className={classes.attributeFilter}>
                <div
                  className={`${classes.attribute} ${
                    toggleAttribute && classes.active
                  }`}
                >
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
                          <div>{attr.trait_type}</div>
                          <div
                            className={`${classes.layerIcon} ${
                              toggleLayer === idx && classes.active
                            }`}
                          >
                            <div>{attr.value.length}</div>
                            <img src={dropdownIcon} alt="" />
                          </div>
                        </div>
                        <div
                          className={`${classes.layer} ${
                            toggleLayer === idx && classes.active
                          }`}
                        >
                          {attr.value.map((val, idx) => {
                            return (
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
                                    ? '+'
                                    : '-'}
                                </span>
                                <span>{val}</span>
                              </div>
                            );
                          })}
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
            onClick={() => handleSetState({ toggleFilter: !toggleFilter })}
            src={arrowIconRight}
            alt=""
          />
        </aside>
      )}
    </>
  );
};

export default Filter;
