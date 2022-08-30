import React, { useContext, useEffect, useState, useRef } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { CopyBlock, dracula } from "react-code-blocks";
import axios from "axios";
import CopyToClipboard from "react-copy-to-clipboard";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { GenContext } from "../../gen-state/gen.context";
import { buyGraphNft, buyNft } from "../../utils";
import classes from "./singleNFT.module.css";
import Graph from "../../components/Nft-details/graph/graph";
import DropItem from "../../components/Nft-details/dropItem/dropItem";
import copiedIcon from "../../assets/copied.svg";
import copyIcon from "../../assets/copy-solid.svg";
import shareIcon from "../../assets/icon-share.svg";
import twitterIcon from "../../assets/twitter.svg";
import avatar from "../../assets/avatar.png";
import facebookIcon from "../../assets/facebook.svg";
import exportIcon from "../../assets/icon-export.svg";
import whatsappIcon from "../../assets/whatsapp.svg";
import descriptionIcon from "../../assets/description-icon.png";
import priceIcon from "../../assets/icon-price-history.svg";
import transactionIcon from "../../assets/icon-transaction.svg";
import codeTagIcon from "../../assets/icon-code-tags.svg";
import detailsIcon from "../../assets/details.png";
import Search from "../../components/Nft-details/history/search";
import { readNftTransaction } from "../../utils/firebase";
import algoLogo from "../../assets/icon-algo.svg";
import { setOverlay, setNotification } from "../../gen-state/gen.actions";
import supportedChains from "../../utils/supportedChains";
import SimilarNFTs from "../../components/similarNFTs/similarNFTs";
import { auroraUserData, celoUserData, polygonUserData } from "../../renderless/fetch-data/fetchUserGraphData";
import { breakAddress, timeConverter } from "../../components/wallet/wallet-script";
import { readUserProfile } from "../../utils/firebase";
import ExploreTransactionHistory from "../Explore/exploreTransactionHistory/exploreTransactionHistory";
import { chainIdToParams } from "../../utils/chainConnect";

