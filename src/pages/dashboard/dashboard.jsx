import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import Copy from "../../components/copy/copy";
import CollectionsCard from "../../components/Marketplace/collectionsCard/collectionsCard";
import NftCard from "../../components/Marketplace/NftCard/NftCard";
import { GenContext } from "../../gen-state/gen.context";
import {
  getGraphCollection,
  getGraphNft,
  getUserGraphNft,
  getUserNftCollections,
  getUserSingleNfts,
} from "../../utils";
import {
  fetchUserBoughtNfts,
  fetchUserCollections,
  fetchUserCreatedNfts,
  fetchUserNfts,
  readUserProfile,
} from "../../utils/firebase";
import classes from "./dashboard.module.css";
import avatar from "../../assets/avatar.png";
import { ethers } from "ethers";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import PriceDropdown from "../../components/Marketplace/Price-dropdown/priceDropdown";
import NotFound from "../../components/not-found/notFound";
import bg from "../../assets/bg.png"; // remove this when done!
import twitter from "../../assets/icon-twitter-green.svg";
import discord from "../../assets/icon-discord-green.svg";
import instagram from "../../assets/icon-instagram-green.svg";
import youtube from "../../assets/icon-youtube-green.svg";
import { celoClient, polygonClient } from "../../utils/graphqlClient";
import { GET_USER_NFT } from "../../graphql/querries/getCollections";
import { setNotification } from "../../gen-state/gen.actions";

