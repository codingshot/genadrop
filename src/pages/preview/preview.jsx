import { useContext, useEffect, useState, useRef } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import classes from './preview.module.css';
import { useHistory } from 'react-router';
import {
  deleteAsset,
  renameAsset,
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
  const [renameAction, setRenameAction] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [checked, setChecked] = useState(true);
  const didMountRef = useRef(false)

  const canvas = document.createElement("canvas");

  // draw images
  const handleImage = async images => {
    const {height, width} = await getImageSize(images[0]);
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
        images.push(attr.trait.image)
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
        let randomPreview = traits[randNum]
        attr.push({
          layerTitle: layerTitle,
          trait: randomPreview
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

  const handleRename = id => {
    if (renameAction === id) {
      setRenameAction("")
      setInputValue("")
      dispatch(renameAsset({ id: id, name: inputValue }))
    } else {
      setRenameAction(id)
    }
  }

  const handleChange = ({ target: { value } }) => {
    setInputValue(value);
  }

  const handleToggle = (e) => {
    setChecked(!checked);
    if (!checked) dispatch(setOutputFormat("ipfs"));
    else dispatch(setOutputFormat("arweave"));
  }

  const handleDownload = () => {
    let jsonData = [];
    nftLayers.forEach((layer) => {
      let data = {};
      let attributes = [];
      // add the rest of the attributes
      data.attributes = attributes;
      data.description = "";
      data.name = collectionName;
      data.image = "image.png";
      // extract layer data 
      layer.attributes.forEach((traitData) => {
        const value = traitData.trait.traitTitle;
        attributes.push({
          trait_type: traitData.layerTitle, 
          value: value.substring(0,value.indexOf("."))
        });
      });

      console.log(outputFormat.toLowerCase())
      // arweave specific data  
      if (outputFormat.toLowerCase() === "arweave") {
        data.symbol = "";
        data.seller_fee_basis_points = "";
        data.external_url = "";
        data.collection = {
          name: "",
          family: ""
        };
        data.properties = {
          creators: [
            {
              address: "",
              share: 100
            }
          ]
        }
      }

      // add to json data array
      jsonData.push(data);

    });

    const zip = new JSZip();

    // add json data to individual json files
    jsonData.forEach((data, i) => {
      zip.file(i, JSON.stringify(data));
    });

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
        <div>no of generative arts: {nftLayers.length}</div>
        <div>
          unused combinations: {combinations - mintAmount}
          {mintInfo ? (
            <>
              <br />
              <span className={classes.warn}>{mintInfo}</span>
            </>
          ) : null}
        </div>
      </div>
      
      <div className={classes.downloadContainer}>
        <div>
          <input onChange={handleToggle} type="checkbox" name="format" checked={checked} value="ipfs"/>
          <label className={classes.toggleLabel} for="format">Use IPFS Format</label><br/>
        </div>
        <div onClick={handleDownload} className={classes.downloadBtn}>
          <Button>download zip</Button>
        </div>
      </div>

      <div className={classes.preview}>
        {nftLayers.length &&
          nftLayers.map(({ image, id, name }, idx) => (
            <div key={idx} className={classes.imgWrapper}>
              <img src={image} alt="" />
              <div className={classes.popup}>
                <button onClick={() => handleDeleteAndReplace(id)}>
                  generate new
                </button>
                <button onClick={() => handleDelete(id)}>delete</button>
              </div>
              <div className={classes.renameInputContainer}>
                <button
                  className={classes.renameBtn}
                  onClick={() => handleRename(id)}
                >
                  {name ? name : "asset name"}
                  {": "}
                  {renameAction === id ? "done" : "rename"}
                </button>
                {renameAction === id ? (
                  <form onSubmit={() => handleRename(id)}>
                    <input
                      className={`${classes.renameInput} ${classes.active}`}
                      type="text"
                      onChange={handleChange}
                      value={inputValue}
                      autoFocus
                    />
                  </form>
                ) : null}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Preview