import React, { useEffect, useState, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useLocation } from "react-router-dom";
import classes from "./collections.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import CollectionsCard from "../../components/Marketplace/collectionsCard/collectionsCard";
import { GenContext } from "../../gen-state/gen.context";
import bannerImg from "../../assets/explore-banner2.svg";
import NotFound from "../../components/not-found/notFound";
import PriceDropdown from "../../components/Marketplace/Price-dropdown/priceDropdown";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import Search from "../../components/Search/Search";
import leftArrowIcon from "../../assets/icon-left-arrow.svg";
import rightArrowIcon from "../../assets/icon-right-arrow.svg";
import NftCard from "../../components/Marketplace/NftCard/NftCard";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";

const Collections = ({ len }) => {
  const { auroraCollections, algoCollections, polygonCollections, celoCollections, chainId } = useContext(GenContext);
  const algoCollectionsArr = algoCollections ? Object.values(algoCollections) : [];

  const location = useLocation();
  const history = useHistory();

  const [state, setState] = useState({
    filteredCollection: [],
    celoCollection: null,
    nearCollection: null,
    allChains: null,
    filter: {
      searchValue: "",
      price: "low",
      chain: "All Chains",
    },
    selected: "24h",
    page1: 1,
    page2: 2,
    page3: 3,
    activePage: 1,
    last: 0,
    numNfts: 0,
    inputPage: 0,
  });

  const {
    celoCollection,
    nearCollection,
    filter,
    filteredCollection,
    selected,
    activePage,
    page1,
    page2,
    page3,
    last,
    numNfts,
    inputPage,
  } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const getCollectionByChain = (network = filter.chain) => {
    switch (network.toLowerCase().replace(/ /g, "")) {
      case "allchains":
        return !algoCollectionsArr && !polygonCollections && !celoCollections && !nearCollection && !auroraCollections
          ? null
          : [
              ...(algoCollectionsArr || []),
              ...(polygonCollections || []),
              // ...(celoCollection || []),
              ...(celoCollections || []),
              ...(auroraCollections || []),
              ...(nearCollection || []),
            ];
      case "algorand":
        return algoCollectionsArr;
      case "polygon":
        return polygonCollections;
      case "celo":
        return celoCollections;
      case "near":
        return nearCollection;
      case "aurora":
        return auroraCollections;
      default:
        break;
    }
    return null;
  };

  // get search result for all blockchains
  const searchHandler = (value) => {
    value = value.trim().toLowerCase();
    if (!value) return;
    handleSetState({ filter: { ...filter, searchValue: value } });
    const { search } = location;
    const chainParam = new URLSearchParams(search).get("chain");
    const params = new URLSearchParams({
      search: value,
      ...(chainParam && { chain: chainParam }),
    });
    history.replace({ pathname: location.pathname, search: params.toString() });
    const collection = getCollectionByChain();
    if (!collection) return;
    const filtered = collection.filter(
      (col) => col.name.toLowerCase().includes(value) || col.description.toLowerCase().includes(value)
    );
    if (filtered.length) {
      handleSetState({ filteredCollection: filtered });
    } else {
      handleSetState({ filteredCollection: null });
    }
  };

  const chainChange = (value) => {
    const { search } = location;
    const name = new URLSearchParams(search).get("search");
    const params = new URLSearchParams({
      chain: value.toLowerCase().replace(/ /g, ""),
      ...(name && { search: name }),
    });
    history.replace({ pathname: location.pathname, search: params.toString() });
    handleSetState({ filter: { ...filter, chain: value } });
    const collection = getCollectionByChain(value.toLowerCase().replace(/ /g, ""));
    if (collection) {
      if (filter.searchValue) {
        const filtered = collection.filter(
          (col) =>
            col.name.toLowerCase().includes(name ? name.toLowerCase() : "") ||
            col.description.toLowerCase().includes(name ? name.toLowerCase() : "")
        );
        if (filtered.length) {
          handleSetState({ filteredCollection: filtered });
        } else {
          handleSetState({ filteredCollection: null });
        }
      } else {
        handleSetState({ filteredCollection: collection });
      }
    } else {
      handleSetState({ filteredCollection: null });
    }
  };

  // sort by price function for different blockchains
  const sortPrice = (filterProp) => {
    let sorted = [];
    if (filterProp === "high") {
      sorted = filteredCollection.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (filterProp === "low") {
      sorted = filteredCollection.sort((a, b) => Number(b.price) - Number(a.price));
      // } else if (filterProp === "txVolume") {
      //   sorted = filteredCollection.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (filterProp === "newest") {
      if (chainId === 4160) {
        sorted = filteredCollection.sort((a, b) => a?.createdAt["seconds"] - b?.createdAt["seconds"]);
      } else {
        sorted = filteredCollection.sort((a, b) => a?.createdAt - b?.createdAt);
      }
    } else if (filterProp === "oldest") {
      if (chainId === 4160) {
        sorted = filteredCollection.sort((a, b) => a?.createdAt["seconds"] - b?.createdAt["seconds"]);
      } else {
        sorted = filteredCollection.sort((a, b) => a?.createdAt - b?.createdAt);
      }
    } else if (filterProp === "descAlphabet") {
      sorted = filteredCollection.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    } else if (filterProp === "ascAlphabet") {
      sorted = filteredCollection.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())).reverse();
    }
    handleSetState({ filteredCollection: sorted });
  };

  // compile data for all blockchains
  useEffect(() => {
    const { search } = location;
    const name = new URLSearchParams(search).get("search");
    const chainParameter = new URLSearchParams(search).get("chain");
    if (chainParameter) {
      handleSetState({ filter: { ...filter, chain: chainParameter } });
    }
    const collection = getCollectionByChain(chainParameter ? chainParameter.toLowerCase() : "All Chains");
    if (name) {
      handleSetState({ filter: { ...filter, searchValue: name } });
    }
    const filtered = collection?.filter(
      (col) =>
        col.name.toLowerCase().includes(name ? name.toLowerCase() : "") ||
        col.description.toLowerCase().includes(name ? name.toLowerCase() : "")
    );
    if (algoCollectionsArr || auroraCollections || celoCollection || polygonCollections) {
      handleSetState({
        filteredCollection: filtered,
        numNfts: filtered.length,
        last: Number((filtered.length / 16).toFixed()),
      });
    } else {
      handleSetState({ filteredCollection: null });
    }
    return null;
  }, [algoCollections, polygonCollections, celoCollection, auroraCollections]);

  const handleLeftClick = () => {
    if (activePage > 3) {
      console.log(">>>", page1, page2, page3, activePage);
      handleSetState({
        page1: page1 - 1,
        page2: page2 - 1,
        page3: page3 - 1,
        activePage: activePage - 1,
      });
    } else if (activePage > 1) handleSetState({ page1: 1, page2: 2, page3: 3, activePage: activePage - 1 });
  };
  const handleRightClick = () => {
    if (activePage >= 3 && activePage < last - 1) {
      handleSetState({
        activePage: activePage + 1,
      });
    } else if (activePage < 3) {
      handleSetState({
        page1: page1 + 1,
        page2: page2 + 1,
        page3: page3 + 1,
        activePage: activePage + 1,
      });
    } else {
      handleSetState({
        activePage: last,
      });
    }
  };

  const handleGo = (input) => {
    if (input <= last) {
      handleSetState({
        page1: input,
        page2: parseInt(input) + 1,
        page3: parseInt(input) + 2,
        page4: parseInt(input) + 3,
        activePage: parseInt(input),
      });
    }
  };
  return (
    <div className={classes.container}>
      {/* <div className={classes.header}>
          <h1>Collections</h1>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={searchHandler} />
            <ChainDropdown onChainFilter={chainChange} />
            <PriceDropdown onPriceFilter={sortPrice} />
          </div>
        </div> */}
      {len ? (
        ""
      ) : (
        <div className={classes.header} style={{ backgroundImage: `url(${bannerImg})` }}>
          <div className={classes.wrapperContainer}>
            <div className={classes.title}>Collections</div>
            <div className={classes.subTitle}>View listed Collections ({numNfts})</div>
            <div className={classes.searchAndNavWrapper}>
              <div className={classes.search}>
                <Search />
              </div>
              <ChainDropdown onChainFilter={chainChange} />
              <PriceDropdown onPriceFilter={sortPrice} />
            </div>
            <div className={classes.searchAndFilter}>
              <div
                className={`${classes.btn} && ${selected === "24h" ? classes.active : ""}`}
                onClick={() => {
                  handleSetState({ selected: "24h" });
                }}
              >
                24 Hours
              </div>
              <div
                className={`${classes.btn} && ${selected === "7d" ? classes.active : ""}`}
                onClick={() => {
                  handleSetState({ selected: "7d" });
                }}
              >
                7 Days
              </div>
              <div
                className={`${classes.btn} && ${selected === "30d" ? classes.active : ""}`}
                onClick={() => {
                  handleSetState({ selected: "30d" });
                }}
              >
                30 Days
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={classes.wrapperContainer}>
        {filteredCollection?.length ? (
          <div className={classes.wrapper}>
            {len
              ? [
                  ...(filteredCollection || [])
                    ?.filter((_, idx) => idx < 12)
                    .map((collection, idx) => <CollectionsCard key={idx} collection={collection} />),
                ]
              : [
                  ...(filteredCollection || [])
                    ?.filter((_, idx) => idx < 16)
                    .map((collection, idx) => <CollectionsCard key={idx} collection={collection} />),
                ]}
          </div>
        ) : !filteredCollection && filter.searchValue ? (
          <NotFound />
        ) : !filteredCollection ? (
          <NotFound />
        ) : (
          <div className={classes.skeleton}>
            {[...new Array(5)].map((id) => (
              <div key={id}>
                <Skeleton count={1} height={200} />
                <br />
                <Skeleton count={1} height={30} />
                <br />
                <Skeleton count={1} height={30} />
              </div>
            ))}
          </div>
        )}
      </div>
      {len ? (
        ""
      ) : (
        <div className={classes.wrapperContainer}>
          <div className={classes.pagination}>
            <div className={classes.left}>
              <img src={leftArrowIcon} alt="" onClick={handleLeftClick} />
              <span
                className={activePage == page1 ? classes.activePage : ""}
                onClick={() => handleSetState({ activePage: page1 })}
              >
                {page1}
              </span>
              <span
                className={activePage == page2 ? classes.activePage : ""}
                onClick={() => handleSetState({ activePage: page2 })}
              >
                {last < 2 ? "" : page2}
              </span>
              <span
                className={activePage == page3 ? classes.activePage : ""}
                onClick={() => handleSetState({ activePage: page3 })}
              >
                {last < 3 ? "" : page3}
              </span>
              ...
              <span
                className={activePage == last ? classes.activePage : ""}
                onClick={() => handleSetState({ activePage: last })}
              >
                {last}
              </span>
              <img src={rightArrowIcon} alt="" onClick={handleRightClick} />
            </div>
            <div className={classes.right}>
              <span className={classes.greyText}> Go to page</span>
              <input
                type="number"
                onChange={(e) =>
                  handleSetState({
                    inputPage: e.target.value,
                  })
                }
                max={last}
                onKeyDown={(e) => (e.key === "Enter" ? handleGo(inputPage) : "")}
              />
              <span className={classes.go} onClick={() => handleGo(inputPage)}>
                Go
              </span>
              <img src={rightArrowIcon} alt="" onClick={handleRightClick} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
