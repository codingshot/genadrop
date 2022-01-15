import { useContext, useEffect, useState, useRef } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import classes from './preview.module.css';
import { useHistory } from 'react-router';
import {
  addDescription,
  deleteAsset,
  renameAsset,
  setCollectionName,
  setLoading,
  setMintAmount,
  setMintInfo,
  setNftLayers,
  setOutputFormat
} from '../../gen-state/gen.actions';
import Button from '../../components/button/button';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import InputEditor from './inputEditor';
import ButtonClickEffect from '../../components/button-effect/button-effect';
import { generateArt, parseLayers } from '../../components/description/collection-description-script';
import { createUniqueLayer, getAweaveFormat, getIpfsFormat } from './preview-script';

const Preview = () => {

  const history = useHistory();
  const {
    nftLayers,
    currentDnaLayers,
    dispatch,
    combinations,
    mintAmount,
    mintInfo,
    collectionName,
    outputFormat,
    rule
  } = useContext(GenContext);

  const [state, setState] = useState({
    deleteId: '',
    editorAction: { index: "", id: "" }
  })
  const {deleteId, editorAction } = state;
  const didMountRef = useRef(false)
  const canvas = document.createElement("canvas");

  const handleSetState = payload => {
    setState(state => ({...state, ...payload}))
  }

  const handleGenerate = async () => {
    if (mintAmount === combinations) return;
    dispatch(setMintInfo(""));
    dispatch(setLoading(true))
    const uniqueLayers = createUniqueLayer({layers: currentDnaLayers, rule, nftLayers, deleteId});
    const arts = await generateArt({layers: uniqueLayers, canvas});
    dispatch(setNftLayers(parseLayers({uniqueLayers, arts})))
    dispatch(setLoading(false))
  }

  const handleDelete = val => {
    dispatch(deleteAsset(val))
    dispatch(setMintAmount(mintAmount - 1))
  }

  const handleDeleteAndReplace = id => {
    handleSetState({deleteId: id})
    if (!(combinations - mintAmount)) {
      dispatch(setMintInfo("  cannot generate asset from 0 combination"));
    } else {
      dispatch(setMintInfo(""))
    }
  }

  const handleRename = (id, inputValue, idx) => {
    if (editorAction.index === idx) {
      handleSetState({editorAction: ''})
      dispatch(renameAsset({ id: id, name: inputValue }))
    } else {
      handleSetState({editorAction: { index: idx, id }})
    }
  }

  const handleDescription = (id, inputValue, idx) => {
    if (editorAction.index === idx) {
      handleSetState({editorAction: ''})
      dispatch(addDescription({ id: id, description: inputValue }))
    } else {
      handleSetState({editorAction: { index: idx, id }})
    }
  }

  const handleCollectionName = (id, inputValue, idx) => {
    if (editorAction.index === idx) {
      handleSetState({editorAction: ''})
      dispatch(setCollectionName(inputValue))
    } else {
      handleSetState({editorAction: { index: idx, id }})
    }
  }

  const handleFormatChange = event => {
    if (event.target.value === "ipfs") {
      dispatch(setOutputFormat("ipfs"))
    } else if (event.target.value === "arweave") {
      dispatch(setOutputFormat("arweave"))
    }
  }

  const handleDownload = () => {
    const zip = new JSZip();

    if (outputFormat.toLowerCase() === "arweave") {
      getAweaveFormat(nftLayers).forEach((data, idx) => {
        zip.file(data.name ? `${data.name}.json` : `_${idx}.json`, JSON.stringify(data, null, '\t'));
      });
    } else {
      zip.file("metadata.json", JSON.stringify(getIpfsFormat(nftLayers), null, '\t'));
    }

    nftLayers.forEach((layer, idx) => {
      let base64String = layer.image.replace("data:image/png;base64,", "");
      zip.file(layer.name ? `${layer.name}.png` : `_${idx}.png`, base64String, { base64: true });
    })

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${collectionName ? `${collectionName}.zip` : 'collections.zip'}`);
    });
  }

  const handleDownloadAsset = (id, name, nftLayers) => {
    let { image } = nftLayers.find(el => el.id === id)
    let link = document.createElement('a');
    link.download = `${name || 'asset'}.png`;
    link.href = image;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    if (didMountRef.current) {
      handleGenerate()
    } else didMountRef.current = true;
  }, [deleteId])

  useEffect(() => {
    dispatch(setMintInfo(""))
  }, [dispatch, mintAmount])

  return (
    <div className={classes.container}>
      <div onClick={() => history.goBack()} className={classes.goBackBtn}>
        <i className="fas fa-arrow-left"></i>
      </div>

      <div className={classes.info}>
        <div className={classes.collectionName}>
          <InputEditor
            inputIndex="1"
            id={0}
            editorAction={editorAction}
            clickHandler={handleCollectionName}
            value={collectionName ? collectionName : `collectionName`}
            inputType="text"
          />
        </div>
        <div className={classes.infoRight}>
          <div>
            no of generative arts: {nftLayers.length}
          </div>
          <div>
            unused combinations: {combinations - mintAmount - rule.length}{mintInfo ? <><br /><span className={classes.warn}>{mintInfo}</span></> : null}
          </div>
        </div>
      </div>

      <div className={classes.downloadContainer}>
        <div>Use </div>
        <div className={classes.downloadFormatContainer}>
          <label htmlFor="ipfs">
            <input onChange={handleFormatChange} type="radio" value="ipfs" name="format" defaultChecked />
            Ipfs format
          </label>
          <label htmlFor="arweave">
            <input onChange={handleFormatChange} type="radio" value="arweave" name="format" />
            Arweave
          </label>
        </div>
        <div onClick={handleDownload}>
          <ButtonClickEffect>
            <Button>download zip</Button>
          </ButtonClickEffect>
        </div>
      </div>

      <div className={classes.preview}>
        {nftLayers.length &&
          nftLayers.map(({ image, id, name, description }, idx) => (
            <div key={idx} className={classes.assetContainer}>
              <div className={classes.imgWrapper}>
                <img src={image} alt="" />
                  <button onClick={() => handleDownloadAsset(id, name, nftLayers)}>download</button>
              </div>
              <div className={classes.wrapper_2}>
                <div className={classes.inputs}>
                  <InputEditor
                    id={id}
                    inputIndex="0"
                    editorAction={editorAction}
                    value={name ? name : `name_${idx}`}
                    clickHandler={handleRename}
                    inputType="text"
                  />

                  <InputEditor
                    inputIndex="1"
                    id={id}
                    editorAction={editorAction}
                    clickHandler={handleDescription}
                    value={description ? description : `description`}
                    inputType="textarea"
                  />
                </div>
                <div className={classes.popup}>
                  <ButtonClickEffect>
                    <button onClick={() => handleDeleteAndReplace(id)}>
                      generate new
                    </button>
                  </ButtonClickEffect>
                  <ButtonClickEffect>
                    <button onClick={() => handleDelete(id)}>delete</button>
                  </ButtonClickEffect>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Preview