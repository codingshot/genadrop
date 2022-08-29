import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { ethers } from "ethers";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import classes from "./dashboard.module.css";
import { GenContext } from "../../gen-state/gen.context";
import { setNotification } from "../../gen-state/gen.actions";
import { fetchUserBoughtNfts, fetchUserCollections, fetchUserCreatedNfts, readUserProfile } from "../../utils/firebase";
import { celoClient, polygonClient } from "../../utils/graphqlClient";
import { GET_USER_NFT } from "../../graphql/querries/getCollections";
import {
  getAuroraCollectedNFTs,
  getAuroraMintedNfts,
  getAuroraUserCollections,
  getCeloCollectedNFTs,
  getCeloMintedNFTs,
  getCeloUserCollections,
  getPolygonCollectedNFTs,
  getPolygonMintedNFTs,
  getPolygonUserCollections,
} from "../../renderless/fetch-data/fetchUserGraphData";
// utils
import Copy from "../../components/copy/copy";
import { getUserNftCollections, getUserSingleNfts } from "../../utils";
import supportedChains from "../../utils/supportedChains";
// components
import NftCard from "../../components/Marketplace/NftCard/NftCard";
import CollectionsCard from "../../components/Marketplace/collectionsCard/collectionsCard";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import NotFound from "../../components/not-found/notFound";
import FilterDropdown from "../../components/Marketplace/Filter-dropdown/FilterDropdown";
// assets
import avatar from "../../assets/avatar.png";
import { ReactComponent as Youtube } from "../../assets/icon-youtube-green.svg";
import { ReactComponent as Twitter } from "../../assets/icon-twitter-blue.svg";
import { ReactComponent as Discord } from "../../assets/icon-discord-blue.svg";
import { ReactComponent as Instagram } from "../../assets/icon-instagram-blue.svg";

