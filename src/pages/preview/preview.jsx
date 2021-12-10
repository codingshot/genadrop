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
import { v4 as uuid } from 'uuid';
import Button from '../../components/button/button';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { getImageSize } from '../../components/utils/getImageSize';
import InputEditor from './inputEditor';

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
  } = useContext(GenContext);

  const [deleteId, setDeleteId] = useState("");
  const [editorAction, setEditorAction] = useState({ index: "", id: "" });
  const didMountRef = useRef(false)

  const canvas = document.createElement("canvas");

  // draw images
  const handleImage = async images => {
    const { height, width } = await getImageSize(images[0]);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    const ctx = canvas.getContext("2d");
    for (let img of images) {
      const image = await new Promise(resolve => {
        const image = new Image();
        image.src = URL.createObjectURL(img);
        image.onload = () => {
          resolve(image);
        };
      });
      image && ctx.drawImage(image, 0, 0, width, height);
    };
  };

  // generate nfts
  const generateNFT = async (layers) => {
    const uniqueImages = [];

    for (let { attributes, id } of layers) {
      const images = [];
      attributes.forEach(attr => {
        images.push(attr.image)
      })
      await handleImage(images);
      const imageUrl = canvas.toDataURL();
      uniqueImages.push({ id, imageUrl })
    }
    return uniqueImages;
  }


  // create layers with unique traits
  const createUniqueLayer = layers => {
    let newLayers = [...nftLayers];
    let newAttr = [];
    const prevAttributes = newLayers.map(({ attributes }) => attributes);

    let uniqueIndex = 1;

    const isUnique = (attributes, attr) => {
      let att_str = JSON.stringify(attr);
      for (let _attr of attributes) {
        let _attr_str = JSON.stringify(_attr);
        if (_attr_str === att_str) return false;
      }
      return true
    }

    for (let i = 0; i < uniqueIndex; i++) {
      let attr = [];
      layers.forEach(({ layerTitle, traits }) => {
        let randNum = Math.floor(Math.random() * traits.length)
        let { traitTitle, Rarity, image } = traits[randNum]
        attr.push({
          trait_type: layerTitle,
          value: traitTitle,
          rarity: Rarity,
          image: image
        })
      })

      if (isUnique(prevAttributes, attr)) {
        newAttr = [...attr]
      } else {
        uniqueIndex++;
      }
    }

    const _newLayers = newLayers.map(layer => {
      if (layer.id === deleteId) {
        return {
          id: uuid(),
          image: "image",
          attributes: newAttr
        }
      } else {
        return layer
      }
    })

    return _newLayers;
  }

  // generate nft data ready for upload
  const handleGenerate = async () => {
    if (mintAmount === combinations) return;
    dispatch(setMintInfo(""));
    dispatch(setLoading(true))
    const uniqueLayers = createUniqueLayer(currentDnaLayers);
    const NFTs = await generateNFT(uniqueLayers);
    let newLayers = uniqueLayers.map(layer => {
      let newLayer = null
      for (let nft of NFTs) {
        if (nft.id === layer.id) {
          return newLayer = { ...layer, image: nft.imageUrl }
        }
      }
      return newLayer
    })
    dispatch(setNftLayers(newLayers))
    dispatch(setLoading(false))
  }

  const handleDelete = val => {
    dispatch(deleteAsset(val))
    dispatch(setMintAmount(mintAmount - 1))
  }


  const handleDeleteAndReplace = id => {
    setDeleteId(id)
    if (!(combinations - mintAmount)) {
      dispatch(setMintInfo("  cannot generate asset from 0 combination"));
    } else {
      dispatch(setMintInfo(""))
    }
  }

  const handleRename = (id, inputValue, idx) => {
    if (editorAction.index === idx) {
      setEditorAction("")
      dispatch(renameAsset({ id: id, name: inputValue }))
    } else {
      setEditorAction({ index: idx, id })
    }
  }

  const handleDescription = (id, inputValue, idx) => {
    if (editorAction.index === idx) {
      setEditorAction("")
      dispatch(addDescription({ id: id, description: inputValue }))
    } else {
      setEditorAction({ index: idx, id })
    }
  }

  const handleCollectionName = (id, inputValue, idx) => {
    if (editorAction.index === idx) {
      setEditorAction("")
      dispatch(setCollectionName(inputValue))
    } else {
      setEditorAction({ index: idx, id })
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

    const ipfsFormat = nftLayers.map((layer, idx) => (
      {
        name: layer.name ? layer.name : `_${idx}`,
        image: "image.png",
        description: layer.description,
        attributes: layer.attributes.map(({ trait_type, value, rarity }) => (
          { trait_type, value, rarity }
        ))
      }
    ));

    const arweaveFormat = nftLayers.map((layer, idx) => (
      {
        name: layer.name ? layer.name : `_${idx}`,
        image: "image.png",
        description: layer.description,
        attributes: layer.attributes.map(({ trait_type, value, rarity }) => (
          { trait_type, value, rarity }
        )),
        symbol: '',
        seller_fee_basis_points: '',
        external_url: "",
        collection: {
          name: layer.name ? layer.name : `_${idx}`,
          family: ""
        },
        properties: {
          creators: [
            {
              address: "",
              share: 100
            }
          ]
        }
      }
    ))

    const zip = new JSZip();

    if (outputFormat.toLowerCase() === "arweave") {
      arweaveFormat.forEach((data, idx) => {
        zip.file(data.name ? `${data.name}.json` : `_${idx}.json`, JSON.stringify(data, null, '\t'));
      });
    } else {
      zip.file("metadata.json", JSON.stringify(ipfsFormat, null, '\t'));
    }

    nftLayers.forEach((layer, idx) => {
      let base64String = layer.image.replace("data:image/png;base64,", "");
      zip.file(layer.name ? `${layer.name}.png` : `_${idx}.png`, base64String, { base64: true });
    })

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${collectionName ? `${collectionName}.zip` : 'collections.zip'}`);
    });
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
            unused combinations: {combinations - mintAmount}{mintInfo ? <><br /><span className={classes.warn}>{mintInfo}</span></> : null}
          </div>
        </div>
      </div>

      <div className={classes.downloadContainer}>
        <div>Use </div>
        <div className={classes.downloadFormatContainer}>
          <label htmlFor="ipfs">
            <input onChange={handleFormatChange} type="radio" value="ipfs" name="format" defaultChecked/>
            Ipfs format
          </label>
          <label htmlFor="arweave">
            <input onChange={handleFormatChange} type="radio" value="arweave" name="format" disabled />
            Arweave
          </label>
        </div>
        <div onClick={handleDownload}>
          <Button>download zip</Button>
        </div>
      </div>

      <div className={classes.preview}>
        {nftLayers.length &&
          nftLayers.map(({ image, id, name, description }, idx) => (
            <div key={idx} className={classes.imgWrapper}>
              <img src={image} alt="" />
              <div className={classes.popup}>
                <button onClick={() => handleDeleteAndReplace(id)}>
                  generate new
                </button>
                <button onClick={() => handleDelete(id)}>delete</button>
              </div>
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

            </div>
          ))}
      </div>
    </div>
  );
}

export default Preview