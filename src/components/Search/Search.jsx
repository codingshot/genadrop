import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import supportedChains from "../../utils/supportedChains";
import { handleSuggestions } from "./Search-script";
import classes from "./Search.module.css";
import searchIcon from "../../assets/icon-search.svg";

const Search = () => {
  const history = useHistory();
  const { searchContainer } = useContext(GenContext);
  const [state, setState] = useState({
    value: "",
    suggestions: null,
    toggleSearch: false,
    ignoreSearch: false,
  });

  const { value, toggleSearch, ignoreSearch, suggestions } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleChange = (e) => {
    handleSetState({ value: e.target.value });
    handleSuggestions({ handleSetState, searchContainer, value: e.target.value });
  };

  const handleToggleSearch = () => {
    handleSetState({ toggleSearch: true });
  };

  const handleCloseSearch = () => {
    if (ignoreSearch) return;
    handleSetState({ value: "", suggestions: null, toggleSearch: false });
  };

  const handleSearch = (searchType) => {
    handleSetState({ value: "", suggestions: null, toggleSearch: false });
    history.push(`/marketplace/${searchType}${`?search=${value}`}`);
  };

  return (
    <div className={`${classes.container} ${toggleSearch && classes.active}`}>
      <div onClick={handleToggleSearch} className={classes.placeholder}>
        <img src={searchIcon} alt="" />
        <input type="text" placeholder="Search collections, and 1 of 1s" />
      </div>
      <div onClick={handleCloseSearch} className={classes.dropdownContainer}>
        <div
          onMouseOut={() => handleSetState({ ignoreSearch: false })}
          onMouseOver={() => handleSetState({ ignoreSearch: true })}
          className={classes.dropdown}
        >
          {toggleSearch && (
            <div className={classes.searchContainer}>
              <input
                onChange={handleChange}
                value={value}
                autoFocus
                type="text"
                placeholder="Search collections, and 1 of 1s"
              />
              <div className={classes.hint}>
                {!suggestions
                  ? "No results"
                  : suggestions.length
                  ? `Showing ${suggestions.length} results`
                  : "No results"}
              </div>
            </div>
          )}
          <div className={classes.suggestions}>
            {suggestions && suggestions.length ? (
              suggestions.map(({ imageUrl, type, name, description, chainId }, idx) => (
                <div onClick={() => handleSearch(type)} key={idx} className={classes.suggestion}>
                  <img className={classes.image} src={imageUrl} alt="" />
                  <div className={classes.content}>
                    <div className={classes.name}>{name}</div>
                    <div className={classes.description}>{description}</div>
                    <div className={classes.type_m}>{type}</div>
                  </div>
                  <div className={classes.type}>{type}</div>
                  <img className={classes.chain} src={supportedChains[chainId].icon} alt="" />
                </div>
              ))
            ) : suggestions ? (
              <div>Couldn’t find any results.</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
