/* eslint-disable react/no-array-index-key */
import React from "react";
import { Link } from "react-router-dom";
import SingleNftCard from "../../../components/Marketplace/SingleNftCard/SingleNftCard";
import classes from "./More.module.css";

const More = ({ params, collection, _1of1 }) => {
  const { collectionName } = params;
  return (
    <div className={classes.container}>
      <div className={classes.heading}>{collectionName ? "More from this collection" : "Similar NFTs"}</div>
      <div className={classes.display}>
        {collectionName
          ? collection.map((nft, idx) => (
              <SingleNftCard
                fromDetails
                collectionNft={{ name: collectionName }}
                use_width={16 * 20}
                nft={nft}
                key={idx}
              />
            ))
          : Object.values(_1of1).map((nft, idx) => <SingleNftCard use_width={16 * 20} nft={nft} key={idx} />)}
      </div>
      <div className={classes.btnContainer}>
        <Link
          className={classes.btn}
          to={collectionName ? `/marketplace/collections/${collectionName}` : "/marketplace/1of1"}
        >
          View all
        </Link>
      </div>
    </div>
  );
};

export default More;
