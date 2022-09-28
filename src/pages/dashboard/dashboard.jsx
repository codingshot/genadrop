import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { ethers } from "ethers";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import classes from "./dashboard.module.css";
import { GenContext } from "../../gen-state/gen.context";
import { fetchUserBoughtNfts, fetchUserCollections, fetchUserCreatedNfts, readUserProfile } from "../../utils/firebase";
import {
  getAuroraCollectedNFTs,
  getAuroraMintedNfts,
  getAuroraUserCollections,
  getCeloCollectedNFTs,
  getCeloMintedNFTs,
  getCeloUserCollections,
  getNearMintedNfts,
  getPolygonCollectedNFTs,
  getPolygonMintedNFTs,
  getPolygonUserCollections,
} from "../../renderless/fetch-data/fetchUserGraphData";
// utils
import { getUserNftCollections, getUserSingleNfts } from "../../utils";
import supportedChains from "../../utils/supportedChains";
import { chainIdToParams } from "../../utils/chainConnect";
// components
import SingleNftCard from "../../components/Marketplace/SingleNftCard/SingleNftCard";
import CollectionNftCard from "../../components/Marketplace/CollectionNftCard/CollectionNftCard";
import SearchBar from "../../components/Marketplace/Search-bar/searchBar.component";
import NotFound from "../../components/not-found/notFound";
import DashboardFilterDropdown from "../../components/Marketplace/Dashboard-Filter-Dropdown/DashboardFilterDropdown";
import Pagination from "../../components/pagination/Pagination";
// assets
import avatar from "../../assets/avatar.png";
import { ReactComponent as Youtube } from "../../assets/icon-youtube-green.svg";
import { ReactComponent as Twitter } from "../../assets/icon-twitter-blue.svg";
import { ReactComponent as Discord } from "../../assets/icon-discord-blue.svg";
import { ReactComponent as Instagram } from "../../assets/icon-instagram-blue.svg";
import { ReactComponent as LinkIcon } from "../../assets/icon-link.svg";

