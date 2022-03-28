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
  const { dispatch, connector, account } = useContext(GenContext);
  const [state, setState] = useState({
    attributes: { [Date.now()]: { trait_type: '', value: '' } },
    fileName: fName,
    description: metadata?.length === 1 ? metadata[0].description : '',
    price: '',
    calcPrice: '0',
    chain: 'Algo',
    preview: false
  });
  const { attributes, fileName, description, price, chain, preview, calcPrice } = state;

  const mintProps = {
    dispatch,
    setLoader,
    setNotification,
    setClipboard,
    description,
    account,
    connector,
    file: zip,
    fileName,
    price,
    chain
  };

  const singleMintProps = {
    dispatch,
    setLoader,
    setNotification,
    setClipboard,
    account,
    connector,
    file: file[0],
    metadata: { name: fileName, description, attributes: Object.values(attributes) },
    fileName,
    price,
    chain
  };

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }));
  }

  const getUintByChain = {
    'Algo': 'Algo',
    'Celo': 'CGLD',
    'Polygon': 'Matic',
    'Near': 'Near'
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
    let price = event.target.value;
    handleSetState({ price });

    const formatResult = amount => {
      let calcPrice = Number(price) * Number(amount);
      if (isNaN(calcPrice)) {
        dispatch(setNotification('please add a valid price'));
        handleSetState({ calcPrice: 0 })
      } else {
        handleSetState({ calcPrice: calcPrice.toFixed(2) })
      }
    }

    if (chain === 'Near') {
      axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd`)
        .then(res => {
          let amount = res.data.near.usd;
          formatResult(amount)
        })
    } else {
      axios.get(`https://api.coinbase.com/v2/prices/${getUintByChain[chain]}-USD/spot`)
        .then(res => {
          let amount = res.data.data.amount;
          formatResult(amount)
        })
    }
  }

  const setMint = () => {
    if (file.length > 1) {
      handleMint(mintProps)
    } else {
      handleSingleMint(singleMintProps)
    }
  }

  useEffect(() => {
    handlePrice({target: {value: 0}})
  },[chain])

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
                <label> Title <span className={classes.required}>*</span></label>
                <input
                  style={metadata ? { pointerEvents: 'none' } : {}}
                  type="text"
                  value={fileName}
                  onChange={event => handleSetState({ fileName: event.target.value })}
                />
              </div>

              <div className={classes.inputWrapper}>
                <label>Description <span className={classes.required}>*</span></label>
                <textarea
                  style={metadata?.length === 1 ? { pointerEvents: 'none' } : {}}
                  rows="5"
                  value={description}
                  onChange={event => handleSetState({ description: event.target.value })}
                ></textarea>
              </div>

              <div className={classes.inputWrapper}>
                <label>Attributes <span className={classes.required}>*</span></label>
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
                <label>Price (USD) <span className={classes.required}>*</span></label>
                <div className={classes.priceInput}>
                  <input type="text" value={price} onChange={handlePrice} />
                  <div className={classes.calcPrice}>
                    <div>{calcPrice}</div>
                    <div>{getUintByChain[chain]}</div>
                  </div>
                </div>
              </div>

              <div className={classes.inputWrapper}>
                <label>Chain <span className={classes.required}>*</span></label>
                <select value={chain} onChange={event => handleSetState({ chain: event.target.value })}>
                  <option value="Algo">Algorand</option>
                  <option value="Celo">Celo</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Near">Near</option>
                </select>
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