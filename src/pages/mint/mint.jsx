import classes from './mint.module.css';
import { useRef, useState, useEffect, useContext } from 'react';
import { getImageSize } from '../../components/utils';
import { createNFT } from '../../components/utils/arc_ipfs';
import { GenContext } from '../../gen-state/gen.context';
import { saveAs } from 'file-saver';
import { setLoading as setGlobalLoading } from '../../gen-state/gen.actions';
import { handleCopy, handleFileChange, handleMint, handleMintFileChange } from './mint-script';
import { useHistory } from 'react-router-dom';

const Mint = () => {

  const [attributes, setAttribute] = useState([{ label: "", description: "" }]);

  // handle input change
  const handleInputChange = (e, index) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    const list = [...attributes];
    list[index][name] = value;
    console.log(index, name);
    setAttribute(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...attributes];
    list.splice(index, 1);
    setAttribute(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setAttribute([...attributes, { label: "", description: "" }]);
  };

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
    selectValue: 'Algo',
    priceValue: 0
  })

  const {
    collections,
    zip,
    ipfsJsonData,
    metadata,
    collectionName,
    mintFileName,
    title,
    description,
    loading,
    mintUrl,
    showCopy,
    size,
    iconClicked,
    selectValue,
    priceValue
  } = state;
  const [celoAccount, setCeloAccount] = useState('')

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const { account, connector, dispatch } = useContext(GenContext);
  const fileRef = useRef(null);
  const jsonFileRef = useRef(null);
  const clipboardRef = useRef(null)

  const mintProps = { selectValue, handleSetState, window, ipfsJsonData, mintFileName, celoAccount, setCeloAccount, account, connector, priceValue }

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
      console.log(error)
      alert('No pinataApiKey provided!')
      dispatch(setGlobalLoading(false))
    }
  }

  const history = useHistory()

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

      <div className={classes.heading}>

        <div className={classes.mintOptions}>
          <div className={classes.mintOption}>
            <div onClick={() => history.push('/mint/single-nft')} className={classes.switch}>
              Mint 1 of 1
            </div>

            <div onClick={() => history.push('/mint/nft-collection')} className={`${classes.switch} ${classes.active}`}>
              Collection
            </div>
          </div>
        </div>
      </div>

      <div className={classes.wrapper}>
        <div className={classes.uploadSection}>
          <h3>Mint Your Nfts</h3>
          <p>Upload you NFT collection and its metadata, mint and list it on the blockchain of your choice</p>


          <div className={classes.upload}>
            <h4>Upload File</h4>
            <span>File types supported: Zip. Max size 100MB </span>
            <div className={classes.uploadInfo}>
              <img src="/assets/icon-upload.svg" alt="" />
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
              <img src="/assets/icon-upload.svg" alt="" />
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
                  <input type="text" value={priceValue} onChange={event => handleSetState({ priceValue: event.target.value })} />
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
        <div>
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
          <div className={classes.itemDescription}>
            <div className={classes.textInput}>

              <h3>Title</h3>
              <span>Item Name</span>
              <input type="text" value={title} onChange={event => handleSetState({ title: event.target.value })} />
            </div>

            <div className={classes.textInput}>
              <h3>Description</h3>
              <span>The description will be included on the item's details underneath its image</span>
              <textarea value={description} onChange={event => handleSetState({ description: event.target.value })} cols="30" rows="10"></textarea>
            </div>

            <div className={classes.textInput}>
              <h3>Attributes</h3>
              <span>Select your MetaData file and mint to IPFS</span>
              {attributes.map((x, i) => {
                return (


                  <div className={classes.attributes}>
                    <input
                      className={classes.attribute}
                      name="label"
                      placeholder="E.g Eyes"
                      value={x.label}
                      onChange={e => handleInputChange(e, i)}
                    />
                    <input
                      className={classes.attribute}
                      name="description"
                      placeholder="E.g green"
                      value={x.description}
                      onChange={e => handleInputChange(e, i)}
                    />
                    <button

                      onClick={() => handleRemoveClick(i)}
                      className={classes.removeBtn}
                    >
                      X
                    </button>




                  </div>
                );
              })}
              <p className={classes.addBtn} onClick={handleAddClick}>+ Add Attributes</p>


            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Mint;



