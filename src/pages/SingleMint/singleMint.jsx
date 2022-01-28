import classes from './singleMint.module.css';
import { useRef, useState, useContext } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { handleCopy, handleMint } from './single-mint-script';
import { useHistory } from 'react-router-dom';

const SingleMint = () => {

  const [state, setState] = useState({
    loading: false,
    mintUrl: '',
    showCopy: false,
    iconClicked: false,
    selectChain: 'Algo',
    priceValue: 0,
    title: '',
    description: '',
    file: null,
    showCopy: false,
    iconClicked: false
  })

  const {
    mintUrl,
    iconClicked,
    priceValue,
    title,
    description,
    file,
    selectChain,
    showCopy,
  } = state;
  const [celoAccount, setCeloAccount] = useState('')

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const { account, connector } = useContext(GenContext);
  const fileRef = useRef(null);
  const clipboardRef = useRef(null)

  const mintProps = { handleSetState, window, title, description, celoAccount, setCeloAccount, selectChain, account, connector, priceValue }

  const handleFileChange = event => {
    if (!event.target.files[0]) return;
    let file = event.target.files[0];
    console.log(file);
    handleSetState({ file })
  }

  const handleImageChange = () => {
    handleSetState({ file: null })
  }

  const history = useHistory();

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
        <h3>Mint Your Nfts</h3>
        <p>Upload a single NFT and its metadata, mint and list it on the blockchain of your choice</p>

        <div className={classes.mintOptions}>
        <div onClick={() => history.push('/mint/single-nft')} className={`${classes.switch} ${classes.active}`}>
            Mint Single NFT
          </div>

          <div onClick={() => history.push('/mint/nft-collection')} className={classes.switch}>
            Mint Collection
          </div>
        </div>

      </div>

      <div className={classes.mainFrame}>
        <div className={classes.leftFrame}>
          <div className={classes.title}>Upload File</div>
          {
            file ?
              <div className={classes.imageUpload}>
                <img src={URL.createObjectURL(file)} alt="" />
                <div>
                  <div className={classes.fileName}>File name: {file.name}</div>
                  <div onClick={handleImageChange} className={classes.uploadBtn}>Change file</div>
                </div>
              </div>
              :
              <div onClick={() => fileRef.current.click()} className={classes.uploadTab}>
                <div>Browse file</div>
                <p>supports JPG, PNG and MP4 videos. Max file size: 10MB</p>
                <input
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                />
              </div>
          }
          <div className={classes.textContainer}>
            <p className={classes.text}>
              Once your NFT is minted on the polygon blockchain, you will not be able to edit or update any of its information.
            </p>
            <p className={classes.text}>
              You agree that any information  uploaded to the GenaDrop Minter will not contain material subject to copyright or
              other propriety rights unless you have necessary permissions or otherwiser legally entitled to post the material.
            </p>
          </div>

        </div>
        <div className={classes.rightFrame}>
          <div className={classes.textInput}>
            <label className={classes.title} htmlFor="">Title</label>
            <input type="text" value={title} onChange={event => handleSetState({ title: event.target.value })} />
          </div>

          <div className={classes.textInput}>
            <label className={classes.title} htmlFor="">Description</label>
            <textarea value={description} onChange={event => handleSetState({ description: event.target.value })} cols="30" rows="10"></textarea>
          </div>
          <div className={classes.mintFrame}>
            <div className={classes.mintTitle}>
              <h4>Fixed Price -In </h4>
              <select value={selectChain} onChange={event => handleSetState({ selectChain: event.target.value })}>
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

          <button className={classes.mintBtn} onClick={() => handleMint(mintProps)}>mint</button>
        </div>
      </div>

    </div>
  )
}

export default SingleMint;