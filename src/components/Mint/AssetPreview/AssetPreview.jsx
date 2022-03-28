import { useState, useContext, useEffect } from 'react';
import { setClipboard, setLoader, setNotification } from '../../../gen-state/gen.actions';
import { GenContext } from '../../../gen-state/gen.context';
import Attribute from '../Attribute/Attribute';
import { handleMint, handleSingleMint } from './AssetPreview-script';
import classes from './AssetPreview.module.css';
import arrowIconLeft from '../../../assets/icon-arrow-left.svg';
import axios from 'axios';

const AssetPreview = ({ data, changeFile }) => {
  const { file, fileName: fName, metadata, zip } = data;
  const { dispatch, connector, account, chainId } = useContext(GenContext);
  const [state, setState] = useState({
    attributes: { [Date.now()]: { trait_type: '', value: '' } },
    fileName: fName,
    description: metadata?.length === 1 ? metadata[0].description : '',
    price: '',
    chain: '',
    preview: false,
    dollarPrice: 0
  });
  const { attributes, fileName, description, price, chain, preview, dollarPrice } = state;

  const chains = [
    { label: 'Algorand', networkId: 4160, symbol: 'ALGO' },
    { label: 'Celo', networkId: 42220, symbol: "CGLD" },
    { label: 'Polygon', networkId: 137, symbol: "MATIC" },
    { label: 'Near', networkId: 1313161555, symbol: "NEAR" },
  ]

  const mintProps = {
    dispatch,
    setLoader,
    setNotification,
    setClipboard,
    description,
    account,
    chainId,
    connector,
    file: zip,
    fileName,
    price,
    chain,
    dollarPrice
  };

  const singleMintProps = {
    dispatch,
    setLoader,
    setNotification,
    setClipboard,
    account,
    chainId,
    connector,
    file: file[0],
    metadata: { name: fileName, description, attributes: Object.values(attributes) },
    fileName,
    price,
    chain,
    dollarPrice
  };

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }));
  }

  const handleAddAttribute = () => {
    handleSetState({
      attributes: {
        ...attributes,
        [Date.now()]: { trait_type: '', value: '' }
      }
    });
  }

  const handleRemoveAttribute = id => {
    if (Object.keys(attributes).length === 1) return;

    const newAttributes = {};
    for (let key in attributes) {
      if (key !== id) {
        newAttributes[key] = attributes[key]
      }
    }
    handleSetState({ attributes: newAttributes })
  }

  const handleChangeAttribute = arg => {
    const { event: { target: { name, value } }, id } = arg;
    handleSetState({
      attributes: { ...attributes, [id]: { ...attributes[id], [name]: value } }
    });
  }

  const handlePrice = event => {
    handleSetState({ price: event.target.value })
  }

  const setMint = () => {
    const result = /^[0-9]\d*(\.\d+)?$/.test(price);
    if (!result) return dispatch(setNotification('please add a valid price'));
    if (file.length > 1) {
      handleMint(mintProps)
    } else {
      handleSingleMint(singleMintProps)
    }
  }

  useEffect(() => {
    console.log(chainId);
    if (chainId) {
      const c = chains.find(c => c.networkId == chainId);
      if (!c) return "invalid chain"
      handleSetState({ chain: c })
      axios.get(`https://api.coinbase.com/v2/prices/${chain.symbol}-USD/spot`)
        .then(res => {
          handleSetState({ dollarPrice: res.data.data.amount * price })
        })
    }
  }, [price, chainId])
  return (
    <div className={classes.container}>
      {
        preview
          ?
          <div className={classes.previewWrapper}>
            <div onClick={() => handleSetState({ preview: false })} className={classes.cancelPreview}>
              <img src={arrowIconLeft} alt='' /> Back
            </div>
            {
              file.map((f, idx) => (
                <div key={idx} className={classes.assetWrapper}>
                  <img src={URL.createObjectURL(f)} alt="" />
                </div>
              ))
            }
          </div>
          :
          <div className={classes.wrapper}>
            <section className={classes.asset}>
              {
                file.length > 1
                  ?
                  <div
                    onClick={() => handleSetState({ preview: true })}
                    className={classes.showPreview}
                  >
                    view all collections
                  </div>
                  : null
              }
              <img src={URL.createObjectURL(file[0])} alt="" />
              <button onClick={changeFile}>Change asset</button>
            </section>

            <section className={classes.type}>
              <div>
                {file.length > 1 ? 'Collection Mint' : 'Mint 1 of 1s'}
              </div>
            </section>

            <section className={classes.details}>

              <div className={classes.inputWrapper}>
                <label> Title </label>
                <input
                  style={metadata ? { pointerEvents: 'none' } : {}}
                  type="text"
                  value={fileName}
                  onChange={event => handleSetState({ fileName: event.target.value })}
                />
              </div>

              <div className={classes.inputWrapper}>
                <label>Description</label>
                <textarea
                  style={metadata?.length === 1 ? { pointerEvents: 'none' } : {}}
                  rows="5"
                  value={description}
                  onChange={event => handleSetState({ description: event.target.value })}
                ></textarea>
              </div>

              <div className={classes.inputWrapper}>
                <label>Attributes</label>
                {
                  !metadata
                    ?
                    <>
                      <div className={classes.attributes}>
                        {
                          (Object.keys(attributes)).map(key => (
                            <Attribute
                              key={key}
                              attribute={attributes[key]}
                              id={key}
                              removeAttribute={handleRemoveAttribute}
                              changeAttribute={handleChangeAttribute}
                            />
                          ))
                        }
                      </div>
                      <button onClick={handleAddAttribute}>+ Add Attribute</button>
                    </>
                    : metadata.length === 1
                      ?
                      <>
                        {
                          metadata[0].attributes.map((attr, idx) => (
                            <div className={classes.attribute} key={idx}>
                              <div>{attr.trait_type}</div>
                              <div>{attr.value}</div>
                            </div>
                          ))
                        }
                      </>
                      :
                      <div className={classes.metadata}>
                        <div>Number of assets: {metadata.length}</div>
                        <div className={classes.trait_type}>Trait_types: {
                          metadata[0]?.attributes.map(({ trait_type }, idx) => (
                            <span key={idx}>{trait_type} </span>
                          ))
                        }
                        </div>
                      </div>
                }
              </div>
            </section>

            <section className={classes.mintOptions}>

              <div className={classes.inputWrapper}>
                <label>Price</label>
                <div className={classes.price}>
                  <input type="number" value={0} onChange={handlePrice} />
                  {chainId ? <span>({dollarPrice} USD)</span> : "Connect wallet see USD price"}
                </div>
              </div>

              <div className={classes.inputWrapper}>
                <label>Chain</label>
                {chainId ? <select value={chain} disabled={true} >
                  <option value={chain.label} > {chain.label}</option>

                </select> : ""}
              </div>
            </section>

            <section className={classes.mintButtonWrapper}>
              <button onClick={setMint} className={classes.mintBtn}>Mint</button>
              <button onClick={changeFile} className={classes.cancelBtn}>Cancel</button>
            </section>
          </div>
      }
    </div>
  )
}

export default AssetPreview;