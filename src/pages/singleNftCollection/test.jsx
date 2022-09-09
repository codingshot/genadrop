import React, { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useHistory, useLocation } from "react-router-dom";
import classes from "./singleNftCollection.module.css";
import NftCard from "../../components/Marketplace/NftCard/NftCard";
import NotFound from "../../components/not-found/notFound";
import bannerImg from "../../assets/explore-banner2.svg";
import leftArrowIcon from "../../assets/icon-left-arrow.svg";
import rightArrowIcon from "../../assets/icon-right-arrow.svg";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import PriceDropdown from "../../components/Marketplace/Price-dropdown/priceDropdown";
import { GenContext } from "../../gen-state/gen.context";

const SingleNftCollection = ({ len }) => {
  const { singleAlgoNfts, singleAuroraNfts, singlePolygonNfts, singleCeloNfts, chainId } = useContext(GenContext);
  const singleAlgoNftsArr = Object.values(singleAlgoNfts);

  const location = useLocation();
  const history = useHistory();

  const [state, setState] = useState({
    togglePriceFilter: false,
    toggleChainFilter: false,
    filteredCollection: [],
    celoCollection: null,
    allChains: null,
    filter: {
      searchValue: "",
      price: "low",
      chain: "All Chains",
    },
    selected: "all",
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
        return !singleAlgoNftsArr && !singlePolygonNfts && !singleCeloNfts && !singleAuroraNfts
          ? null
          : [
              ...(singleAlgoNftsArr || []),
              ...(singlePolygonNfts || []),
              ...(singleCeloNfts || []),
              ...(singleAuroraNfts || []),
            ];
      case "algorand":
        return singleAlgoNftsArr;
      case "polygon":
        return singlePolygonNfts;
      case "celo":
        return singleCeloNfts;
      case "aurora":
        return singleAuroraNfts;
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
    const collection = getCollectionByChain(value.toLowerCase().replace(/ /g, ""));

    if (filterProp === "high") {
      sorted = collection?.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (filterProp == "low") {
      sorted = collection?.sort((a, b) => Number(b.price) - Number(a.price));
      // } else if (filterProp === "txVolume") {
      //   sorted = collection?.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (filterProp === "newest") {
      if (chainId === 4160) {
        sorted = collection?.sort((a, b) => a?.createdAt["seconds"] - b?.createdAt["seconds"]);
      } else {
        sorted = collection?.sort((a, b) => a?.createdAt - b?.createdAt);
      }
    } else if (filterProp === "oldest") {
      if (chainId === 4160) {
        sorted = collection?.sort((a, b) => a?.createdAt["seconds"] - b?.createdAt["seconds"]);
      } else {
        sorted = collection?.sort((a, b) => a?.createdAt - b?.createdAt);
      }
    } else if (filterProp === "descAlphabet") {
      sorted = collection?.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    } else if (filterProp === "ascAlphabet") {
      sorted = collection?.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())).reverse();
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
    if (singleAlgoNftsArr || singleAuroraNfts) {
      handleSetState({
        filteredCollection: filtered,
        numNfts: filtered.length,
        last: Number((filtered.length / 16).toFixed()),
      });
    } else {
      handleSetState({ filteredCollection: null });
    }
    return null;
  }, [singleAlgoNfts, singlePolygonNfts, celoCollection, singleAuroraNfts]);

  const handleLeftClick = () => {
    if (activePage > 3) {
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
      {len ? (
        ""
      ) : (
        <div className={classes.header} style={{ backgroundImage: `url(${bannerImg})` }}>
          <div className={classes.wrapperContainer}>
            <div className={classes.title}>1 of 1s</div>
            <div className={classes.subTitle}>View listed 1 of 1s ({Number(numNfts).toLocaleString()} Listed)</div>
            <div className={classes.searchAndNavWrapper}>
              <div className={classes.search}>
                <SearchBar onSearch={searchHandler} />
              </div>
              <ChainDropdown onChainFilter={chainChange} />
              <PriceDropdown onPriceFilter={sortPrice} />
            </div>
            <div className={classes.searchAndFilter}>
              <div
                className={`${classes.btn} && ${selected === "all" ? classes.active : ""}`}
                onClick={() => {
                  handleSetState({ selected: "all" });
                }}
              >
                All
              </div>
              <div
                className={`${classes.btn && classes.disabled} && ${selected === "painting" ? classes.active : ""}`}
                disabled
                onClick={() => {
                  handleSetState({ selected: "painting" });
                }}
              >
                Painting
              </div>
              <div
                className={`${classes.btn && classes.disabled} && ${selected === "shorts" ? classes.active : ""}`}
                disabled
                onClick={() => {
                  handleSetState({ selected: "shorts" });
                }}
              >
                Shorts
              </div>
              <div
                className={`${classes.btn && classes.disabled} && ${selected === "photography" ? classes.active : ""}`}
                disabled
                onClick={() => {
                  handleSetState({ selected: "photography" });
                }}
              >
                Photography
              </div>
              <div
                className={`${classes.btn && classes.disabled} && ${selected === "Illustration" ? classes.active : ""}`}
                disabled
                onClick={() => {
                  handleSetState({ selected: "Illustration" });
                }}
              >
                Illustration
              </div>
              <div
                className={`${classes.btn && classes.disabled} && ${selected === "3d" ? classes.active : ""}`}
                disabled
                onClick={() => {
                  handleSetState({ selected: "3d" });
                }}
              >
                3D
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
                    .map((nft) => <NftCard key={nft.Id} nft={nft} listed is1of1 />),
                ]
              : [
                  ...(filteredCollection || [])
                    ?.filter((_, idx) => idx < 16)
                    .map((nft) => <NftCard key={nft.Id} nft={nft} listed is1of1 />),
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
        {len ? (
          ""
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default SingleNftCollection;
