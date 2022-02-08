import classes from './singleMint.module.css';
import { useRef, useState, useEffect, useContext } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { getImageSize } from '../../utils';
import { createNFT } from '../../utils/arc_ipfs';
import { handleCopy, handleMint, handleMintFileChange } from './single-mint-script';
import { setLoading as setGlobalLoading } from '../../gen-state/gen.actions';
import { useHistory } from 'react-router-dom';
import { saveAs } from 'file-saver';

const SingleMint = () => {

  const [state, setState] = useState({
    loading: false,
    mintUrl: '',
    showCopy: false,
    iconClicked: false,
    mintFileName: '',
    collectionName: '',
    metadata: [],
    ipfsJsonData: [],
    loading: false,
    size: { height: 0, width: 0 },
    selectChain: 'Algo',
    priceValue: 0,
    title: '',
    selectValue: 'Algo',
    description: '',
    file: null,
  })

  const {
    mintUrl,
    iconClicked,
    priceValue,
    collectionName,
    ipfsJsonData,
    loading,
    metadata,
    size,
    selectValue,
    title,
    description,
    mintFileName,
    file,
    selectChain,
    showCopy,
  } = state;
  const [celoAccount, setCeloAccount] = useState('')

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const { account, connector, dispatch } = useContext(GenContext);
  const fileRef = useRef(null);
  const clipboardRef = useRef(null)


  const handleFileChange = event => {
    if (!event.target.files[0]) return;
    let file = event.target.files[0];
    console.log(file, file.name);
    handleSetState({ file, collectionName: file.name })
  }

  const handleImageChange = () => {
    handleSetState({ file: null })
  }

  const history = useHistory();

  useEffect(() => {
    if (!file) return
    const run = async () => {
      const { height, width } = await getImageSize(file);
      handleSetState({ size: { height, width } })
    }
    run()
  }, [file])
  const jsonFileRef = useRef(null);

  const handleExport = async () => {
    try {
      dispatch(setGlobalLoading(true))
      const ipfs = await createNFT(file)
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

  const handleMintUpload = () => {
    jsonFileRef.current.click()
    handleSetState({ showCopy: false })
  }

  const handleAddClick = () => {
    setAttribute([...attributes, { trait_type: "", value: "" }]);
  };

  const handleRemoveClick = index => {
    const list = [...attributes];
    list.splice(index, 1);
    setAttribute(list);
  };

  const handleInputChange = (e, index) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    const list = [...attributes];
    list[index][name] = value;
    console.log(index, name, list);
    setAttribute(list);
  };

  const [attributes, setAttribute] = useState([{ trait_type: "", value: "" }]);

  const mintProps = { handleSetState, file, title, description, selectChain, account, connector, priceValue, selectValue, attributes}


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
            <div onClick={() => history.push('/mint/single-nft')} className={`${classes.switch} ${classes.active}`}>
              Mint 1 of 1
            </div>

            <div onClick={() => history.push('/mint/nft-collection')} className={classes.switch}>
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
                file
                  ? <button className={classes.exportBtn} onClick={handleExport}>export</button>
                  : null
              }
            </div>
            <input
              style={{ display: 'none' }}
              onChange={handleFileChange}
              ref={fileRef}
              type="file"
              accept="image/*"
            />
          </div>

          {/* <div className={classes.upload}>
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
          </div> */}


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
            {attributes.map((x, idx) => {
              return (
                <div key={idx} className={classes.attributes}>
                  <input
                    className={classes.attribute}
                    name="trait_type"
                    placeholder="E.g Eyes"
                    value={x.trait_type}
                    onChange={e => handleInputChange(e, idx)}
                  />
                  <input
                    className={classes.attribute}
                    name="value"
                    placeholder="E.g green"
                    value={x.value}
                    onChange={e => handleInputChange(e, idx)}
                  />
                  <button

                    onClick={() => handleRemoveClick(idx)}
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
        <div>
          {
            file
              ?
              <div className={classes.previewSection}>
                <div className={classes.preview}>

                  <img src={URL.createObjectURL(file)} alt="" />

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

          {
            file
              ?
              <div className={classes.payment}>
                <div className={classes.details}>
                  <div className={classes.heading}>
                    <h4>Fixed Price -In </h4>

                    <select value={selectValue} onChange={event => handleSetState({ selectValue: event.target.value })}>
                      <option value="Algo">Algo</option>
                      <option value="Celo">Celo</option>
                      <option value="Polygon">Polygon</option>
                    </select>
                  </div>
                  <input type="text" value={priceValue} onChange={event => handleSetState({ priceValue: event.target.value })} />
                  <div>
                    <p>Price in USSD</p>
                    <p>Current Algo price: </p>
                  </div>
                </div>

                <button className={classes.mintBtn} onClick={() => handleMint(mintProps)}>mint</button>
              </div>
              : null
          }

        </div>
      </div>

    </div>
  )
}

export default SingleMint;