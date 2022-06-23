import classes from "./Search.module.css";

const Search = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <input type="text" />
        <button>Search</button>
      </div>
    </div>
  );
};

export default Search;
