import React, { useState } from "react";
import classes from "./Dropdown.module.css";
import dropdownIcon from "../../../assets/icon-dropdown.svg";
import attributeFilterIcon from "../../../assets/icon-attribute-filter.svg";

const Dropdown = ({ children, title }) => {
  const [dropdown, toggleDropdown] = useState(false);

  return (
    <div className={classes.container}>
      <div onClick={() => toggleDropdown(!dropdown)} className={classes.heading}>
        <div className={classes.textWrapper}>
          <img src={attributeFilterIcon} alt="" />
          <div>{title}</div>
        </div>
        <img className={`${classes.dropdownIcon} ${dropdown && classes.active}`} src={dropdownIcon} alt="" />
      </div>
      <div className={`${classes.content} ${dropdown && classes.active}`}>{children}</div>
    </div>
  );
};

export default Dropdown;
