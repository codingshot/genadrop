import SingleNftCard from "../../../components/Marketplace/SingleNftCard/SingleNftCard";
import classes from "./More.module.css";

const More = ({ params, collection, _1of1 }) => {
  const { collectionName } = params;

  return (
    <div className={classes.container}>
      <div className={classes.heading}>More from this collection</div>
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
    </div>
  );
};

export default More;
