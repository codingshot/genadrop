import React from 'react';
import classes from './nft.module.css';
import { Link, useRouteMatch } from 'react-router-dom';

const NFT = (data) => {


    const match = useRouteMatch();
    // const newPath = match.url.split('/').slice(0, -1).join('/')

    return (

        data.data.map((nft, idx) => {
            console.log(match.url);
            return (
                <Link to={`${match.url.split('/').slice(0, -1).join('/')}/${nft.name}`} >
                    <div key={idx} className={classes.collectionItem}>
                        <img src={nft.image_url} alt="" />
                        <span className={classes.itemName}>{nft.name}</span>
                        <span className={classes.collectionName}>{nft.collection_name}</span>
                        <div className={classes.itemPrice}>Price <span>{nft.price} ALGO</span></div>
                    </div>
                </Link>

            )
        })
    )

};

export default NFT;