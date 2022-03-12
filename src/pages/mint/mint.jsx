import classes from './mint.module.css';
import { useRef, useState, useEffect } from 'react';
import { handleZipFile } from './mint-script';
import AssetPreview from '../../components/Mint/AssetPreview/AssetPreview';
import lineIcon from '../../assets/icon-line.svg';

const Mint = () => {

  const fileRef = useRef(null);
  const dropRef = useRef(null);

  const [state, setState] = useState({
    fileName: '',
    file: null,
    metadata: null,
    zip: null
  });

  const { fileName, file, metadata, zip } = state;

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const handleFileChange = event => {
    let file = event.target.files[0];
    if (!file) return;
    
    let name = file.name.split('.')
    let fileName = name[0];
    let fileType = name[1];
    let supportedTypes = ['zip', 'png', 'jpeg', 'jpg', 'webp'];
    if(!supportedTypes.includes(fileType)) return;

    if (fileType === 'zip') {
      handleSetState({ zip: file, fileName })
      handleZipFile({ file, handleSetState });
    } else {
      handleSetState({ file: [file], fileName });
    }
  }

  useEffect(() => {
    if (!dropRef.current) return
    dropRef.current.ondragover = e => {
      e.preventDefault();
      document.querySelector('#drop-area').style.border = '2px dashed green'
    }
    dropRef.current.ondragleave = e => {
      e.preventDefault();
      document.querySelector('#drop-area').style.border = '1px dashed gainsboro'
    }
    dropRef.current.ondrop = e => {
      e.preventDefault();
      document.querySelector('#drop-area').style.border = '1px dashed gainsboro'
      handleFileChange({ target: e.dataTransfer });
    }
  }, [file]);

  return (
    <div className={classes.container}>
      {
        file ?
          <AssetPreview
            data={{ file, fileName, metadata, zip }}
            changeFile={() => handleSetState({
              fileName: '',
              file: null,
              metadata: null,
              zip: null
            })} />
          :
          <div className={classes.wrapper}>
            <h1 className={classes.title}>Mint Your NFTs</h1>
            <p className={classes.description}>
              Upload an <span> <img src={lineIcon} alt="" /> asset</span> or a <span> <img src={lineIcon} alt="" /> collection</span> to create NFT
            </p>
            <div ref={dropRef} className={classes.uploadWrapper}>
              <div>
                <p id='drop-area' className={classes.dropArea}>Drag and Drop you files</p>
                <p>Supported file types: zip, png, jpeg, jpg, webp</p>
              </div>
              <p>or</p>
              <button onClick={() => fileRef.current.click()}>Browse files</button>
              <input
                style={{ display: 'none' }}
                onChange={handleFileChange}
                ref={fileRef}
                type="file"
                accept=".jpg, .jpeg, .png, .webp, .zip"
              />
            </div>
          </div>
      }
    </div>
  )
}

export default Mint;