import React from 'react';
import classes from './nft.module.css';
const NFT = (data) => {



    return (

        data.data.map((nft, idx) => {
            return (
                <div key={idx} className={classes.collectionItem}>
                    <img src={nft.image_url} alt="" />
                    <span className={classes.itemName}>{nft.name}</span>
                    <span className={classes.collectionName}>{nft.collection_name}</span>
                    <div className={classes.itemPrice}>Price <span>{nft.price} ALGO</span></div>
                </div>
            )
        })
    )

};

export default NFT;