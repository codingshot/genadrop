import classes from './preview.module.css';
import { useContext, useEffect, useState, useRef } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import {
  addDescription,
  deleteAsset,
  renameAsset,
  setCollectionName,
  setFeedback,
  setLoader,
  setLoading,
  setMintAmount,
  setMintInfo,
  setNftLayers,
  setOutputFormat
} from '../../gen-state/gen.actions';
import { createUniqueLayer, generateArt } from './preview-script';
import TextEditor from './text-editor';
import { useHistory } from 'react-router-dom';
import { getDefaultDescription, getDefaultName, handleDownload } from '../../utils';

const Preview = () => {

  const {
    nftLayers,
    currentDnaLayers,
    dispatch,
    combinations,
    mintAmount,
    mintInfo,
    collectionName,
    outputFormat,
    rule,
    layers
  } = useContext(GenContext);

  const [state, setState] = useState({
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,
    editorAction: { index: "", id: "" }
  })
  const { currentPage, paginate, currentPageValue } = state;
  const ipfsRef = useRef(null);
  const arweaveRef = useRef(null);
  const history = useHistory();
  const canvas = document.createElement("canvas");

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const handleDeleteAndReplace = async (id, index) => {
    if (!(combinations - mintAmount)) {
      dispatch(setMintInfo("  cannot generate asset from 0 combination"));
    } else {
      dispatch(setLoader('generating...'));
      dispatch(setMintInfo(""));
      const newLayer = await createUniqueLayer({ dispatch, setLoader, collectionName, index, layers: currentDnaLayers, rule, nftLayers, id, mintAmount });
      const art = await generateArt({ dispatch, setLoader, layer: newLayer, canvas, image: layers[0]['traits'][0]['image'] });
      let newLayers = nftLayers.map(asset => (
        asset.id === newLayer.id ? { ...newLayer, image: art.imageUrl } : asset
      ))
      dispatch(setLoader(''))
      dispatch(setNftLayers(newLayers))
    }
  }

  const handleDelete = val => {
    dispatch(deleteAsset(val))
    dispatch(setMintAmount(mintAmount - 1))
  }

  const handleRename = input => {
    if (!input.value) {
      dispatch(renameAsset({ id: input.id, name: getDefaultName(input.index + 1) }))
    } else {
      dispatch(renameAsset({ id: input.id, name: input.value }))
    }
  }

  const handleDescription = input => {
    dispatch(addDescription({ id: input.id, description: input.value }))
  }

  const handleCollectionName = value => {
    dispatch(setCollectionName(value))
    let newLayers = nftLayers.map((asset, idx) => (
      { ...asset, description: getDefaultDescription(value, idx + 1) })
    )
    dispatch(setNftLayers(newLayers))
  }

  const handleFormatChange = val => {
    if (val === 'ipfs') {
      ipfsRef.current.checked = true
      dispatch(setOutputFormat("ipfs"))
    } else if (val === 'arweave') {
      arweaveRef.current.checked = true
      dispatch(setOutputFormat("arweave"))
    }
  }

  const handlePrev = () => {
    if (currentPage <= 1) return;
    handleSetState({ currentPage: currentPage - 1 })
  }

  const handleNext = () => {
    if (currentPage >= Object.keys(paginate).length) return;
    handleSetState({ currentPage: currentPage + 1 })
  }

  const handleGoto = () => {
    console.log(paginate);
    if (currentPageValue < 1 || currentPageValue > Object.keys(paginate).length) return;
    handleSetState({ currentPage: Number(currentPageValue) })
    document.documentElement.scrollTop = 0;
  }

  useEffect(() => {
    dispatch(setMintInfo(""))
  }, [dispatch, mintAmount])

  useEffect(() => {
    let countPerPage = 20;
    let numberOfPages = Math.ceil(nftLayers.length / countPerPage);
    let startIndex = 0;
    let endIndex = startIndex + countPerPage;
    let paginate = {}
    for (let i = 1; i <= numberOfPages; i++) {
      paginate[i] = nftLayers.slice(startIndex, endIndex);
      startIndex = endIndex;
      endIndex = startIndex + countPerPage
    }
    handleSetState({ paginate })
  }, [nftLayers])


  return (
    <div className={classes.wrapper}>
      <div onClick={() => history.goBack()} className={classes.arrowBack}>
        <img src="/assets/icon-arrow-left.svg" alt='' />
      </div>
      <div className={classes.container}>
        <aside className={classes.sidebar}>
          <div className={classes.collectionName}>
            <div className={classes.wrapper}>
              <TextEditor
                placeholder={collectionName ? collectionName : `collectionName`}
                submitHandler={handleCollectionName}
              />
            </div>
          </div>
          <div className={classes.actionContainer}>
            <h3>Use Format</h3>
            <label htmlFor="ipfs" onClick={() => handleFormatChange('ipfs')}>
              <input ref={ipfsRef} type="radio" name="format" value="ipfs" defaultChecked className={`${classes.radioBtn} ${outputFormat === 'ipfs' && classes.clicked}`} />
              <p>IPFS</p>
            </label>
            <label htmlFor="arweave" onClick={() => handleFormatChange('arweave')}>
              <input ref={arweaveRef} type="radio" name="format" value="arweave" className={`${classes.radioBtn} ${outputFormat === 'arweave' && classes.clicked}`} />
              <p>Arweave</p>
            </label>
            <button onClick={() => handleDownload({ window, dispatch, setLoader, setFeedback, value: nftLayers, name: collectionName, outputFormat })}>Download zip</button>
          </div>
        </aside>

        <main className={classes.main}>
          <div className={classes.details}>
            <div>
              <span>Number of Generative Arts</span>
              <span>{nftLayers.length}</span>
            </div>
            <div>
              {
                mintInfo ? <img src="/assets/icon-warn.svg" alt="" /> : null
              }
              <span>Unused Combinations</span>
              <span>{combinations - mintAmount - rule.length}</span>
            </div>
          </div>

          <div className={classes.preview}>
            {
              Object.keys(paginate).length ?
                paginate[currentPage].map((asset, index) => {
                  const { image, id, name, description } = asset;
                  return (
                    <div key={index} className={classes.card}>
                      <img className={classes.asset} src={image} alt="" />
                      <div className={classes.cardBody}>
                        <div className={classes.textWrapper}>
                          <TextEditor
                            placeholder={name}
                            submitHandler={value => handleRename({ value, id, index })}
                          />
                        </div>
                        <textarea
                          name="description"
                          value={description}
                          cols="30"
                          rows="3"
                          placeholder='description'
                          onChange={e => handleDescription({ value: e.target.value, id, index })}
                        />
                        <div className={classes.buttonContainer}>
                          <button onClick={() => handleDownload({ window, dispatch, setLoader, setFeedback, value: [asset], name: asset.name, outputFormat, single: true })}>Download</button>
                          <button onClick={() => handleDeleteAndReplace(id, index)}>Generate New</button>
                        </div>
                      </div>
                      <div className={classes.iconClose}>
                        <img src='/assets/icon-close.svg' alt='' onClick={() => handleDelete(id)} />
                      </div>
                    </div>
                  )
                }) : null
            }
          </div>
        </main>
      </div>
      <div className={classes.paginate}>
        <div onClick={handlePrev} className={classes.pageControl}>prev</div>
        <div className={classes.pageCount}>{currentPage} of {Object.keys(paginate).length}</div>
        <div onClick={handleNext} className={classes.pageControl}>next</div>
        <div onClick={handleGoto} className={classes.pageControl}>goto</div>
        <input type="number" value={currentPageValue} onChange={event => handleSetState({ currentPageValue: event.target.value })} />
      </div>
    </div>
  )
}

export default Preview