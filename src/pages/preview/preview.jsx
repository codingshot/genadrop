import classes from './preview.module.css';
import { useContext, useEffect, useState, useRef } from 'react';
import { GenContext } from '../../gen-state/gen.context';
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
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import ButtonClickEffect from '../../components/button-effect/button-effect';
import { generateArt, parseLayers } from '../../components/description/collection-description-script';
import { createUniqueLayer, getAweaveFormat, getIpfsFormat } from './preview-script';
import TextEditor from './text-editor';

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
    deleteId: '',
    editorAction: { index: "", id: "" }
  })
  const { deleteId } = state;
  const didMountRef = useRef(false)
  const ipfsRef = useRef(null)
  const arweaveRef = useRef(null)
  const canvas = document.createElement("canvas");

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const handleGenerate = async () => {
    if (mintAmount === combinations) return;
    dispatch(setMintInfo(""));
    dispatch(setLoading(true))
    const uniqueLayers = createUniqueLayer({ layers: currentDnaLayers, rule, nftLayers, deleteId });
    const arts = await generateArt({ layers: uniqueLayers, canvas, image: layers[0]['traits'][0]['image'] });
    dispatch(setNftLayers(parseLayers({ uniqueLayers, arts })))
    dispatch(setLoading(false))
  }

  const handleDelete = val => {
    dispatch(deleteAsset(val))
    dispatch(setMintAmount(mintAmount - 1))
  }

  const handleDeleteAndReplace = id => {
    handleSetState({ deleteId: id })
    if (!(combinations - mintAmount)) {
      dispatch(setMintInfo("  cannot generate asset from 0 combination"));
    } else {
      dispatch(setMintInfo(""))
    }
  }

  const handleRename = input => {
    if (!input.value) return
    dispatch(renameAsset({ id: input.id, name: input.value }))
  }

  const handleDescription = input => {
    dispatch(addDescription({ id: input.id, description: input.value }))
  }

  const handleCollectionName = value => {
      dispatch(setCollectionName(value))
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

  const handleDownloadAsset = input => {
    const {id, name, nftLayers} = input;
    let { image } = nftLayers.find(el => el.id === id)
    let link = document.createElement('a');
    link.download = `${name || 'asset'}.png`;
    link.href = image;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <input ref={ipfsRef} type="radio" name="format" value="ipfs" defaultChecked />
            <p>IPFS</p>
          </label>
          <label htmlFor="arweave" onClick={() => handleFormatChange('arweave')}>
            <input ref={arweaveRef} type="radio" name="format" value="arweave" />
            <p>Arweave</p>
          </label>
          <button onClick={handleDownload}>Download zip</button>
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
              mintInfo ? <i className="fas fa-exclamation"></i> : null
            }
            <span>Unused Combinations</span>
            <span>{combinations - mintAmount - rule.length}</span>
          </div>
        </div>

        <div className={classes.preview}>
          {
            nftLayers.length &&
            nftLayers.map(({ image, id, name, description }, idx) => (
              <div key={idx} className={classes.card}>
                <img src={image} alt="" />
                <div className={classes.cardBody}>
                  <div className={classes.textWrapper}>
                    <TextEditor
                      placeholder={name ? name : `name_${idx}`}
                      submitHandler={value => handleRename({ value, id })}
                    />
                  </div>
                  <textarea
                    name="description"
                    value={description}
                    cols="30"
                    rows="3"
                    placeholder='description'
                    onChange={e => handleDescription({ value: e.target.value, id })}
                  />
                  <div className={classes.buttonContainer}>
                    <button onClick={() => handleDownloadAsset({id, name, nftLayers})}>Download</button>
                    <button onClick={() => handleDeleteAndReplace(id)}>Generate New</button>
                  </div>
                </div>
                <i className='fas fa-times' onClick={() => handleDelete(id)}></i>
              </div>
            ))
          }
        </div>
      </main>

    </div>
  )
}

export default Preview