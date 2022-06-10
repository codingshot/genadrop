import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import NftCard from "../../../components/Marketplace/NftCard/NftCard";
import classes from "./Menu.module.css";
import supportedChains from "../../../utils/supportedChains";

const Menu = ({ NFTCollection, loadedChain, toggleFilter, chain }) => {
  const [chinPrice, setChainPrice] = useState(0);
  useEffect(() => {
    if (chain) {
      axios
        .get(`https://api.coingecko.com/api/v3/simple/price?ids=${supportedChains[chain].id}&vs_currencies=usd`)
        .then((res) => {
          const value = Object.values(res.data)[0].usd;
          setChainPrice(value);
        });
    }
  }, [chain]);
  const loadNFTs = () => {
    // for (let index = 0; index < Math.ceil(NFTCollection.length / 100) + 1; index += 1) {
    //   console.log(index * 100);
    //   console.log((index + 1) * 100);
    const index = 0;
    setTimeout(
      () =>
        NFTCollection.slice(index * 100, (index + 1) * 100).map((nft, idx) => (
          <NftCard chinPrice={chinPrice} key={nft.Id} nft={nft} index={idx} loadedChain={loadedChain} />
        )),
      1000 * index
    );
    // }
  };
  return (
    <div className={`${classes.menu} ${toggleFilter && classes.resize}`}>
      {NFTCollection
        ? NFTCollection.map((nft, idx) => (
            <NftCard chinPrice={chinPrice} key={nft.Id} nft={nft} index={idx} loadedChain={loadedChain} />
          ))
        : [...new Array(8)]
            .map((_, idx) => idx)
            .map((id) => (
              <div className={classes.loader} key={id}>
                <Skeleton count={1} height={200} />
                <br />
                <Skeleton count={1} height={40} />
              </div>
            ))}
    </div>
  );
};

export default Menu;
