import React from "react";
import Skeleton from "react-loading-skeleton";
import NftCard from "../../../components/Marketplace/NftCard/NftCard";
import classes from "./Menu.module.css";

const Menu = ({ NFTCollection, loadedChain, toggleFilter }) => {
  return (
    <div className={`${classes.menu} ${toggleFilter && classes.resize}`}>
      {NFTCollection
        ? NFTCollection.map((nft, idx) => <NftCard key={nft.Id} nft={nft} index={idx} loadedChain={loadedChain} />)
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