const Dashboard = () => {
  const location = useLocation();
  const history = useHistory();
  const { url } = useRouteMatch();

  const [state, setState] = useState({
    togglePriceFilter: false,
    filter: {
      searchValue: "",
      price: "low - high",
      name: "a - z",
      date: "newest - oldest",
    },
    activeDetail: "created",
    collectedNfts: null,
    createdNfts: null,
    myCollections: null,
    filteredCollection: null,
    userDetails: null,
  });

  const { filter, activeDetail, myCollections, createdNfts, collectedNfts, filteredCollection, userDetails } = state;

  const { account, mainnet, chainId } = useContext(GenContext);

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const breakAddress = (address = "", width = 6) => {
    return address && `${address.slice(0, width)}...${address.slice(-width)}`;
  };

  // return null;
  useEffect(() => {
    // Get User Created NFTs
    let address = "";
    if (supportedChains[chainId]?.chain !== "Algorand" && account) {
      address = ethers?.utils?.hexlify(account);
    }
    (async function getUserNFTs() {
      switch (supportedChains[chainId]?.chain) {
        case "Algorand":
          const singleNfts = await fetchUserCreatedNfts(account);
          const algoNFTs = await getUserSingleNfts({ mainnet, singleNfts });
          handleSetState({ createdNfts: [...(algoNFTs || [])] });
          break;
        case "Celo":
          const celoNfts = await getCeloMintedNFTs(address);
          handleSetState({ createdNfts: [...(celoNfts || [])] });
          break;
        case "Aurora":
          const aurroraNFTs = await getAuroraMintedNfts(address);
          handleSetState({ createdNfts: [...(aurroraNFTs || [])] });
          break;
        case "Polygon":
          const polygonNFTs = await getPolygonMintedNFTs(address);
          handleSetState({ createdNfts: [...(polygonNFTs || [])] });
          break;
        default:
          break;
      }
    })();
    (async function getUserCollectedNfts() {
      // get collected nfts from the same fetch result

      switch (supportedChains[chainId]?.chain) {
        case "Algorand":
          const collectedNfts = await fetchUserBoughtNfts(account);
          const algoCollectedNfts = await getUserSingleNfts({ mainnet, singleNfts: collectedNfts });
          handleSetState({ collectedNfts: [...(algoCollectedNfts || [])] });
          break;
        case "Celo":
          const celoCollectedNfts = await getCeloCollectedNFTs(address);
          handleSetState({ collectedNfts: [...(celoCollectedNfts || [])] });
          break;
        case "Aurora":
          const auroraCollectedNfts = await getAuroraCollectedNFTs(address);
          handleSetState({ collectedNfts: [...(auroraCollectedNfts || [])] });
          break;
        case "Polygon":
          const polygonCollectedNfts = await getPolygonCollectedNFTs(address);
          handleSetState({ collectedNfts: [...(polygonCollectedNfts || [])] });
          break;
        default:
          break;
      }
    })();

    // Get User created Collections
    (async function getCreatedCollections() {
      let address = "";
      if (supportedChains[chainId]?.chain !== "Algorand" && account) {
        address = ethers?.utils?.hexlify(account);
      }
      switch (supportedChains[chainId]?.chain) {
        case "Algorand":
          const collections = await fetchUserCollections(account);
          const algoCollections = await getUserNftCollections({ collections, mainnet });
          handleSetState({ myCollections: [...(algoCollections || [])] });
          break;
        case "Celo":
          const celoCollection = await getCeloUserCollections(address);
          handleSetState({ myCollections: [...(celoCollection || [])] });
          break;
        case "Aurora":
          const auroraCollections = await getAuroraUserCollections(address);
          handleSetState({ myCollections: [...(auroraCollections || [])] });
          break;
        case "Polygon":
          const polyCollections = await getPolygonUserCollections(address);
          handleSetState({ myCollections: [...(polyCollections || [])] });
          break;
        default:
          break;
      }
    })();

    (async function getUsername() {
      const data = await readUserProfile(account);

      handleSetState({ userDetails: data });
    })();
  }, [account, chainId]);

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

  const handleFilterDropdown = ({ name, label }) => {
    handleSetState({ filter: { ...filter, [name]: label } });
  };

  useEffect(() => {
    if (!filteredCollection || !account) return;
    let filtered = null;
    if (filter.price === "low - high") {
      filtered = getCollectionToFilter().sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      filtered = getCollectionToFilter().sort((a, b) => Number(b.price) - Number(a.price));
    }
    handleSetState({ filteredCollection: filtered });
  }, [filter.price]);

  useEffect(() => {
    if (!filteredCollection || !account) return;
    let filtered = null;
    if (filter.name === "a - z") {
      filtered = getCollectionToFilter().sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return -1;
      });
    } else {
      filtered = getCollectionToFilter().sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
        return 1;
      });
    }
    handleSetState({ filteredCollection: filtered });
  }, [filter.name]);

  useEffect(() => {
    if (!filteredCollection || !account) return;
    let filtered = null;
    console.log({ filteredCollection });
    if (filter.date === "newest - oldest") {
      filtered = getCollectionToFilter().sort((a, b) => {
        if (!a.createdAt) return a - b; // this code line is because 1of1 nfts do not yet have createAt properties
        if (typeof a.createdAt === "object") {
          return a.createdAt.seconds - b.createdAt.seconds;
        }
        return a.createdAt - b.createdAt;
      });
    } else {
      filtered = getCollectionToFilter().sort((a, b) => {
        if (!a.createdAt) return a - b; // this code line is because 1of1 nfts do not yet have createAt properties
        if (typeof a.createdAt === "object") {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return b.createdAt - a.createdAt;
      });
    }
    handleSetState({ filteredCollection: filtered });
  }, [filter.date]);

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
      {/* change background to dynamic */}
      <div className={classes.bannerContainer}>{/* <img src={bg} alt="" className={classes.banner} /> */}</div>
      <div className={classes.bannerWrapper}>
        <div>
          <img className={classes.imageContainer} src={avatar} alt="" />
          <div className={classes.profileHeader}>
            <div className={classes.profileDetail}>
              {userDetails?.username ? <div className={classes.username}> {userDetails.username}</div> : ""}

              <div className={classes.social}>
                {userDetails?.twitter ? (
                  <a href={`https://twitter.com/${userDetails.twitter}`} target="_blank" rel="noreferrer">
                    {" "}
                    <Twitter className={classes.socialIcon} />
                  </a>
                ) : (
                  ""
                )}
                {userDetails?.youtube ? (
                  <a href={`https://youtube.com/${userDetails.youtube}`} target="_blank" rel="noreferrer">
                    {" "}
                    <Youtube className={classes.socialIcon} />
                  </a>
                ) : (
                  ""
                )}
                {userDetails?.instagram ? (
                  <a href={`https://www.instagram.com/${userDetails.instagram}`} target="_blank" rel="noreferrer">
                    {" "}
                    <Instagram className={classes.socialIcon} />
                  </a>
                ) : (
                  ""
                )}
                {userDetails?.discord ? (
                  <a href={`https://discord.com/users/${userDetails.discord}`} target="_blank" rel="noreferrer">
                    {" "}
                    <Discord className={classes.socialIcon} />
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className={classes.address}>
              <img src={supportedChains[chainId]?.icon} alt="blockchain" />
              <Copy message={account} placeholder={breakAddress(account)} />
            </div>
          </div>
        </div>
        <Link to={`${url}/profile/settings`}>
          <div className={classes.editProfile}>Edit Profile</div>
        </Link>
      </div>

      <div className={classes.wrapper}>
        <section className={classes.header}>
          <div className={classes.details}>
            <div
              onClick={() => handleSetState({ activeDetail: "collected" })}
              className={`${classes.detail} ${activeDetail === "collected" && classes.active}`}
            >
              <p>Collected</p>
              <span>{Array.isArray(collectedNfts) ? collectedNfts.length : 0}</span>
            </div>
            <div
              onClick={() => handleSetState({ activeDetail: "created" })}
              className={`${classes.detail} ${activeDetail === "created" && classes.active}`}
            >
              <p>Created</p>
              <span>{Array.isArray(createdNfts) ? createdNfts.length : 0}</span>
            </div>
            <div
              onClick={() => handleSetState({ activeDetail: "collections" })}
              className={`${classes.detail} ${activeDetail === "collections" && classes.active}`}
            >
              <p>My Collections</p>
              <span>{Array.isArray(myCollections) ? myCollections.length : 0}</span>
            </div>
          </div>
        </section>

        <section className={classes.main}>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={(value) => searchHandler(value)} />
            <FilterDropdown onFilter={handleFilterDropdown} />
          </div>

          {filteredCollection?.length > 0 ? (
            activeDetail === "collections" ? (
              <div className={classes.overview}>
                {filteredCollection.map((collection, idx) => (
                  <CollectionsCard key={idx} collection={collection} fromDashboard />
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
              {[...new Array(5)].map((_, id) => (
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
