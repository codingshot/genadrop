import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { breakAddress, getCreator } from "../NFTDetail-script";
import classes from "./NFT.module.css";
import { ReactComponent as ShareIcon } from "../../../assets/icon-share.svg";
import Share from "./Share";
// import { ReactComponent as MoreIcon } from "../../../assets/icon-more.svg";

const NFT = ({ nftDetails }) => {
  const { name, image_url, owner, collection_name } = nftDetails;
  const [creator, setCreator] = useState("");
  const [share, setShare] = useState(false);

  const fetchCreator = async () => {
    const data = await getCreator(owner);
    setCreator(data);
  };

  useEffect(() => {
    fetchCreator();
  }, []);

  return (
    <div className={classes.container}>
      <Share share={share} setShare={setShare} />
      <div className={classes.heading}>
        <div className={classes.nftName}>{name}</div>
        <div className={classes.shareSection}>
          <div className={classes.shareIconContainer}>
            <ShareIcon onClick={() => setShare(true)} className={classes.shareIcon} />
          </div>
          {/* <div className={classes.moreIconContainer}>
            <MoreIcon className={classes.moreIcon} />
          </div> */}
        </div>
      </div>
      <img src={image_url} alt="" />
      <div className={classes.details}>
        <div className={classes.detail}>
          {owner && (
            <>
              <div className={classes.title}>Created by</div>
              <div className={classes.subSection}>
                <div className={classes.placeholder} />
                <Link to={`/profile/${nftDetails?.chain}/${owner}`} className={`${classes.name} ${classes.active}`}>
                  {breakAddress(owner)}
                </Link>
              </div>
            </>
          )}
        </div>
        {collection_name && collection_name !== "Genadrop 1 of 1" ? (
          <div className={classes.detail}>
            <div className={classes.title}>Collection</div>
            <div className={classes.name}>{collection_name}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NFT;