const SingleNFT = () => {
  const { account, connector, mainnet, dispatch, singleAlgoNfts, chainId } = useContext(GenContext);
  const history = useHistory();
  const {
    params: { chainId: nftChainId, nftId },
  } = useRouteMatch();
  const wrapperRef = useRef(null);
  const shareRef = useRef();
  const [state, setState] = useState({
    dropdown: ["1", "3"],
    nftDetails: null,
    algoPrice: 0,
    isLoading: true,
    transactionHistory: null,
    showSocial: false,
    chainIcon: "",
    isCopied: false,
    chainSymbol: "",
    ownerName: "",
    mintedDetails: "",
    explorer:
      process.env.REACT_APP_ENV_STAGING === "false" ? "https://algoexplorer.io/" : "https://testnet.algoexplorer.io/",
  });
  const {
    dropdown,
    chainSymbol,
    nftDetails,
    algoPrice,
    isLoading,
    chainIcon,
    showSocial,
    isCopied,
    transactionHistory,
    ownerName,
    mintedDetails,
    explorer,
  } = state;

  const buyProps = {
    dispatch,
    account,
    connector,
    mainnet,
    nftDetails,
    history,
    chainId,
  };

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

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

  useEffect(() => {
    dispatch(setOverlay(true));
    if (Number(nftChainId) !== 4160) return;
    let nftDetails = null;
    // const cacheNftDetails = JSON.parse(window.localStorage.activeAlgoNft);
    // if (cacheNftDetails) {
    //   nftDetails = cacheNftDetails;
    // } else {
    nftDetails = singleAlgoNfts[nftId];
    // }
    if (nftDetails) {
      // window.localStorage.activeAlgoNft = JSON.stringify(nftDetails);
      (async function getNftDetails() {
        const tHistory = await readNftTransaction(nftId);
        handleSetState({
          nftDetails,
          isLoading: false,
          transactionHistory: tHistory.reverse(),
          mintedDetails: tHistory.find((e) => e.type == "Minting"),
        });
        dispatch(setOverlay(false));
        document.documentElement.scrollTop = 0;
      })();

      (async function getUsername() {
        const data = await readUserProfile(nftDetails?.owner);
        handleSetState({ ownerName: data.username });
      })();
    }
  }, [singleAlgoNfts, nftId]);

  useEffect(() => {
    dispatch(setOverlay(true));
    if (supportedChains[Number(nftChainId)].chain === "Algorand") return;
    (async function getNftDetails() {
      try {
        // Fetching for nft by Id comparing it to the chain it belongs to before displaying the Id
        if (supportedChains[Number(nftChainId)].chain === "Celo") {
          const [celoData, trHistory] = await celoUserData(nftId);
          handleSetState({
            nftDetails: celoData,
            isLoading: false,
            transactionHistory: trHistory,
            mintedDetails: trHistory.find((e) => e.type == "Minting"),
          });
        } else if (supportedChains[Number(nftChainId)].chain === "Aurora") {
          const [auroraData, trHistory] = await auroraUserData(nftId);
          if (!auroraData) return;
          handleSetState({
            nftDetails: auroraData,
            isLoading: false,
            transactionHistory: trHistory,
            mintedDetails: trHistory.find((e) => e.type == "Minting"),
          });
        } else if (supportedChains[Number(nftChainId)].chain === "Polygon") {
          const [polygonData, trHistory] = await polygonUserData(nftId);
          if (!polygonData) return history.goBack();
          handleSetState({
            nftDetails: polygonData,
            isLoading: false,
            transactionHistory: trHistory,
            mintedDetails: trHistory.find((e) => e.type == "Minting"),
          });
        }

        (async function getUsername() {
          const data = await readUserProfile(nftDetails?.owner);
          handleSetState({ ownerName: data.username });
        })();
      } catch (error) {
        console.log({ error });
      }
      dispatch(setOverlay(false));
    })();
    document.documentElement.scrollTop = 0;
  }, [nftId]);

  useEffect(() => {
    if (chainIdToParams[chainId]) {
      handleSetState({ explorer: chainIdToParams[chainId].blockExplorerUrls });
    }
  });

  useEffect(() => {
    const pair = supportedChains[nftDetails?.chain]?.coinGeckoLabel;
    if (supportedChains[Number(nftChainId)].chain !== "Algorand" && pair) {
      let value;
      axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${pair}&vs_currencies=usd`).then((res) => {
        value = Object.values(res.data)[0]?.usd;
        handleSetState({
          chainIcon: supportedChains[nftDetails.chain].icon,
          algoPrice: value ? value : 0,
          chainSymbol: supportedChains[nftDetails.chain].symbol,
        });
      });
    }
    if (supportedChains[Number(nftChainId)].chain === "Algorand") {
      axios.get("https://api.coinbase.com/v2/prices/ALGO-USD/spot").then((res) => {
        handleSetState({ algoPrice: res.data.data.amount, chainIcon: algoLogo });
      });
    }
  }, [nftDetails]);
  // share model
  const handleClickOutside = (event) => {
    if (!shareRef?.current?.contains(event.target)) {
      handleSetState({ showSocial: false });
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  const onCopyText = () => {
    handleSetState({ isCopied: true });
    setTimeout(() => {
      handleSetState({ isCopied: false });
    }, 1000);
  };

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
    content: `${nftDetails.description}`,
  };

  const graph = {
    icon: detailsIcon,
    title: "Price History",
    content: <Graph details={transactionHistory} />,
  };

  const attributeContent = () => (
    <>
      <div className={classes.title}>Attributes</div>
      <div className={classes.attributesContainer}>
        {nftDetails.properties.map((attribute, idx) => {
          return attribute.trait_type && attribute.value ? (
            <div key={idx} className={classes.attribute}>
              <span className={classes.title}>{attribute.trait_type}</span>
              <span className={classes.description}>{attribute.value}</span>
            </div>
          ) : nftDetails.properties.length === 1 ? (
            <span key={idx}> No Attributes Available</span>
          ) : (
            <></>
          );
        })}
      </div>
    </>
  );

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
              {/* <div className={classes.detail}>
                <div className={classes.detailTitle}>Nft Name</div>
                <div className={classes.nftName}>{nftDetails.name}</div>
              </div> */}
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
              <div className={classes.value}>{timeConverter(mintedDetails.txDate.seconds)}</div>
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
                  <img className={classes.iconImg} src={chainIcon} alt="" />
                  <p className={classes.tokenValue}>
                    {parseInt(nftDetails.price).toFixed(2)} {chainSymbol || ""}
                  </p>
                  {nftDetails?.price === 0 ||
                    (nftDetails?.price === null ? (
                      <></>
                    ) : (
                      <>
                        <span className={classes.usdValue}>
                          ($
                          {(nftDetails.price * algoPrice).toFixed(2)})
                        </span>
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
            <ExploreTransactionHistory data={transactionHistory} chain={nftDetails?.chain ? nftDetails.chain : ""} />
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
      <div className={classes.title}>Similar NFTs</div>
      <SimilarNFTs data={nftDetails} />
      {showSocial ? (
        <div ref={shareRef}>
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
              <FacebookShareButton url={window.location.href}>
                <img className={classes.shareIcon} src={facebookIcon} alt="facebook" />
              </FacebookShareButton>
              <TwitterShareButton url={window.location.href}>
                <img className={classes.shareIcon} src={twitterIcon} alt="twitter" />
              </TwitterShareButton>
              <WhatsappShareButton url={window.location.href}>
                <img className={classes.shareIcon} src={whatsappIcon} alt="twitter" />
              </WhatsappShareButton>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SingleNFT;
