import CollectionNftCard from "../CollectionNftCard/CollectionNftCard";
import classes from "./AllNfts.module.css";
import { useState, useContext, useEffect } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import SingleNftCard from "../SingleNftCard/SingleNftCard";
import { useHistory } from "react-router-dom";

const AllNfts = () => {
  const history = useHistory();
  const [state, setState] = useState({
    activeType: "T1",
    activeCategory: "All",
    collections: [],
    singles: [],
    _new: [],
  });

  const { activeType, activeCategory, collections, singles, _new } = state;
  const {
    auroraCollections,
    algoCollections,
    polygonCollections,
    celoCollections,
    singleAlgoNfts,
    singleAuroraNfts,
    singlePolygonNfts,
    singleCeloNfts,
  } = useContext(GenContext);

  const singleAlgoNftsArr = Object.values(singleAlgoNfts);
  const algoCollectionsArr = Object.values(algoCollections);

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const categories = ["All", "Painting", "Shorts", "Photography", "Illustration", "3D"];

  const shuffle = (array) => {
    for (let i = 0; i < 100; i += 1) {
      for (let x = array.length - 1; x > 0; x -= 1) {
        const j = Math.floor(Math.random() * (x + 1));
        [array[x], array[j]] = [array[j], array[x]];
      }
    }
    return array;
  };

  const handleMore = () => {
    console.log(" clicked ");
    if (activeType === "T2") {
      history.push("/marketplace/1of1");
    } else if (activeType === "T3") {
      history.push("/marketplace/collections");
    }
  };

  useEffect(() => {
    let collections = [...auroraCollections, ...algoCollectionsArr, ...polygonCollections, ...celoCollections];
    collections = shuffle(collections);
    handleSetState({ collections: collections.slice(0, 16) });
  }, [auroraCollections, algoCollections, polygonCollections, celoCollections]);

  useEffect(() => {
    let singles = [...singleAlgoNftsArr, ...singleAuroraNfts, ...singlePolygonNfts, ...singleCeloNfts];
    singles = shuffle(singles);
    handleSetState({ singles: singles.slice(0, 16) });
    console.log({ single: singles[0] });
  }, [singleAlgoNfts, singleAuroraNfts, singleCeloNfts, singlePolygonNfts]);

  useEffect(() => {
    let _new = [...collections, ...singles];
    _new = shuffle(_new);
    _new = _new.sort((a, b) => {
      if (!a.createdAt || !b.createAt) return a - b; // this code line is because 1of1 nfts do not yet have createAt properties
      if (typeof a.createdAt === "object") {
        return a.createdAt.seconds - b.createdAt.seconds;
      }
      return a.createdAt - b.createdAt;
    });
    handleSetState({ _new: _new.slice(0, 16) });
  }, [singles, collections]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.types}>
          <div
            onClick={() => handleSetState({ activeType: "T1" })}
            className={`${classes.type}  ${activeType === "T1" && classes.active}`}
          >
            New
          </div>
          <div
            onClick={() => handleSetState({ activeType: "T2" })}
            className={`${classes.type}  ${activeType === "T2" && classes.active}`}
          >
            1 of 1s
          </div>
          <div
            onClick={() => handleSetState({ activeType: "T3" })}
            className={`${classes.type}  ${activeType === "T3" && classes.active}`}
          >
            Top Collections
          </div>
        </div>
        <section className={classes.filter}>
          <div className={classes.categories}>
            {categories.map((category, idx) => (
              <div
                onClick={() => handleSetState({ activeCategory: category })}
                key={idx}
                className={`${classes.category} ${activeCategory === category && classes.active}`}
              >
                {category}
              </div>
            ))}
          </div>
          <div className={classes.chain}>chains</div>
        </section>
        <section className={classes.nfts}>
          {activeType === "T1"
            ? _new.map((el, idx) =>
                !el.nfts ? <SingleNftCard key={idx} nft={el} /> : <CollectionNftCard key={idx} collection={el} />
              )
            : activeType === "T2"
            ? singles.map((nft, idx) => <SingleNftCard key={idx} nft={nft} />)
            : activeType === "T3"
            ? collections.map((collection, idx) => <CollectionNftCard key={idx} collection={collection} />)
            : null}
        </section>
        <div className={classes.btnContainer}>
          {activeType !== "T1" ? (
            <div onClick={handleMore} className={classes.btn}>
              See More
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AllNfts;
