import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useLocation } from "react-router-dom";
import Copy from "../../components/copy/copy";
import CollectionsCard from "../../components/Marketplace/collectionsCard/collectionsCard";
import NftCard from "../../components/Marketplace/NftCard/NftCard";
import { GenContext } from "../../gen-state/gen.context";
import { getNftCollections, getUserCollectedNftCollection, getSingleNfts } from "../../utils";
import { fetchAllNfts, fetchUserCollections, fetchUserNfts } from "../../utils/firebase";
import classes from "./dashboard.module.css";
import avatar from "../../assets/avatar.png";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import PriceDropdown from "../../components/Marketplace/Price-dropdown/priceDropdown";
import NotFound from "../../components/not-found/notFound";

const Dashboard = () => {
  const location = useLocation();
  const history = useHistory();

  const [state, setState] = useState({
    togglePriceFilter: false,
    filter: {
      searchValue: "",
      price: "high",
    },
    activeDetail: "created",
    collectedNfts: 0,
    createdNfts: 0,
    myCollections: null,
    filteredCollection: null,
  });

  const { filter, activeDetail, myCollections, createdNfts, collectedNfts, filteredCollection } = state;
  const { account, mainnet } = useContext(GenContext);

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const breakAddress = (address = "", width = 6) => `${address.slice(0, width)}...${address.slice(-width)}`;

  useEffect(() => {
    if (!account) return;

    (async function readAllSingle() {
      const userCollections = await fetchUserCollections(account);
      const myNftsCollections = await getNftCollections(userCollections, mainnet);
      console.log("===>", myNftsCollections);
      handleSetState({ myCollections: myNftsCollections });
    })();

    (async function getCollections() {
      const userNftCollections = await fetchUserNfts(account);
      const createdUserNfts = await getSingleNfts(mainnet, userNftCollections);
      const createdNFTs = createdUserNfts.filter((nft) => nft.owner);
      console.log("===>", createdUserNfts);

      handleSetState({ createdNfts: createdNFTs });
    })();

    (async function getCollections() {
      const userNftCollections = await fetchAllNfts(account);
      const createdUserNfts = await getUserCollectedNftCollection(mainnet, userNftCollections);
      const collectedNFTS = createdUserNfts.filter((nft) => nft.buyer === account);
      console.log("===>", collectedNFTS);

      handleSetState({ collectedNfts: collectedNFTS });
    })();
  }, [account]);

  // eslint-disable-next-line consistent-return
  const getCollectionToFilter = () => {
    switch (activeDetail) {
      case "collected":
        return collectedNfts;
      case "created":
        return createdNfts;
      case "collections":
        return myCollections;
      default:
        break;
    }
  };

  const searchHandler = (value) => {
    if (!account) return;
    if (!filteredCollection) return;
    const params = new URLSearchParams({
      search: value.toLowerCase(),
    });
    history.replace({ pathname: location.pathname, search: params.toString() });
    const filtered = getCollectionToFilter().filter((col) => col.name.toLowerCase().includes(value.toLowerCase()));
    handleSetState({ filteredCollection: filtered, filter: { ...filter, searchValue: value } });
  };

  useEffect(() => {
    if (!account) return;
    if (!filteredCollection) return;
    let filtered = null;
    if (filter.price === "low") {
      filtered = getCollectionToFilter().sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      filtered = getCollectionToFilter().sort((a, b) => Number(b.price) - Number(a.price));
    }
    handleSetState({ filteredCollection: filtered });
  }, [filter.price]);

  useEffect(() => {
    if (!account) return;
    const collection = getCollectionToFilter();
    const { search } = location;
    const name = new URLSearchParams(search).get("search");
    if (name) {
      handleSetState({ filter: { ...filter, searchValue: name } });
    }
    let filteredNFTCollection = collection;
    if (collection) {
      filteredNFTCollection = collection?.filter((col) =>
        col.name.toLowerCase().includes(name ? name.toLowerCase() : "")
      );
    }
    handleSetState({ filteredCollection: filteredNFTCollection });
  }, [activeDetail, createdNfts, collectedNfts, myCollections]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <section className={classes.header}>
          <div className={classes.imageContainer}>
            <img src={avatar} alt="" />
          </div>

          <div className={classes.address}>
            <Copy message={account} placeholder={breakAddress(account)} />
          </div>

          <div className={classes.details}>
            <div
              onClick={() => handleSetState({ activeDetail: "created" })}
              className={`${classes.detail} ${activeDetail === "created" && classes.active}`}
            >
              <p>Created NFT</p>
              <span>{createdNfts && createdNfts.length}</span>
            </div>
            <div
              onClick={() => handleSetState({ activeDetail: "collected" })}
              className={`${classes.detail} ${activeDetail === "collected" && classes.active}`}
            >
              <p>Collected NFTs</p>
              <span>{collectedNfts && collectedNfts.length}</span>
            </div>
            <div
              onClick={() => handleSetState({ activeDetail: "collections" })}
              className={`${classes.detail} ${activeDetail === "collections" && classes.active}`}
            >
              <p>My Collections</p>
              <span>{myCollections && myCollections.length}</span>
            </div>
          </div>
        </section>

        <section className={classes.main}>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={(value) => searchHandler(value)} />
            <PriceDropdown onPriceFilter={(value) => handleSetState({ filter: { ...filter, price: value } })} />
          </div>

          {filteredCollection?.length > 0 && activeDetail === "collections" ? (
            <div className={classes.overview}>
              {filteredCollection.map((collection, idx) => (
                <CollectionsCard key={idx} collection={collection} />
              ))}
            </div>
          ) : filteredCollection?.length > 0 && activeDetail === "created" ? (
            <div className={classes.overview}>
              {filteredCollection.map((nft, idx) => (
                <NftCard key={idx} nft={nft} list />
              ))}
            </div>
          ) : filteredCollection?.length > 0 && activeDetail === "collected" ? (
            <div className={classes.overview}>
              {filteredCollection.map((nft, idx) => (
                <NftCard key={idx} nft={nft} list />
              ))}
            </div>
          ) : filteredCollection?.length === 0 ? (
            filter.searchValue ? (
              <NotFound />
            ) : (
              <h1 className={classes.noResult}>No Results Found</h1>
            )
          ) : (
            <div className={classes.skeleton}>
              {[...new Array(5)]
                .map((_, idx) => idx)
                .map((id) => (
                  <div key={id}>
                    <Skeleton count={1} height={300} />
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