const Dashboard = () => {
  const location = useLocation();
  const history = useHistory();
  const { url } = useRouteMatch();

  const [state, setState] = useState({
    togglePriceFilter: false,
    filter: {
      searchValue: "",
      price: "high",
    },
    activeDetail: "created",
    collectedNfts: null,
    createdNfts: null,
    myCollections: null,
    filteredCollection: null,
    userDetails: null,
  });

  const { filter, activeDetail, myCollections, createdNfts, collectedNfts, filteredCollection, userDetails } = state;

  const {
    account,
    mainnet,
    singleAuroraNfts,
    singlePolygonNfts,
    singleCeloNfts,
    auroraCollections,
    polygonCollections,
    celoCollections,
    dispatch,
    chainId,
  } = useContext(GenContext);

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const breakAddress = (address = "", width = 6) => {
    return address && `${address.slice(0, width)}...${address.slice(-width)}`;
  };

  useEffect(() => {
    if (!account) history.push("/");
    // Get User Created NFTs

    (async function getUserNFTs() {
      const singleNfts = await fetchUserCreatedNfts(account);
      let algoNFTs = [];
      if (singleNfts) {
        algoNFTs = await getUserSingleNfts({ mainnet, singleNfts });
      }
      const aurroraNFTs = singleAuroraNfts?.filter((nft) => nft.owner === account);
      const polygonNFTs = singlePolygonNfts?.filter((nft) => nft.owner === account);
      const celoNfts = singleCeloNfts?.filter((nft) => nft.owner === account);
      handleSetState({
        createdNfts: [...(algoNFTs || []), ...(aurroraNFTs || []), ...(polygonNFTs || []), ...(celoNfts || [])],
      });
    })();

    (async function getUserCollectedNfts() {
      // get collected nfts from the same fetch result
      const address = ethers.utils.hexlify(account);
      if (chainId === 80001) {
        const { data } = await polygonClient.query(GET_USER_NFT, { id: address }).toPromise();

        const polygonCollectedNft = await getUserGraphNft(data?.user?.nfts, address);
        handleSetState({ collectedNfts: polygonCollectedNft });
      } else if (chainId === 44787) {
        const { data } = await celoClient.query(GET_USER_NFT, { id: address }).toPromise();
        const celoCollectedNft = await getUserGraphNft(data?.user?.nfts, address);
        handleSetState({ collectedNfts: celoCollectedNft });
      } else {
        const collectedNfts = await fetchUserBoughtNfts(account);
        const algoCollectedNfts = await getUserSingleNfts({ mainnet, singleNfts: collectedNfts });
        handleSetState({ collectedNfts: algoCollectedNfts });
      }
    })();

    // Get User created Collections
    (async function getCreatedCollections() {
      const collections = await fetchUserCollections(account);
      const algoCollections = await getUserNftCollections({ collections, mainnet });
      const aurrCollections = auroraCollections?.filter((collection) => collection.nfts[0]?.owner?.id === account);
      const polyCollections = polygonCollections?.filter((collection) => collection.nfts[0]?.owner?.id === account);
      const celoCollection = celoCollections?.filter((collection) => collection.nfts[0]?.owner?.id === account);
      handleSetState({
        myCollections: [
          ...(algoCollections || []),
          ...(aurrCollections || []),
          ...(polyCollections || []),
          ...(celoCollection || []),
        ],
      });
    })();

    (async function getUsername() {
      const data = await readUserProfile(account);

      handleSetState({ userDetails: data });
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
      filteredNFTCollection = collection.filter((col) =>
        col.name.toLowerCase().includes(name ? name.toLowerCase() : "")
      );
    }
    handleSetState({ filteredCollection: filteredNFTCollection });
  }, [activeDetail, createdNfts, collectedNfts, myCollections]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <section className={classes.header}>
          {/* change background to dynamic */}
          <img src={bg} alt="" className={classes.banner} />

          <div className={classes.imageContainer}>
            <img src={avatar} alt="" />
          </div>

          <div className={classes.lower}>
            {userDetails?.username ? <div className={classes.username}> {userDetails.username}</div> : ""}
            <div className={classes.address}>
              <Copy message={account} placeholder={breakAddress(account)} />
            </div>

            <div className={classes.social}>
              {userDetails?.twitter ? (
                <a href={`https://twitter.com/${userDetails.twitter}`} target="_blank" rel="noreferrer">
                  {" "}
                  <img src={twitter} alt="" className={classes.socialIcon} />{" "}
                </a>
              ) : (
                ""
              )}
              {userDetails?.youtube ? (
                <a href={`https://youtube.com/${userDetails.youtube}`} target="_blank" rel="noreferrer">
                  {" "}
                  <img src={youtube} alt="" className={classes.socialIcon} />{" "}
                </a>
              ) : (
                ""
              )}
              {userDetails?.instagram ? (
                <a href={`https://www.instagram.com/${userDetails.instagram}`} target="_blank" rel="noreferrer">
                  {" "}
                  <img src={instagram} alt="" className={classes.socialIcon} />{" "}
                </a>
              ) : (
                ""
              )}
              {userDetails?.discord ? <img src={discord} alt="" className={classes.socialIcon} /> : ""}
            </div>
            <div className={classes.social} />
            <Link to={`${url}/profile/settings`}>
              <div className={classes.editProfile}>Edit Profile</div>
            </Link>

            <div className={classes.details}>
              <div
                onClick={() => handleSetState({ activeDetail: "created" })}
                className={`${classes.detail} ${activeDetail === "created" && classes.active}`}
              >
                <p>Created NFT</p>
                <span>{Array.isArray(createdNfts) ? createdNfts.length : 0}</span>
              </div>
              <div
                onClick={() => handleSetState({ activeDetail: "collected" })}
                className={`${classes.detail} ${activeDetail === "collected" && classes.active}`}
              >
                <p>Collected NFTs</p>
                <span>{Array.isArray(collectedNfts) ? collectedNfts.length : 0}</span>
              </div>
              <div
                onClick={() => handleSetState({ activeDetail: "collections" })}
                className={`${classes.detail} ${activeDetail === "collections" && classes.active}`}
              >
                <p>My Collections</p>
                <span>{Array.isArray(myCollections) ? myCollections.length : 0}</span>
              </div>
            </div>
          </div>
        </section>

        <section className={classes.main}>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={(value) => searchHandler(value)} />
            <PriceDropdown onPriceFilter={(value) => handleSetState({ filter: { ...filter, price: value } })} />
          </div>

          {filteredCollection?.length > 0 ? (
            activeDetail === "collections" ? (
              <div className={classes.overview}>
                {filteredCollection.map((collection, idx) => (
                  <CollectionsCard key={idx} collection={collection} />
                ))}
              </div>
            ) : activeDetail === "created" ? (
              <div className={classes.overview}>
                {filteredCollection.map((nft, idx) => (
                  <NftCard key={idx} nft={nft} listed={false} fromDashboard />
                ))}
              </div>
            ) : activeDetail === "collected" ? (
              <div className={classes.overview}>
                {filteredCollection.map((nft, idx) => (
                  <NftCard key={idx} nft={nft} listed={!nft.sold} fromDashboard />
                ))}
              </div>
            ) : (
              ""
            )
          ) : filteredCollection?.length === 0 ? (
            filter.searchValue ? (
              <NotFound />
            ) : (
              <NotFound />
            )
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
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
