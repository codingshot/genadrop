import { useEffect, useState } from "react";
import { breakAddress, getCreator } from "../NFTDetail-script";
import classes from "./NFT.module.css";

const NFT = ({ nftDetails }) => {
  const { name, image_url, owner, collection_name } = nftDetails;
  const [creator, setCreator] = useState("");

  const fetchCreator = async () => {
    const data = await getCreator(owner);
    console.log({ data });
    setCreator(data);
  };

  useEffect(() => {
    fetchCreator();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.title}>{name}</div>
        <div className={classes.shareSection}>
          <div className={classes.share}>"@"</div>
          <div className={classes.dots}>...</div>
        </div>
      </div>
      <img src={image_url} alt="" />
      <div className={classes.details}>
        <div className={classes.detail}>
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
        </div>
        {false ? (
          <div className={classes.detail}>
            <div className={classes.title}>Collection</div>
            <div>{collection_name}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NFT;
