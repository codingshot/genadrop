import React, { useState, useContext, useRef, useEffect } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import axios from "axios";
import { useHistory, useRouteMatch } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import CopyToClipboard from "react-copy-to-clipboard";
import DropItem from "../../components/Nft-details/dropItem/dropItem";
import classes from "./collectionNFT.module.css";
import Search from "../../components/Nft-details/history/search";
import shareIcon from "../../assets/icon-share.svg";
import NFT from "../../components/Nft-details/collection/nft";
import avatar from "../../assets/avatar.png";
import Graph from "../../components/Nft-details/graph/graph";
import { GenContext } from "../../gen-state/gen.context";
import { buyGraphNft, buyNft, getCeloGraphNft, getGraphCollection, getGraphNft, getTransactions } from "../../utils";
import "react-loading-skeleton/dist/skeleton.css";
import { readNftTransaction } from "../../utils/firebase";
// import bidIcon from '../../assets/bid.png';
import exportIcon from "../../assets/icon-export.svg";
import copiedIcon from "../../assets/copied.svg";
import priceIcon from "../../assets/icon-price-history.svg";
import transactionIcon from "../../assets/icon-transaction.svg";
import codeTagIcon from "../../assets/icon-code-tags.svg";
import copyIcon from "../../assets/copy-solid.svg";
import walletIcon from "../../assets/wallet-icon.png";
import twitterIcon from "../../assets/twitter.svg";
import facebookIcon from "../../assets/facebook.svg";
import instagramIcon from "../../assets/instagram.svg";
import descriptionIcon from "../../assets/description-icon.png";
import detailsIcon from "../../assets/details.png";
import supportedChains from "../../utils/supportedChains";
import { chainIdToParams } from "../../utils/chainConnect";
import { breakAddress, timeConverter } from "../../components/wallet/wallet-script";
import ExploreTransactionHistory from "../Explore/exploreTransactionHistory/exploreTransactionHistory";
import GenadropCarouselScreen from "../../components/Genadrop-Carousel-Screen/GenadropCarouselScreen";
import CollectionsCard from "../../components/Marketplace/collectionsCard/collectionsCard";

