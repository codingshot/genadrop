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
import walletIcon from "../../assets/wallet-icon.png";
import twitterIcon from "../../assets/twitter.svg";
import facebookIcon from "../../assets/facebook.svg";
import whatsappIcon from "../../assets/whatsapp.svg";
import descriptionIcon from "../../assets/description-icon.png";
import detailsIcon from "../../assets/details.png";
import Search from "../../components/Nft-details/history/search";
import { readNftTransaction } from "../../utils/firebase";
import algoLogo from "../../assets/icon-algo.svg";
import { setOverlay, setNotification } from "../../gen-state/gen.actions";
import supportedChains from "../../utils/supportedChains";
import SimilarNFTs from "../../components/similarNFTs/similarNFTs";
import { auroraUserData, celoUserData, polygonUserData } from "../../renderless/fetch-data/fetchUserGraphData";

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

  const Explorers = [
    { algo: [{ testnet: "https://testnet.algoexplorer.io/" }, { mainnet: "https://algoexplorer.io/tx/" }] },
    { matic: [{ testnet: "https://mumbai.polygonscan.com/tx/" }, { mainnet: "https://polygonscan.com/tx/" }] },
    {
      near: [{ testnet: "https://testnet.aurorascan.dev/tx/" }, { mainnet: "https://explorer.mainnet.aurora.dev/tx/" }],
    },
    {
      celo: [
        { mainnet: "https://alfajores-blockscout.celo-testnet.org/tx/" },
        { testnet: "https://explorer.celo.org/tx/" },
      ],
    },
  ];

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
        });
        dispatch(setOverlay(false));
        document.documentElement.scrollTop = 0;
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
          });
        } else if (supportedChains[Number(nftChainId)].chain === "Aurora") {
          const [auroraData, trHistory] = await auroraUserData(nftId);
          if (!auroraData) return;
          handleSetState({
            nftDetails: auroraData,
            isLoading: false,
            transactionHistory: trHistory,
          });
        } else if (supportedChains[Number(nftChainId)].chain === "Polygon") {
          const [polygonData, trHistory] = await polygonUserData(nftId);
          if (!polygonData) return history.goBack();
          handleSetState({
            nftDetails: polygonData,
            isLoading: false,
            transactionHistory: trHistory,
          });
        }
      } catch (error) {
        console.log({ error });
      }
      dispatch(setOverlay(false));
    })();
    document.documentElement.scrollTop = 0;
  }, [nftId]);

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
  );

  const attributesItem = {
    icon: descriptionIcon,
    title: "Attributes",
    content: attributeContent(),
  };

  const similar = {
    icon: "",
    title: "Similar NFTs",
    content: <SimilarNFTs data={nftDetails} />,
  };

  return (
    <div className={classes.container}>
      <div className={classes.section1}>
        <div className={classes.v_subsection1}>
          <img className={classes.nft} src={nftDetails.image_url} alt="" />

          <div className={classes.feature}>
            <DropItem key={1} item={attributesItem} id={1} dropdown={dropdown} handleSetState={handleSetState} />
          </div>
        </div>
        <div className={classes.v_subsection2}>
          <div className={classes.feature}>
            <div className={classes.mainDetails}>
              <div className={classes.collectionHeader}>
                <div className={classes.nftId}>{nftDetails.name}</div>
              </div>

              <div className={classes.icons}>
                <svg
                  onClick={() => {
                    handleSetState({ showSocial: true });
                  }}
                  className={`${classes.icon}`}
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 14.0781C15.8125 14.0781 16.5 14.375 17.0625 14.9688C17.625 15.5312 17.9062 16.2031 17.9062 16.9844C17.9062 17.7969 17.6094 18.5 17.0156 19.0938C16.4531 19.6562 15.7812 19.9375 15 19.9375C14.2188 19.9375 13.5312 19.6562 12.9375 19.0938C12.375 18.5 12.0938 17.7969 12.0938 16.9844C12.0938 16.6719 12.1094 16.4531 12.1406 16.3281L5.0625 12.2031C4.46875 12.7344 3.78125 13 3 13C2.1875 13 1.48438 12.7031 0.890625 12.1094C0.296875 11.5156 0 10.8125 0 10C0 9.1875 0.296875 8.48438 0.890625 7.89062C1.48438 7.29688 2.1875 7 3 7C3.78125 7 4.46875 7.26562 5.0625 7.79688L12.0938 3.71875C12.0312 3.40625 12 3.17188 12 3.01562C12 2.20312 12.2969 1.5 12.8906 0.90625C13.4844 0.3125 14.1875 0.015625 15 0.015625C15.8125 0.015625 16.5156 0.3125 17.1094 0.90625C17.7031 1.5 18 2.20312 18 3.01562C18 3.82812 17.7031 4.53125 17.1094 5.125C16.5156 5.71875 15.8125 6.01562 15 6.01562C14.25 6.01562 13.5625 5.73438 12.9375 5.17188L5.90625 9.29688C5.96875 9.60938 6 9.84375 6 10C6 10.1562 5.96875 10.3906 5.90625 10.7031L13.0312 14.8281C13.5938 14.3281 14.25 14.0781 15 14.0781Z"
                    fill="#707A83"
                  />
                </svg>
              </div>
            </div>
            <div className={classes.priceSection}>
              <span className={classes.title}>Current price</span>
              <span className={classes.price}>
                <img className={classes.iconImg} src={chainIcon} alt="" />
                <p className={classes.tokenValue}>
                  {nftDetails.price} {chainSymbol || ""}
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
                    Not Listed!
                  </button>
                )}
              </div>
            ) : (
              <div className={classes.btns}>
                {nftDetails.sold ? (
                  <>
                    <button className={classes.sold} disabled={nftDetails.sold}>
                      SOLD!
                    </button>
                  </>
                ) : (
                  <>
                    {supportedChains[nftDetails.chain]?.chain !== "Algorand" ? (
                      <button className={classes.buy} disabled={nftDetails.sold} onClick={() => buyGraphNft(buyProps)}>
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
          {/* PRICE HISTORY */}
          {/* <div className={classes.feature}>
            <DropItem
              key={2}
              item={graph}
              id={2}
              dropdown={dropdown}
              handleSetState={handleSetState}
            />
          </div> */}
          <div className={classes.feature}>
            <DropItem key={3} item={description} id={3} dropdown={dropdown} handleSetState={handleSetState} />
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className={classes.section}>
        <div className={classes.heading}>
          <h3>Transaction History</h3>
        </div>

        <div className={classes.history}>
          <Search data={transactionHistory} chain={nftDetails?.chain ? nftDetails.chain : ""} />
        </div>
      </div>
      <div className={classes.section}>
        <div className={classes.heading}>
          <h3>Price History</h3>
        </div>
        <div className={classes.tableContainer}>{graph.content}</div>
      </div>

      <div className={classes.section}>
        <div className={classes.heading}>
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

      <div className={classes.feature}>
        <DropItem key={4} item={similar} id={4} dropdown={dropdown} handleSetState={handleSetState} />
      </div>
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
