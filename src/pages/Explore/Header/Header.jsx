import Skeleton from 'react-loading-skeleton';
import React, { useEffect, useRef } from 'react';
import classes from './Header.module.css';
import listIcon from '../../../assets/icon-list.svg';
import stackIcon from '../../../assets/icon-stack.svg';
import tradeIcon from '../../../assets/icon-trade.svg';
import Copy from '../../../components/copy/copy';

const Header = ({ collection, getHeight }) => {
  const domMountRef = useRef(false);
  const headerRef = useRef(null);
  const {
    name, owner, price, imageUrl, numberOfNfts, description,
  } = collection;

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (domMountRef.current) {
        const res = headerRef.current.getBoundingClientRect().height;
        getHeight(res);
      } else {
        domMountRef.current = true;
      }
    });
    getHeight(500);
  }, []);

  return (
    <header ref={headerRef} className={classes.container}>
      <div className={classes.wrapper}>
        {
          imageUrl ? <img className={classes.imageContainer} src={imageUrl} alt="asset" /> : (
            <div className={classes.imageLoadingContainer}>
              <Skeleton count={1} height={200} />
            </div>
          )
        }
        <div className={classes.collectionName}>{name}</div>
        <div className={classes.creator}>
          {
            owner
              ? (
                <div>
                  Created by
                  {' '}
                  <span className={classes.address}><Copy message={owner} placeholder={owner && `${owner.substring(0, 5)}...${owner.substring(owner.length - 4, owner.length)}`} /></span>
                </div>
              )
              : (
                <div className={classes.skeleton}>
                  <Skeleton count={1} height={16} />
                </div>
              )
          }
        </div>
        <div className={classes.description}>
          {
            description || (
            <div className={classes.skeleton}>
              <Skeleton count={2} height={20} />
            </div>
            )
          }
        </div>
      </div>

      <div className={classes.details}>
        <div className={classes.detailContentWrapper}>
          <div className={classes.floorPrice}>
            <div className={classes.floor}>FLOOR PRICE</div>
            <div className={classes.price}>
              {price}
              {' '}
              <span className={classes.chain}>Algo</span>
            </div>
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
  );
};

export default Header;
