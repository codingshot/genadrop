import React from "react";
import { Link } from "react-router-dom";
import classes from "./Docs.module.css";
import booksImage from "../../../assets/books.svg";
import linkIcon from "../../../assets/icon-link2.svg";

const Docs = () => {
  return (
    <div className={classes.container}>
      <img src={booksImage} alt="" />
      <p>
        Not sure yet how <br /> to <span>use GenaDrop</span>?
      </p>
      <Link to="/docs">
        <button type="button">
          <img src={linkIcon} alt="" /> <span>Read the Docs</span>
        </button>
      </Link>
    </div>
  );
};

export default Docs;
