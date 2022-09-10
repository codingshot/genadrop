import React, { useState } from "react";
import classes from "./Dropdown.module.css";
import dropdownIcon from "../../../assets/icon-dropdown.svg";
import attributeFilterIcon from "../../../assets/icon-attribute-filter.svg";

const Dropdown = ({ children, title, isAttribute }) => {
  const [dropdown, toggleDropdown] = useState(false);

  return (
    <div className={`${isAttribute && classes.borders} && ${classes.container}`}>
      <div onClick={() => toggleDropdown(!dropdown)} className={classes.heading}>
        <div className={classes.textWrapper}>
          {isAttribute ? <img src={attributeFilterIcon} alt="" /> : ""} <div>{title}</div>
        </div>
        <img className={`${classes.dropdownIcon} ${dropdown && classes.active}`} src={dropdownIcon} alt="" />
      </div>
      <div className={`${classes.content} ${dropdown && classes.active}`}>{children}</div>
    </div>
  );
};

export default Dropdown;
