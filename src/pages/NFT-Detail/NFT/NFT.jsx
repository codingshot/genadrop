import { useEffect, useState } from "react";
import { breakAddress, getCreator } from "../NFTDetail-script";
import classes from "./NFT.module.css";
import { ReactComponent as ShareIcon } from "../../../assets/icon-share.svg";
// import { ReactComponent as MoreIcon } from "../../../assets/icon-more.svg";

const NFT = ({ nftDetails }) => {
  const { name, image_url, owner, collection_name } = nftDetails;
  const [creator, setCreator] = useState("");

  const fetchCreator = async () => {
    const data = await getCreator(owner);
    console.log({ data, owner });
    setCreator(data);
  };

  useEffect(() => {
    fetchCreator();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.nftName}>{name}</div>
        <div className={classes.shareSection}>
          <div className={classes.shareIconContainer}>
            <ShareIcon className={classes.shareIcon} />
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
                {Object.keys(creator).length ? (
                  <>
                    <img className={classes.thumbnail} src={image_url} alt="" />
                    <div className={classes.name}>{breakAddress(owner)}</div>
                  </>
                ) : (
                  <>
                    <div className={classes.placeholder} />
                    <div className={classes.name}>{breakAddress(owner)}</div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        {collection_name ? (
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
