import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import classes from './searchBar.module.css';

const SearchBar = ({ onSearch }) => {
  const history = useHistory();
  const location = useLocation();

  const [state, setState] = useState({
    searchValue: '',
  });

  const { searchValue } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  useEffect(() => {
    const { search } = location;
    const name = new URLSearchParams(search).get('search');
    if (name) {
      onSearch(name);
      console.log(name);
      handleSetState({ searchValue: name });
    }
  }, []);
  useEffect(() => {
    onSearch(searchValue);
  }, [searchValue]);

  const seachHandler = (event) => {
    const params = new URLSearchParams({ search: event.target.value });
    history.replace({ pathname: location.pathname, search: params.toString() });
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
