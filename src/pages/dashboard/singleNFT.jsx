import React, { useContext } from 'react';
import { useState } from 'react';
import DropItem from './dropItem/dropItem';
import classes from './singleNFT.module.css';
import { CopyBlock, dracula } from "react-code-blocks";

import Search from './history/search';
import NFT from './collection/nft';
import Graph from './graph/graph';
import { useRouteMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { getNftData } from '../../utils';

const Orgs = () => {

  const [state, setState] = useState({
    dropdown: '',
    asset: null
  })
  const { dropdown, asset } = state;

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const { collections } = useContext(GenContext)
  const { url } = useRouteMatch()

  useEffect(() => {
    if (Object.keys(collections).length) {
      const [,,collectionName, nftId] = url.split('/');    
      const collection = collections.allCollections.find(col => col.name === collectionName);
      (async function getResult() {
        let result = await getNftData(collection, nftId)
        handleSetState({
          asset: result
        })
      }())
    }
  }, [collections])

  useEffect(()=> {
    if(!asset) return
    // you can assess a single nft data inside this function;
    console.log(asset);
  },[asset])

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
      content: "Connect your wallet and upload your collection zip folder, previously made in the create section of the Genadrop dApp. as json file after which you will now upload your Metametadata to ipfs and select the blockchain of your choice, add price and Mint."
    },

  ]

  const collectionName = "Mute Aunties Collections";
  const nftName = "Mute Aunties #7289"

  const graphContent = () => {
    return (
      <div>
        ok
      </div>
    )
  }

  const graph = {
    icon: "/assets/description-icon.png",
    title: "Description",
    content: <Graph />
  }
  const Attributes = [
    {
      title: "Hair",
      description: "Brown Wig"
    },
    {
      title: "Glasses",
      description: "Circular Frame"
    },
    {
      title: "Shirt",
      description: "Blue Top"
    },
    {
      title: "Face",
      description: "Dotted Brown"
    },
    {
      title: "Background",
      description: "Matte Green"
    },
    {
      title: "Skin",
      description: "Brown"
    },

  ]

  const attributeContent = () => {
    return (
      <div className={classes.attributesContainer}>
        {Attributes.map((attribute, idx) => (
          <div key={idx} className={classes.attribute}>
            <span className={classes.title}>{attribute.title}</span>
            <span className={classes.description}>{attribute.description}</span>
          </div>
        ))}
      </div>

    )
  }

  const attributesItem = {
    icon: "/assets/description-icon.png",
    title: "Attributes",
    content: attributeContent()
  }


  const History = [
    { event: "Sale", price: 0.13, quantity: 1, from: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", to: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", date: "7 hours ago" },
    { event: "Transfer", price: "", quantity: 1, from: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", to: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", date: "7 hours ago" },
    { event: "Transfer", price: "", quantity: 1, from: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", to: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", date: "7 hours ago" },
    { event: "Minted", price: "", quantity: 2000, from: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", to: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", date: "7 hours ago" },
    { event: "Minted", price: "", quantity: 100, from: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", to: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", date: "7 hours ago" },
    { event: "Sale", price: 0.13, quantity: 1, from: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", to: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", date: "7 hours ago" },
  ]

  const metadata = {
    "name": "_52",
    "image": "image.png",
    "description": "",
    "attributes": [
      {
        "trait_type": "Bg",
        "value": "orange.png",
        "rarity": "1"
      },
      {
        "trait_type": "head",
        "value": "head.png",
        "rarity": "1"
      },
      {
        "trait_type": "body",
        "value": "outfit-2.png",
        "rarity": "1"
      },
      {
        "trait_type": "hair",
        "value": "short_hair_4-5.png",
        "rarity": "1"
      }
    ]
  }

  const nfts = [
    {
      image: "/assets/nft-placeholder.png",
      itemName: "#2410 Mute Auntie",
      collectionName: "Mute Aunties",
      price: "98.20",
      token: "ALGO"
    },
    {
      image: "/assets/nft-placeholder.png",
      itemName: "#2410 Mute Auntie",
      collectionName: "Mute Aunties",
      price: "98.20",
      token: "ALGO"
    },
    {
      image: "/assets/nft-placeholder.png",
      itemName: "#2410 Mute Auntie",
      collectionName: "Mute Aunties",
      price: "98.20",
      token: "ALGO"
    },
    {
      image: "/assets/nft-placeholder.png",
      itemName: "#2410 Mute Auntie",
      collectionName: "Mute Aunties",
      price: "98.20",
      token: "ALGO"
    },
    {
      image: "/assets/nft-placeholder.png",
      itemName: "#2410 Mute Auntie",
      collectionName: "Mute Aunties",
      price: "98.20",
      token: "ALGO"
    },
    {
      image: "/assets/nft-placeholder.png",
      itemName: "#2410 Mute Auntie",
      collectionName: "Mute Aunties",
      price: "98.20",
      token: "ALGO"
    },
    {
      image: "/assets/nft-placeholder.png",
      itemName: "#2410 Mute Auntie",
      collectionName: "Mute Aunties",
      price: "98.20",
      token: "ALGO"
    },
    {
      image: "/assets/nft-placeholder.png",
      itemName: "#2410 Mute Auntie",
      collectionName: "Mute Aunties",
      price: "98.20",
      token: "ALGO"
    },
    {
      image: "/assets/nft-placeholder.png",
      itemName: "#2410 Mute Auntie",
      collectionName: "Mute Aunties",
      price: "98.20",
      token: "ALGO"
    }
  ]



  return (
    <div className={classes.container}>
      <div className={classes.section1}>
        <div className={classes.v_subsection1}>
          <img className={classes.nft} src="/assets/nft-placeholder.png" alt="" />



          <section className={classes.faq}>
            {Items.map((item, idx) => (
              < DropItem key={idx} item={item} id={idx} dropdown={dropdown} handleSetState={handleSetState} />

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

            <div className={classes.btns}>
              <button className={classes.buy}><img src="/assets/wallet-icon.png" alt="" />Buy now</button>
              <button className={classes.buy}><img src="/assets/wallet-icon.png" alt="" />Buy now</button>

            </div>

          </div>
          <div className={classes.feature}>
            <DropItem key={4} item={graph} id={4} dropdown={dropdown} handleSetState={handleSetState} ></DropItem>
          </div>
          <div className={classes.feature}>
            <DropItem key={5} item={attributesItem} id={5} dropdown={dropdown} handleSetState={handleSetState} ></DropItem>

          </div>
        </div>
      </div >
      <div className={classes.section}>
        <div className={classes.heading}> <h3><img src="/assets/swap-icon.png" alt="" />Transaction History</h3></div>
        <div className={classes.tableContainer}>
          <Search data={History} />
        </div>
      </div>
      <div className={classes.section}>
        <div className={classes.heading}> <h3><img src="/assets/swap-icon.png" alt="" />Meta Data</h3></div>
        <div className={classes.code}>
          <CopyBlock
            language="json"
            text={JSON.stringify(metadata, null, 2)}
            showLineNumbers={false}
            theme={dracula}
            wrapLines={true}
            codeBlock

          />
        </div>



      </div>
      <div className={classes.section}>
        <div className={classes.heading}> <h3><img src="/assets/swap-icon.png" alt="" />More From Collection</h3></div>
        <div className={classes.collectionItems}>
          <NFT data={nfts} />

        </div>
        <div className={classes.allCollecitons}>
          <button className={classes.btnCollections}>View All Collections</button>
        </div>
      </div>
    </div >
  )
}

export default Orgs;