const Dashboard = () => {
  const location = useLocation();
  const history = useHistory();
  const { userId, chainId: chainID } = useParams();
  const [state, setState] = useState({
    togglePriceFilter: false,
    filter: {
      searchValue: "",
      price: "low - high",
      name: "a - z",
      date: "newest - oldest",
    },
    activeDetail: "sale",
    collectedNfts: null,
    createdNfts: null,
    myCollections: null,
    filteredCollection: null,
    userDetails: null,
    errorMessage: false,
    onSale: null,
    paginatePage: "",
    pageNumber: 0,
  });

  const {
    filter,
    activeDetail,
    myCollections,
    createdNfts,
    collectedNfts,
    filteredCollection,
    userDetails,
    onSale,
    paginatePage,
    pageNumber,
  } = state;

  const { mainnet, account } = useContext(GenContext);

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
    if (supportedChains[chainID]?.chain !== "Algorand" && supportedChains[chainID]?.chain !== "Near" && userId) {
      address = ethers?.utils?.hexlify(userId);
    }
    (async function getUserNFTs() {
      let nfts;
      switch (supportedChains[chainID]?.chain) {
        case "Algorand":
          nfts = await fetchUserCreatedNfts(userId);
          nfts = await getUserSingleNfts({ mainnet, singleNfts: nfts });
          break;
        case "Celo":
          nfts = await getCeloMintedNFTs(address);
          break;
        case "Aurora":
          nfts = await getAuroraMintedNfts(address);
          break;
        case "Polygon":
          nfts = await getPolygonMintedNFTs(address);
          break;
        case "Near":
          nfts = await getNearMintedNfts(userId);
          break;
        default:
          break;
      }
      const onSaleNFTs = nfts?.filter((nft) => nft.price !== 0 && !nft.sold);

      handleSetState({
        createdNfts: [...(nfts || [])],
        onSale: onSaleNFTs || [],
      });
    })();
    (async function getUserCollectedNfts() {
      // get collected nfts from the same fetch result
      let nfts;
      const collectedNFTs = await fetchUserBoughtNfts(userId);

      switch (supportedChains[chainID]?.chain) {
        case "Algorand":
          nfts = await getUserSingleNfts({ mainnet, singleNfts: collectedNFTs });
          break;
        case "Celo":
          nfts = await getCeloCollectedNFTs(address);
          break;
        case "Aurora":
          nfts = await getAuroraCollectedNFTs(address);
          break;
        case "Polygon":
          nfts = await getPolygonCollectedNFTs(address);
          break;
        default:
          break;
      }
      handleSetState({ collectedNfts: [...(nfts || [])] });
    })();

    // Get User created Collections
    (async function getCreatedCollections() {
      let walletAddress = "";
      if (supportedChains[chainID]?.chain !== "Algorand" && supportedChains[chainID]?.chain !== "Near" && userId) {
        walletAddress = ethers?.utils?.hexlify(userId);
      }
      let collection;
      const collections = await fetchUserCollections(userId);

      switch (supportedChains[chainID]?.chain) {
        case "Algorand":
          collection = await getUserNftCollections({ collections, mainnet });
          break;
        case "Celo":
          collection = await getCeloUserCollections(walletAddress);
          break;
        case "Aurora":
          collection = await getAuroraUserCollections(walletAddress);
          break;
        case "Polygon":
          collection = await getPolygonUserCollections(walletAddress);
          break;
        default:
          break;
      }
      handleSetState({
        myCollections: [...(collection || [])],
      });
    })();

    (async function getUsername() {
      const data = await readUserProfile(userId);

      handleSetState({ userDetails: data });
    })();
  }, [userId, chainID]);

  // eslint-disable-next-line consistent-return
  const getCollectionToFilter = () => {
    switch (activeDetail) {
      case "collected":
        return collectedNfts;
      case "created":
        return [...(createdNfts || []), ...(myCollections || [])];
      case "sale":
        return onSale;
      default:
        break;
    }
  };

  const searchHandler = (value) => {
    if (!userId) return;
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
    if (!filteredCollection || !userId) return;
    let filtered = null;
    if (filter.price === "low - high") {
      filtered = getCollectionToFilter().sort((a, b) => Number(a.price) - Number(b.price));
    } else {
      filtered = getCollectionToFilter().sort((a, b) => Number(b.price) - Number(a.price));
    }
    handleSetState({ filteredCollection: filtered });
  }, [filter.price]);

  useEffect(() => {
    if (!filteredCollection || !userId) return;
    let filtered = null;
    if (filter.name === "a - z") {
      filtered = getCollectionToFilter().sort((a, b) => {
        if (a.name?.toLowerCase() > b.name?.toLowerCase()) return 1;
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
    if (!filteredCollection || !userId) return;
    let filtered = null;
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
    if (!userId) return;
    const collection = getCollectionToFilter();
    const { search } = location;
    const name = new URLSearchParams(search).get("search");
    if (name) {
      handleSetState({ filter: { ...filter, searchValue: name } });
    }
    let filteredNFTCollection = collection;
    if (collection) {
      filteredNFTCollection = collection.filter((col) =>
        col.name?.toLowerCase().includes(name ? name.toLowerCase() : "")
      );
    }
    handleSetState({ filteredCollection: filteredNFTCollection });
  }, [activeDetail, createdNfts, collectedNfts, myCollections]);

  // pagination
  const perPage = 12;
  const pageVisited = pageNumber * perPage;

  const algoexplorer = mainnet ? "https://algoexplorer.io/" : "https://testnet.algoexplorer.io/";

  const handleExplorer = () => {
    if (supportedChains[chainID]?.chain === "Algorand") {
      window.open(`${algoexplorer}address/${userId}`);
    } else if (supportedChains[chainID]?.chain === "Near") {
      window.open(`${chainIdToParams[chainID]?.blockExplorerUrls}${userId}`);
    } else {
      window.open(`${chainIdToParams[chainID]?.blockExplorerUrls}address/${userId}`);
    }
  };
  const params = new URLSearchParams(location.search);

  const activeSwitch = (active) => {
    params.set("tab", active);
    history.push({
      pathname: location.pathname,
      search: params.toString(),
    });
    handleSetState({ activeDetail: active });
  };

  useEffect(() => {
    const active = params.get("tab");
    if (active) {
      handleSetState({ activeDetail: active });
    } else {
      activeSwitch(activeDetail);
    }
  });

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
              <img src={supportedChains[chainID]?.icon} alt="blockchain" />
              <div>{userId?.length > 25 ? breakAddress(userId) : userId}</div>
              <LinkIcon onClick={handleExplorer} />
            </div>
          </div>
        </div>
        {userId === account && (
          <Link to="/profile/settings">
            <div className={classes.editProfile}>Edit Profile</div>
          </Link>
        )}
      </div>

      <div className={classes.wrapper}>
        <section className={classes.header}>
          <div className={classes.details}>
            <div
              onClick={() => activeSwitch("sale")}
              className={`${classes.detail} ${activeDetail === "sale" && classes.active}`}
            >
              <p>On sale</p>
              <span>{Array.isArray(onSale) ? onSale.length : 0}</span>
            </div>
            <div
              onClick={() => activeSwitch("collected")}
              className={`${classes.detail} ${activeDetail === "collected" && classes.active}`}
            >
              <p>Collected</p>
              <span>{Array.isArray(collectedNfts) ? collectedNfts.length : 0}</span>
            </div>
            <div
              onClick={() => activeSwitch("created")}
              className={`${classes.detail} ${activeDetail === "created" && classes.active}`}
            >
              <p>Created</p>
              <span>
                {" "}
                {Array.isArray(myCollections) || Array.isArray(createdNfts)
                  ? [...(createdNfts || []), ...(myCollections || [])].length
                  : 0}
              </span>
            </div>
          </div>
        </section>

        <section className={classes.main}>
          <div className={classes.searchAndFilter}>
            <SearchBar onSearch={(value) => searchHandler(value)} />
            <DashboardFilterDropdown onFilter={handleFilterDropdown} />
          </div>

          {filteredCollection?.length > 0 ? (
            activeDetail === "sale" ? (
              <div className={classes.overview}>
                {filteredCollection.slice(pageVisited, pageVisited + perPage).map((nft) => (
                  <SingleNftCard key={nft.Id} nft={nft} fromDashboard="onSale" userId={userId} />
                ))}
              </div>
            ) : activeDetail === "created" ? (
              <div className={classes.overview}>
                {filteredCollection.slice(pageVisited, pageVisited + perPage).map((nft) => {
                  if (nft.nfts) {
                    return <CollectionNftCard key={nft.Id} collection={nft} fromDashboard />;
                  }
                  return <SingleNftCard key={nft.Id} nft={nft} listed={false} fromDashboard="onSale" userId={userId} />;
                })}
              </div>
            ) : activeDetail === "collected" ? (
              <div className={classes.overview}>
                {filteredCollection.slice(pageVisited, pageVisited + perPage).map((nft) => (
                  <SingleNftCard key={nft.Id} nft={nft} fromDashboard="collected" userId={userId} />
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
              {[...new Array(5)].map((id, idx) => (
                <div key={idx}>
                  <Skeleton count={1} height={200} />
                  <br />
                  <Skeleton count={1} height={30} />
                  <br />
                  <Skeleton count={1} height={30} />
                </div>
              ))}
            </div>
          )}
          {filteredCollection?.length > 0 && (
            <Pagination
              handleSetState={handleSetState}
              paginatePage={paginatePage}
              pageNumber={pageNumber}
              perPage={perPage}
              filteredCollection={filteredCollection}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
