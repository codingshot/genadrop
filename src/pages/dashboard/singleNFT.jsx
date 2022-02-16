import React, { useContext } from 'react';
import { useState } from 'react';
import DropItem from './dropItem/dropItem';
import classes from './singleNFT.module.css';
import { CopyBlock, dracula } from "react-code-blocks";
import axios from 'axios';
import Search from './history/search';
import NFT from './collection/nft';
import Graph from './graph/graph';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useEffect } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { getNftCollection } from '../../utils';
import { PurchaseNft } from '../../utils/arc_ipfs';

const Orgs = () => {

  const [state, setState] = useState({
    dropdown: '',
    asset: null
  })

  const { dropdown, asset } = state;
  const [algoPrice, setAlgoPrice] = useState([]);
  const [collection, setCollection] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const { account, connector } = useContext(GenContext);
  const { collections } = useContext(GenContext)
  const { url } = useRouteMatch()
  const history = useHistory();
  const [, , collectionName, nftId] = url.split('/');

  useEffect(() => {
    if (Object.keys(collections).length) {
      const collection = collections.allCollections.find(col => col.name === collectionName);
      (async function getResult() {

        let collectionData = await getNftCollection(collection)
        setCollection(collectionData)
        let result = collectionData.find(asset => asset.name === nftId);
        handleSetState({
          asset: result,
        })
        setLoading(false);
      }())
    }
    axios.get(`https://api.coinbase.com/v2/prices/ALGO-USD/spot`)
      .then(res => {
        setAlgoPrice(res.data.data.amount);
      })
    document.documentElement.scrollTop = 0;
  }, [nftId])

  useEffect(() => {
    if (!asset) return
    // you can assess a single nft data inside this function;
    console.log(collection);

    console.log("-------");
  }, [asset])

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }


  const Items = [
    {
      icon: "/assets/description-icon.png",
      title: "Description",
      content: `${asset.ipfs_data.description}`
    },
    {
      icon: "/assets/collection-icon.png",
      title: "About Collection",
      content: "Each layer in the image represents a trait (Hair, Outfit, etc), and each trait will have many variants (Short Purple Hair, Long Purple Hair, etc). Draw each variant on a transparent .PNG file so all the layers will be visible. Each image should be the same size, You can add conflict rules to selected layers. Preview and download your collection."
    },
    {
      icon: "/assets/details-icon.png",
      title: "Details",
      content: `NFT Id: ${asset.name}\nBlockchain: Algorand\nOwner: ${asset.owner}`
    },

  ]



  const graph = {
    icon: "/assets/description-icon.png",
    title: "Price History",
    content: <Graph />
  }


  const attributeContent = () => {
    return (
      <div className={classes.attributesContainer}>
        {asset.ipfs_data.properties.map((attribute, idx) => (
          <div key={idx} className={classes.attribute}>
            <span className={classes.title}>{attribute.trait_type}</span>
            <span className={classes.description}>{attribute.value}</span>
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

  const buyNft = async () => {
    let newWindow = window.open('', '_blank')
    let res = await PurchaseNft(asset, account, connector)
    console.log('final', res)
    newWindow.location = res
    
  }



  return (
    <div className={classes.container}>
      <div className={classes.section1}>
        <div className={classes.v_subsection1}>
          <img className={classes.nft} src={asset.image_url} alt="" />



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
                {asset.collection_name}
              </div>
              <div className={classes.nftName}>
                <div className={classes.nftId}>{asset.name}</div>
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
                <p className={classes.tokenValue}>{asset.price}</p>
                <span className={classes.usdValue}>(${(asset.price * algoPrice).toFixed(2)})</span>
              </span>
            </div>
            {(asset.sold ? <div style={{"color": "red"}}>SOLD</div> : null)}
            

            <div className={classes.btns}>
              <button className={classes.buy} disabled={asset.sold} onClick={buyNft}><img src="/assets/wallet-icon.png" alt="" />Buy now</button>
              <button className={classes.buy}><img src="/assets/wallet-icon.png" alt="" />Buy now</button>

            </div>

          </div>
          {/* PRICE HISTORY */}
          {/* <div className={classes.feature}>
            <DropItem key={4} item={graph} id={4} dropdown={dropdown} handleSetState={handleSetState} ></DropItem>
          </div> */}
          <div className={classes.feature}>
            <DropItem key={5} item={attributesItem} id={5} dropdown={dropdown} handleSetState={handleSetState} ></DropItem>

          </div>
        </div>
      </div >

      {/* TRANSACTION HISTORY */}
      {/* <div className={classes.section}>
        <div className={classes.heading}> <h3><img src="/assets/swap-icon.png" alt="" />Transaction History</h3></div>
        <div className={classes.tableContainer}>
          <Search data={History} />
        </div>
      </div> */}
      <div className={classes.section}>
        <div className={classes.heading}> <h3><img src="/assets/swap-icon.png" alt="" />Meta Data</h3></div>
        <div className={classes.code}>
          <CopyBlock
            language="json"
            text={JSON.stringify(asset.ipfs_data.properties, null, 2)}
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
          <NFT data={collection} />

        </div>
        <div className={classes.allCollecitons}>
          <button onClick={() => history.goBack()} className={classes.btnCollections}>View All Collections</button>
        </div>
      </div>
    </div >
  )
}

export default Orgs;