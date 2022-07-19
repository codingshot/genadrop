import React, { useState } from "react";
import classes from "./Dropdown.module.css";
import { ReactComponent as DropdownIcon } from "../../../assets/icon-dropdown.svg";
import { ReactComponent as AttributeFilterIcon } from "../../../assets/icon-attribute-filter.svg";

const Dropdown = ({ children, title }) => {
  const [dropdown, toggleDropdown] = useState(false);

  return (
    <div className={classes.container}>
      <div onClick={() => toggleDropdown(!dropdown)} className={classes.heading}>
        <div className={classes.textWrapper}>
          <AttributeFilterIcon alt="" />
          <div>{title}</div>
        </div>
        <DropdownIcon className={`${classes.dropdownIcon} ${dropdown && classes.active}`} alt="" />
      </div>
      <div className={`${classes.content} ${dropdown && classes.active}`}>{children}</div>
    </div>
  );
};

export default Dropdown;
