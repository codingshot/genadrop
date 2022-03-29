import { useEffect, useState } from 'react';
import classes from './searchBar.module.css';

const SearchBar = ({onSearch}) => {
  const [state, setState] = useState({
    searchValue: ''
  });

  const { searchValue } = state;

  const handleSetState = payload => {
    setState(state => ({...state, ...payload}))
  }

  useEffect(()=> {
    onSearch(searchValue)
  },[searchValue])

  return (
    <input
      className={classes.searchInput}
      type="search"
      onChange={event => handleSetState({ searchValue: event.target.value })}
      value={searchValue}
      placeholder='search'
    />
  )
}

export default SearchBar;