const CollectionNFT = () => {
  const {
    account,
    activeCollection,
    connector,
    mainnet,
    dispatch,
    auroraCollections,
    polygonCollections,
    celoCollections,
    chainId,
  } = useContext(GenContext);
  const {
    params: { collectionName, nftId },
  } = useRouteMatch();
  const history = useHistory();
  const wrapperRef = useRef(null);
  const [state, setState] = useState({
    dropdown: ["1", "3"],
    nftDetails: null,
    transactionHistory: null,
    showSocial: false,
    isLoading: true,
    allGraphCollectons: [],
    collection: [],
    algoPrice: 0,
    isCopied: false,
    totalPrice: 0,
    ownerName: "",
    mintedDetails: "",
    explorer:
      process.env.REACT_APP_ENV_STAGING === "false" ? "https://algoexplorer.io/" : "https://testnet.algoexplorer.io/",
  });

  const {
    dropdown,
    totalPrice,
    nftDetails,
    ownerName,
    mintedDetails,
    explorer,
    transactionHistory,
    collection,
    isLoading,
    showSocial,
    isCopied,
  } = state;

  const buyProps = {
    dispatch,
    nftDetails,
    account,
    connector,
    mainnet,
    history,
    chainId,
  };

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    if (chainIdToParams[chainId]) {
      handleSetState({ explorer: chainIdToParams[chainId].blockExplorerUrls });
    }
  });
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          handleSetState({ showSocial: false });
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(wrapperRef);

  useEffect(() => {
    const cacheCollection = JSON.parse(window.localStorage.activeCollection);
    let result = activeCollection.find((col) => col.Id === Number(nftId));
    result = result || cacheCollection ? cacheCollection[nftId] : null;
    if (result) {
      const collection = activeCollection.length ? activeCollection : Object.values(cacheCollection);
      (async function getResult() {
        const tHistory = await readNftTransaction(result.Id);

        tHistory.find((t) => {
          if (t.type === "Minting") t.price = result.price;
        });
        handleSetState({
          nftDetails: result,
          transactionHistory: tHistory,
          collection,
          isLoading: false,
        });
      })();
    }
    document.documentElement.scrollTop = 0;
  }, [nftId]);

  const getAllCollectionChains = () => {
    return !auroraCollections && !polygonCollections && !celoCollections
      ? null
      : [...(auroraCollections || []), ...(polygonCollections || []), ...(celoCollections || [])];
  };

  useEffect(() => {
    (async function getGraphResult() {
      const allCollections = getAllCollectionChains();
      // filtering to get the unqiue collection
      const filteredCollection = allCollections?.filter((col) => col?.Id === collectionName);
      if (filteredCollection) {
        // filtering to get the unique nft

        const filteredId = filteredCollection[0]?.nfts?.filter((col) => col?.id === nftId);
        if (filteredId) {
          const result = await getCeloGraphNft(filteredId[0], collectionName);

          const trHistory = await getTransactions(filteredId[0]?.transactions);
          const collectionData = await getGraphCollection(filteredCollection[0].nfts, filteredCollection[0]);

          trHistory.find((t) => {
            if (t.type === "Minting") t.price = result[0].price;
          });
          handleSetState({
            nftDetails: result[0],
            collection: collectionData,
            transactionHistory: trHistory,
            isLoading: false,
          });
        }
      }
    })();
  }, [auroraCollections, polygonCollections, celoCollections, nftId]);

  useEffect(() => {
    if (nftDetails?.chain) {
      axios
        .get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${supportedChains[nftDetails.chain]?.id}&vs_currencies=usd`
        )
        .then((res) => {
          const value = Object.values(res.data)[0].usd;
          handleSetState({ totalPrice: value * nftDetails.price });
        });
    }
  }, [nftDetails]);

  if (isLoading) {
    return (
      <div className={classes.menu}>
        <div className={classes.left}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={40} />
          <br />
          <Skeleton count={1} height={40} />
        </div>

        <div className={classes.right}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={40} />
          <br />
          <Skeleton count={1} height={40} />
        </div>
        <div className={classes.fullLegnth}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={200} />
        </div>
      </div>
    );
  }

  const description = {
    icon: detailsIcon,
    title: "Description",
    content: `${nftDetails.ipfs_data.description}`,
  };

  const graph = {
    icon: detailsIcon,
    title: "Price History",
    content: <Graph details={transactionHistory} />,
  };

  const attributeContent = () => (
    <div className={classes.attributesContainer}>
      {nftDetails.ipfs_data.properties.map((attribute, idx) => (
        <div key={idx} className={classes.attribute}>
          <span className={classes.title}>{attribute.trait_type}</span>
          <span className={classes.description}>{attribute.value}</span>
        </div>
      ))}
    </div>
  );

  const attributesItem = {
    icon: descriptionIcon,
    title: "Attributes",
    content: attributeContent(),
  };

  const icons = [
    {
      icon: facebookIcon,
      link: "https://www.facebook.com",
    },
    {
      icon: instagramIcon,
      link: "https://www.instagram.com",
    },
    {
      icon: twitterIcon,
      link: "https://www.twitter.com/mpa",
    },
  ];
  const onCopyText = () => {
    handleSetState({ isCopied: true });
    setTimeout(() => {
      handleSetState({ isCopied: false });
    }, 1000);
  };

  return (
    <div className={classes.container}>
      <div className={classes.section1}>
        <div className={classes.v_subsection1}>
          <div className={classes.imgContainer}>
            <div className={classes.imgTop}>
              <div className={classes.nftName}>{nftDetails.name}</div>
              <div>
                <img
                  src={shareIcon}
                  onClick={() => handleSetState({ showSocial: true })}
                  alt=""
                  className={classes.social}
                />
              </div>
            </div>
            <img className={classes.nft} src={nftDetails.image_url} alt="" />

            <div className={classes.details}>
              <div className={classes.detail}>
                <div className={classes.detailTitle}>Owned By</div>
                <div className={classes.ownerProfile}>
                  <img src={avatar} alt="owners" className={classes.avatar} />
                  <span className={classes.nftName}>{ownerName ? ownerName : breakAddress(nftDetails.owner)}</span>
                </div>
              </div>
              <div className={classes.detail}>
                <div className={classes.detailTitle}>Nft Name</div>
                <div className={classes.nftName}>{nftDetails.collection_name}</div>
              </div>
            </div>
          </div>
          <div className={classes.shadowBox}>
            <div className={classes.title}>Details</div>
            <div className={classes.line}>
              <div className={classes.key}>Mint Address</div>
              <div className={classes.value}>
                {breakAddress(nftDetails.owner)}
                <a href={explorer + "address/" + nftDetails.owner} target="_blank" rel="noopener noreferrer">
                  <img src={exportIcon} alt="explorer" className={classes.explorer} />
                </a>
              </div>
            </div>
            <div className={classes.line}>
              <div className={classes.key}>Minted</div>
              {/* <div className={classes.value}>{timeConverter(mintedDetails.txDate.seconds)}</div> */}
            </div>
            <div className={classes.line}>
              <div className={classes.key}>Creator Royalty</div>
              <div className={classes.value}>7%</div>
            </div>
            <div className={classes.line}>
              <div className={classes.key}>Genadrop Royalty</div>
              <div className={classes.value}>10%</div>
            </div>
            <div className={classes.line}>
              <div className={classes.totalKey}>Total</div>
              <div className={classes.value}>17%</div>
            </div>
          </div>
        </div>
        <div className={classes.v_subsection2}>
          <div>
            <span className={classes.priceTitle}>CURRENT PRICE</span>
            <div className={classes.left}>
              <div className={classes.priceSection}>
                <span className={classes.price}>
                  <img className={classes.iconImg} src={supportedChains[nftDetails.chain].icon} alt="" />
                  <p className={classes.tokenValue}>
                    {parseInt(nftDetails.price).toFixed(2)} {supportedChains[nftDetails.chain].symbol || ""}
                  </p>
                  {nftDetails?.price === 0 ||
                    (nftDetails?.price === null ? (
                      <></>
                    ) : (
                      <>
                        <span className={classes.usdValue}>(${totalPrice.toFixed(2)})</span>
                      </>
                    ))}
                </span>
              </div>
              {nftDetails?.price === 0 || nftDetails.price === null ? (
                <div className={classes.btns}>
                  {account === nftDetails.owner ? (
                    <button
                      onClick={() => history.push(`/marketplace/1of1/list/${nftDetails.chain}/${nftDetails.Id}`)}
                      className={classes.buy}
                    >
                      List
                    </button>
                  ) : (
                    <button className={classes.sold} disabled={nftDetails.sold}>
                      Not Listed
                    </button>
                  )}
                </div>
              ) : (
                <div className={classes.btns}>
                  {nftDetails.sold ? (
                    <>
                      <button className={classes.sold} disabled={nftDetails.sold}>
                        SOLD
                      </button>
                    </>
                  ) : (
                    <>
                      {supportedChains[nftDetails.chain]?.chain !== "Algorand" ? (
                        <button
                          className={classes.buy}
                          disabled={nftDetails.sold}
                          onClick={() => buyGraphNft(buyProps)}
                        >
                          Buy now
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={classes.buy}
                          disabled={nftDetails.sold}
                          onClick={() => buyNft(buyProps)}
                        >
                          Buy now
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={classes.shadowBox}>
            <div className={classes.title}>Description</div>
            <div className={classes.description}>{nftDetails.description}</div>
          </div>

          <div className={classes.shadowBox}>{attributeContent()}</div>
        </div>
      </div>
      <div className={classes.sectionHistory}>
        <div className={classes.heading}>
          <img src={priceIcon} alt="" />
          <h3>Price History</h3>
        </div>
        <div className={classes.tableContainer}>{graph.content}</div>
      </div>
      {/* TRANSACTION HISTORY */}
      <div className={classes.history}>
        {/* <div className={classes.section}>
          <div className={classes.heading}>
            <img src={transactionIcon} alt="" />
            <h3>Transaction History</h3>
          </div>

          <div className={classes.history}>
            <Search data={transactionHistory} chain={nftDetails?.chain ? nftDetails.chain : ""} />
          </div>
        </div> */}

        <div className={classes.data}>
          <div className={classes.txHistory}>
            <ExploreTransactionHistory
              data={transactionHistory}
              chain={nftDetails?.chain ? nftDetails.chain : ""}
              fromCollection
            />
          </div>
          <div className={classes.sectioncode}>
            <div className={classes.heading}>
              <img src={codeTagIcon} alt="" />
              <h3>Meta Data</h3>
            </div>
            <div className={classes.code}>
              <CopyBlock
                language="json"
                text={JSON.stringify(nftDetails.properties, null, 2)}
                showLineNumbers={false}
                theme={dracula}
                wrapLines
                codeBlock
              />
            </div>
          </div>
        </div>
      </div>
      <div className={classes.title}>More from this collection</div>
      <GenadropCarouselScreen cardWidth={16 * 20} gap={16}>
        {collection?.filter((e) => e.name !== nftDetails.name)?.length ? (
          collection
            ?.filter((e) => e.name !== nftDetails.name)
            .map((collection, idx) => <CollectionsCard useWidth="20em" key={idx} collection={collection} />)
        ) : !filteredCollection ? (
          <NotFound />
        ) : (
          [...new Array(4)].map((_, idx) => (
            <div className={classes.skeleton} useWidth="20em" key={idx}>
              <Skeleton count={1} height={250} />
              <br />
              <Skeleton count={1} height={30} />
              <br />
              <Skeleton count={1} height={30} />
            </div>
          ))
        )}
      </GenadropCarouselScreen>

      {showSocial ? (
        <div>
          <div ref={wrapperRef} className={classes.share}>
            <div className={classes.copy}>
              <input type="text" value={window.location.href} readOnly className={classes.textArea} />
              <CopyToClipboard text={window.location.href} onCopy={onCopyText}>
                <div className={classes.copy_area}>
                  {!isCopied ? (
                    <img className={classes.shareicon} src={copyIcon} alt="" />
                  ) : (
                    <img className={classes.shareicon} src={copiedIcon} alt="" />
                  )}
                </div>
              </CopyToClipboard>
            </div>
            <div className={classes.shareContent}>
              {icons.map((icon, idx) => (
                <a key={idx} href={icon.link} target="_blank" rel="noreferrer">
                  <img
                    className={classes.shareIcon}
                    onClick={() => handleSetState({ text: icon.link })}
                    src={icon.icon}
                    alt=""
                  />
                </a>
              ))}
            </div>
          </div>
          <div className={classes.shareContent}>
            {icons.map((icon, idx) => (
              <a key={idx} href={icon.link} target="_blank" rel="noreferrer">
                <img
                  className={classes.shareIcon}
                  onClick={() => handleSetState({ text: icon.link })}
                  src={icon.icon}
                  alt=""
                />
              </a>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CollectionNFT;
