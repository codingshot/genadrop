import classes from './Header.module.css';
import listIcon from '../../../assets/icon-list.svg';
import stackIcon from '../../../assets/icon-stack.svg';
import tradeIcon from '../../../assets/icon-trade.svg';
import Skeleton from 'react-loading-skeleton';
import Copy from '../../../components/copy/copy';
import { useEffect, useRef } from 'react';

const Header = ({ collection, getHeight }) => {
  const headerRef = useRef(null)
  const { name, owner, price, imageUrl, numberOfNfts, description } = collection;

  useEffect(() => {
    try {
      window.addEventListener("resize", e => {
        let res = headerRef.current.getBoundingClientRect().height;
        getHeight(res)
      });
      let res = headerRef.current.getBoundingClientRect().height;
      getHeight(res + 50);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <header ref={headerRef} className={classes.container}>
      <div className={classes.wrapper}>
        {
          imageUrl ? <img className={classes.imageContainer} src={imageUrl} alt="asset" /> : <div className={classes.imageLoadingContainer}>
            <Skeleton count={1} height={200} />
          </div>
        }
        <div className={classes.collectionName}>{name}</div>
        <div className={classes.creator}>
          created by
          <Copy message={owner} placeholder={owner && `${owner.substring(0, 5)}...${owner.substring(owner.length - 4, owner.length)}`} />
        </div>
        <div className={classes.description}>
          {description}
        </div>
      </div>

      <div className={classes.details}>
        <div className={classes.detailContentWrapper}>
          <div className={classes.floorPrice}>
            <div className={classes.floor}>FLOOR PRICE</div>
            <div className={classes.price}>{price} <span className={classes.chain}>Algo</span></div>
          </div>
          <img src={stackIcon} alt="" />
        </div>

        <div className={classes.detailContentWrapper}>
          <div className={classes.floorPrice}>
            <div className={classes.floor}>TOTAL VOLUME TRADED</div>
            <div className={classes.price}>0</div>
          </div>
          <img src={tradeIcon} alt="" />
        </div>

        <div className={classes.detailContentWrapper}>
          <div className={classes.floorPrice}>
            <div className={classes.floor}>TOTAL LIST COUNT</div>
            <div className={classes.price}>{numberOfNfts}</div>
          </div>
          <img src={listIcon} alt="" />
        </div>
      </div>

    </header>
  )
}

export default Header