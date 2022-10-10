import SearchBar from "../../../components/Marketplace/Search-bar/searchBar.component";
import classes from "../Explore.module.css";
import Filter from "../Filter/Filter";
import Menu from "../Menu/Menu";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { useContext } from "react";

const Items = ({ handleSetState, state, collectionName }) => {
  const {
    toggleFilter,
    collection,
    NFTCollection,
    attributes,
    filter,
    filterToDelete,
    FilteredCollection,
    headerHeight,
    loadedChain,
    activeType,
  } = state;
  const handleFilter = (_filter) => {
    handleSetState({ filter: { ...filter, ..._filter } });
  };

  const { dispatch, mainnet, algoCollections, auroraCollections, polygonCollections, celoCollections } =
    useContext(GenContext);

  return (
    <div className={classes.displayWrapper}>
      <Filter
        handleFilter={handleFilter}
        filterToDelete={filterToDelete}
        attributes={attributes}
        toggleFilter={toggleFilter}
        handleExploreSetState={(prop) => handleSetState({ ...prop })}
      />
      <main className={classes.main}>
        <div className={classes.searchContainer}>
          <SearchBar onSearch={(value) => handleSetState({ filter: { ...filter, searchValue: value } })} />
        </div>

        <div className={classes.filterDisplay}>
          {filter?.attributes &&
            filter.attributes.map((f, idx) => (
              <div key={idx} className={classes.filteredItem}>
                <span>{f.trait_type}</span>:<span>{f.value}</span>
                <CloseIcon onClick={() => handleSetState({ filterToDelete: f })} className={classes.closeIcon} />
              </div>
            ))}
          {filter?.attributes && filter.attributes.length ? (
            <div onClick={() => handleSetState({ filterToDelete: [] })} className={classes.clearFilter}>
              clear all
            </div>
          ) : null}
        </div>
        <Menu
          headerHeight={headerHeight}
          NFTCollection={FilteredCollection}
          loadedChain={loadedChain}
          chain={algoCollections[collectionName.trimEnd()]?.chain}
          toggleFilter={toggleFilter}
        />
      </main>
    </div>
  );
};

export default Items;
