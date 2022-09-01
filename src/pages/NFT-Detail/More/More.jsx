import CollectionNftCard from "../../../components/Marketplace/CollectionNftCard/CollectionNftCard";
import classes from "./More.module.css";

const More = () => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>More from this collection</div>
      <div className={classes.display}>
        {Array(20)
          .fill(null)
          .map((_, idx) => (
            <div key={idx} /> // <CollectionNftCard />
          ))}
      </div>
    </div>
  );
};

export default More;
