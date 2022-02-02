import React from 'react';
import { useState } from 'react';
import DropItem from './dropItem/dropItem';
import classes from './singleNFT.module.css';


const Orgs = () => {

    const [state, setState] = useState({
        dropdown: ''
    })
    const { dropdown } = state;

    const handleSetState = payload => {
        setState(state => ({ ...state, ...payload }))
    }

    const Items = [
        {
            icon: "/assets/description-icon.png",
            title: "Description",
            content: "When you’re making a generative NFT collection, each final image will be made out of different traits that can be mixed and matched. First of all you must have basic assets for layer combination generation. Example: the main background layer, body, and few traits. For more information watch this demo"
        },
        {
            icon: "/assets/collection-icon.png",
            title: "About Collection",
            content: "Each layer in the image represents a trait (Hair, Outfit, etc), and each trait will have many variants (Short Purple Hair, Long Purple Hair, etc). Draw each variant on a transparent .PNG file so all the layers will be visible. Each image should be the same size, You can add conflict rules to selected layers. Preview and download your collection."
        },
        {
            icon: "/assets/details-icon.png",
            title: "Details",
            content: "Connect your wallet and upload your collection zip folder, previously made in the create section of the Genadrop dApp. as json file after which you will now upload your Metadata to ipfs and select the blockchain of your choice, add price and Mint."
        },

    ]

    const collectionName = "Mute Aunties Collections";
    const nftName = "Mute Aunties #7289"


    return (
        <div className={classes.main}>
            <div className={classes.section}>
                <div className={classes.v_subsection1}>
                    <img className={classes.nft} src="/assets/nft-placeholder.png" alt="" />



                    <section className={classes.faq}>
                        {Items.map((item, index) => (
                            < DropItem key={index} item={item} id={index} dropdown={dropdown} handleSetState={handleSetState} />

                        ))}

                    </section>

                </div>
                <div className={classes.v_subsection2}>
                    <div className={classes.feature}>
                        <div className={classes.mainDetails}>
                            <div className={classes.collectionName}>
                                {collectionName}
                            </div>
                            <div className={classes.nftName}>
                                <div className={classes.nftId}>{nftName}</div>
                                <div className={classes.icons}>
                                    <img className={`${classes.icon} ${classes.refresh}`} src="/assets/refresh-icon.png" alt="" />
                                    <img className={`${classes.icon} ${classes.share}`} src="/assets/share-icon.png" alt="" />
                                    <img className={`${classes.icon} ${classes.dots}`} src="/assets/share-icon.png" alt="" />
                                    {/* <img className={classes.icon} src="/assets/v-dots-icon.png" alt="" /> */}
                                </div>
                            </div>
                        </div>
                        <div className={classes.priceSection}>
                            <span className={classes.title}>Current price</span>
                            <span className={classes.price}>
                                <img src="/assets/algo-logo.png" alt="" />
                                <p className={classes.tokenValue}>5.94</p>
                                <span className={classes.usdValue}>($312.34)</span>
                            </span>
                        </div>

                        <button className={classes.buy}><img src="/assets/wallet-icon.png" alt="" />Buy now</button>
                        <button className={classes.buy}><img src="/assets/wallet-icon.png" alt="" />Buy now</button>


                    </div>
                    <div className={classes.feature}></div>
                    <div className={classes.feature}></div>
                </div>
            </div >
            <div className={classes.section}></div>
            <div className={classes.section}></div>
            <div className={classes.section}></div>
        </div >
    )
}

export default Orgs;