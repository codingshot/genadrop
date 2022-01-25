import classes from './mint.module.css';
import { useRef, useState, useEffect, useContext } from 'react';
import { getImageSize } from '../../components/utils';
import { createNFT } from '../../components/utils/arc_ipfs';
import { GenContext } from '../../gen-state/gen.context';
import { saveAs } from 'file-saver';
import { setLoading as setGlobalLoading } from '../../gen-state/gen.actions';
import { handleCopy, handleFileChange, handleMint, handleMintFileChange } from './mint-script';

const Mint = () => {

  const [state, setState] = useState({
    collections: [],
    zip: null,
    ipfsJsonData: [],
    metadata: [],
    collectionName: '',
    mintFileName: '',
    loading: false,
    mintUrl: '',
    showCopy: false,
    size: { height: 0, width: 0 },
    iconClicked: false,
    selectValue: 'Algo'
  })

  const {
    collections,
    zip,
    ipfsJsonData,
    metadata,
    collectionName,
    mintFileName,
    loading,
    mintUrl,
    showCopy,
    size,
    iconClicked,
    selectValue
  } = state;
  const [celoAccount, setCeloAccount] = useState('')

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const { account, connector, dispatch } = useContext(GenContext);
  const fileRef = useRef(null);
  const jsonFileRef = useRef(null);
  const clipboardRef = useRef(null)

  const mintProps = { selectValue, handleSetState, window, ipfsJsonData, mintFileName, celoAccount, setCeloAccount, account, connector }

  const handleMintUpload = () => {
    jsonFileRef.current.click()
    handleSetState({ showCopy: false })
  }

  const handleExport = async () => {
    try {
      dispatch(setGlobalLoading(true))
      const ipfs = await createNFT(zip)
      dispatch(setGlobalLoading(false))
      let fileName = `${collectionName.split('.zip').join('-ipfs')}.json`;
      let fileToSave = new Blob([JSON.stringify(ipfs, null, '\t')], {
        type: 'application/json',
        name: fileName
      });
      saveAs(fileToSave, fileName);
    } catch (error) {
      alert('No pinataApiKey provided!')
      dispatch(setGlobalLoading(false))
    }
  }

  useEffect(() => {
    if (!collections.length) return
    const run = async () => {
      const { height, width } = await getImageSize(collections[0]);
      handleSetState({ size: { height, width } })
    }
    run()
  }, [collections])

  return (
    <div className={classes.container}>
      <div className={` ${classes.clipboard} ${showCopy === true ? classes.enter : classes.leave}`}>
        <div>{mintUrl}</div>
        <div
          onMouseDown={() => handleSetState({ iconClicked: true })}
          onMouseUp={() => handleSetState({ iconClicked: false })}
          onClick={() => handleCopy({ navigator, clipboard: clipboardRef.current })} className={`${classes.icon} ${iconClicked && classes.clicked}`}
        >
          copy to clipboard
        </div>
        <input style={{ display: 'none' }} ref={clipboardRef} type="text" defaultValue={mintUrl} />
      </div>
      <div className={classes.wrapper}>
        <div className={classes.uploadSection}>
          <h3>Upload</h3>

          <div className={classes.upload}>
            <h4>Upload zip file to IPFS</h4>
            <div className={classes.uploadInfo}>
              <img src="./assets/icon-upload.svg" alt="" />
              <div>{collectionName}</div>
            </div>
            <div className={classes.buttonWrapper}>
              <button className={classes.uploadBtn} onClick={() => fileRef.current.click()}>upload</button>
              {
                collections.length
                  ? <button className={classes.exportBtn} onClick={handleExport}>export</button>
                  : null
              }
            </div>
            <input
              style={{ display: 'none' }}
              onChange={event => handleFileChange({ event, handleSetState })}
              ref={fileRef}
              type="file"
              accept=".zip,.rar,.7zip"
            />
          </div>

          <div className={classes.upload}>
            <h4>Mint with IPFS.json</h4>
            <div className={classes.uploadInfo}>
              <img src="./assets/icon-upload.svg" alt="" />
              <div>{mintFileName}</div>
            </div>
            <div className={classes.buttonWrapper}>
              <button className={classes.uploadBtn} onClick={handleMintUpload}>upload</button>
            </div>
            <input
              style={{ display: 'none' }}
              onChange={event => handleMintFileChange({ event, handleSetState })}
              ref={jsonFileRef}
              type="file"
              accept=".json"
            />
          </div>

          {
            ipfsJsonData.length
              ?
              <>
                <div className={classes.details}>
                  <div className={classes.heading}>
                    <h4>Fixed Price -In </h4>
                    <select value={selectValue} onChange={event => handleSetState({ selectValue: event.target.value })}>
                      <option value="Algo">Algo</option>
                      <option value="Celo">Celo</option>
                    </select>
                  </div>
                  <input type="text" />
                  <div>
                    <p>Price in USSD</p>
                    <p>Current Algo price: </p>
                  </div>
                </div>

                <button className={classes.exportBtn} onClick={() => handleMint(mintProps)}>mint</button>
              </>
              : null
          }
        </div>
        {
          collections.length
            ?
            <div className={classes.previewSection}>
              <div className={classes.preview}>
                {
                  collections
                    .map((image, idx) => (
                      <img key={idx} src={URL.createObjectURL(image)} alt="" />
                    ))
                }
              </div>
              <div className={classes.description}>
                <h3>Description</h3>
                <div><span>Collection Name: </span> {collectionName}</div>
                <div><span>Number Of Pictures: </span> {collections.length}</div>
                <div><span>Layers: </span> {
                  metadata.length
                    ?
                    <span className={classes.layers}>
                      {
                        metadata[0]?.attributes.map(({ trait_type }, idx) => (
                          <span key={idx}>{trait_type}; </span>
                        ))
                      }
                    </span>
                    : null
                }</div>
                <div><span>Size: </span> {size.width}{" x "}{size.height}</div>
              </div>
            </div>
            :
            <div className={classes.fallback}>
              {
                loading
                  ? <i className="fas fa-spinner"></i>
                  : "nothing to preview"
              }
            </div>
        }
      </div>
    </div>
  )
}

export default Mint;



