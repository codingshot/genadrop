import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import classes from "./searchBar.module.css";

const SearchBar = ({ onSearch }) => {
  const location = useLocation();
  const [state, setState] = useState({
    searchValue: "",
  });

  const { searchValue } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  useEffect(() => {
    const { search } = location;
    const name = new URLSearchParams(search).get("search");
    if (name) {
      handleSetState({ searchValue: name });
    }
  }, []);

  const seachHandler = (event) => {
    onSearch(event.target.value);
    handleSetState({ searchValue: event.target.value });
  };

  return (
    <input
      className={classes.searchInput}
      type="search"
      onChange={seachHandler}
      value={searchValue}
      placeholder="search"
    />
  );
};

export default SearchBar;
