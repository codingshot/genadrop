import React from 'react';
import classes from './nft.module.css';
const NFT = (data) => {



    return (

        data.data.map((item) => {
            return (
                <div className={classes.collectionItem}>
                    <img src="/assets/nft-placeholder.png" alt="" />
                    <span className={classes.itemName}>#2410 Mute Auntie</span>
                    <span className={classes.collectionName}>Mute Aunties Collection</span>

                    <div className={classes.itemPrice}>Price <span>5.98 ALGO</span></div>

                </div>
            )
        })
    )

};

export default NFT;