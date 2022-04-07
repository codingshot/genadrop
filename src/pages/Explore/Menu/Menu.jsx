import React from "react";
import Skeleton from "react-loading-skeleton";
import NftCard from "../../../components/Marketplace/NftCard/NftCard";
import classes from "./Menu.module.css";

const Menu = ({ NFTCollection }) => (
  <div className={classes.menu}>
    {NFTCollection
      ? NFTCollection.map((nft, idx) => (
          <div className={classes.nftCardWrapper}>
            <NftCard key={idx} nft={nft} index={idx} />
          </div>
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

export default Menu;
