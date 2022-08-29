import React, { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import supportedChains from "../../utils/supportedChains";
import handleSuggestions from "./Search-script";
import classes from "./Search.module.css";

const Search = () => {
  const history = useHistory();
  const location = useLocation();
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

  const hanldeAllResults = (keyword = value) => {
    const params = new URLSearchParams({
      keyword,
    });
    history.replace({ pathname: "/search", search: params.toString() });
    handleSetState({ toggleSearch: false });
  };
  const hanldeSeachChange = (e) => {
    handleChange(e);
    hanldeAllResults(e.target.value);
  };

  function getHighlightedText(text, highlight) {
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts.map((part, i) => (
          <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { background: "#FEDA03B0" } : {}}>
            {part}
          </span>
        ))}{" "}
      </span>
    );
  }
  return (
    <div className={`${classes.container} ${toggleSearch && classes.active}`}>
      {location.pathname === "/search" ? (
        <div className={classes.placeholder}>
          <input onChange={hanldeSeachChange} type="text" value={value} placeholder="Search collections, and 1 of 1s" />
        </div>
      ) : (
        <div onClick={handleToggleSearch} className={classes.placeholder}>
          <input type="text" value={value} placeholder="Search collections, and 1 of 1s" />
        </div>
      )}
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
                <div className={classes.result}>
                  {!suggestions
                    ? "No results"
                    : suggestions.length
                    ? `Showing ${suggestions.length} results `
                    : "No results"}
                </div>
                {suggestions?.length && (
                  <div className={classes.showAll} onClick={() => hanldeAllResults()}>
                    <div /> Show All results{" "}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={classes.suggestions}>
            {suggestions && suggestions.length ? (
              suggestions.map(({ image_url, type, name, description, chain }, idx) => (
                <div onClick={() => handleSearch(type)} key={idx} className={classes.suggestion}>
                  <img className={classes.image} src={image_url} alt="" />
                  <div className={classes.content}>
                    <div className={classes.name}>{getHighlightedText(name, value)}</div>
                    <div className={classes.description}>{getHighlightedText(description, value)}</div>
                    <div className={classes.type_m}>{type}</div>
                  </div>
                  <div className={classes.type}>{type}</div>
                  <img className={classes.chain} src={supportedChains[chain]?.icon} alt="" />
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
