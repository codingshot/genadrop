/* eslint-disable react/no-array-index-key */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from "react";
import classes from "./DashboardFilterDropdown.module.css";
import dropdownIcon from "../../../assets/icon-caret-down.svg";

const DashboardFilterDropdown = ({ onFilter }) => {
  const [state, setState] = useState({
    togglePriceFilter: false,
    activeFilter: {
      name: "price",
      label: ["low - high", "high - low"],
    },

    filterObj: [
      {
        name: "price",
        label: ["low - high", "high - low"],
      },
      {
        name: "name",
        label: ["a - z", "z - a"],
      },
      {
        name: "date",
        label: ["newest - oldest", "oldest - newest"],
      },
    ],
  });

  const { activeFilter, filterObj, togglePriceFilter } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleFilter = (filterProp) => {
    handleSetState({ activeFilter: filterProp });
    const newFilterObj = filterObj.map((filter) => {
      if (filter.name === filterProp.name) {
        const newLabel = [...filter.label];
        const tmp = newLabel[0];
        newLabel[0] = newLabel[1];
        newLabel[1] = tmp;
        return { name: filter.name, label: newLabel };
      }
      return filter;
    });
    handleSetState({ filterObj: newFilterObj });
    onFilter({ name: filterProp.name, label: filterProp.label[0] });
  };

  useEffect(() => {
    handleFilter(activeFilter);
  }, []);

  return (
    <div onClick={() => handleSetState({ togglePriceFilter: !togglePriceFilter })} className={classes.filterDropdown}>
      <div className={classes.filterHeading}>
        <div>{activeFilter.name}</div>
        <div className={classes.filterDetail}>
          <span>{activeFilter.label[0]}</span>
          <img src={dropdownIcon} alt="" className={`${classes.dropdownIcon} ${togglePriceFilter && classes.active}`} />
        </div>
      </div>
      <div className={`${classes.dropdown} ${togglePriceFilter && classes.active}`}>
        {filterObj.map((filter, idx) => (
          <div key={idx} onClick={() => handleFilter(filter)} className={classes.filter}>
            <div>{filter.name}</div>
            <div>{filter.label[0]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardFilterDropdown;
