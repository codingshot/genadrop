import classes from "./collections.module.css";
import bannerImg from "../../assets/explore-banner2.svg";
import { ReactComponent as SearchIcon } from "../../assets/icon-search.svg";
import CollectionNftCard from "../../components/Marketplace/CollectionNftCard/CollectionNftCard";
import { useContext, useEffect, useState } from "react";
import { GenContext } from "../../gen-state/gen.context";

const Collections = () => {
  const { auroraCollections, algoCollections, polygonCollections, celoCollections } = useContext(GenContext);
  const algoCollectionsArr = Object.values(algoCollections);

  const [state, setState] = useState({
    collections: [],
  });

  const { collections } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const shuffle = (array) => {
    for (let i = 0; i < 100; i += 1) {
      for (let x = array.length - 1; x > 0; x -= 1) {
        const j = Math.floor(Math.random() * (x + 1));
        [array[x], array[j]] = [array[j], array[x]];
      }
    }
    return array;
  };

  useEffect(() => {
    let collections = [...auroraCollections, ...algoCollectionsArr, ...polygonCollections, ...celoCollections];
    collections = shuffle(collections);
    handleSetState({ collections });
  }, [auroraCollections, algoCollections, polygonCollections, celoCollections]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <div style={{ backgroundImage: `url(${bannerImg})` }} className={classes.heading}>
        <div className={classes.title}>
          <h1>Collections</h1>
          <p>View all listed Collections {"(21,000 Listed)"}</p>
        </div>
        <div className={classes.searchAndFilter}>
          <div className={classes.search}>
            <SearchIcon />
            <div className={classes.placeholder}>Search By collections ,1 of 1s or Users</div>
          </div>
          <div className={classes.chain}>Chains</div>
          <div className={classes.filter}>Filters</div>
        </div>
        <div className={classes.dateFilter}>
          <div className={classes.date}>24 Hours</div>
          <div className={classes.date}>7 Days</div>
          <div className={classes.date}>30 Days</div>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.nfts}>
          {collections.length
            ? collections.map((collection, idx) => <CollectionNftCard key={idx} collection={collection} />)
            : null}
        </div>
      </div>
    </div>
  );
};

export default Collections;
