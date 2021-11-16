import { useContext, useEffect, useState } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import classes from './preview.module.css';
import { useHistory } from 'react-router';
import { deleteAsset, setLoading, setMintAmount, setMintInfo, setNftLayers } from '../../gen-state/gen.actions';
import { v4 as uuid } from 'uuid';

const Preview = () => {
  const history = useHistory();
  const { nftLayers, currentDnaLayers, dispatch, combinations, mintAmount, mintInfo } = useContext(GenContext);

  const [deleteId, setDeleteId] = useState("");

  const canvas = document.createElement("canvas");


  // draw image 
  const handleImage = async images => {
    // const canvas = document.createElement("canvas");
    canvas.setAttribute("width", "250px");
    canvas.setAttribute("height", "250px");
    const ctx = canvas.getContext("2d");
    for (let img of images) {
      const image = await new Promise(resolve => {
        const image = new Image();
        image.src = URL.createObjectURL(img);
        image.onload = () => {
          resolve(image);
        };
      });
      image && ctx.drawImage(image, 0, 0, 250, 250);
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
      dispatch(setMintInfo("  maximum combinations exceeded"));
    } else {
      dispatch(setMintInfo(""))
    }
  }

  useEffect(() => {
    handleGenerate()
  }, [deleteId])

  useEffect(()=> {
    dispatch(setMintInfo(""))
  },[dispatch, mintAmount])

  return (
    <div className={classes.container}>
      <div onClick={() => history.goBack()} className={classes.goBackBtn}><i className="fas fa-arrow-left"></i></div>

      <div className={classes.info}>
        <div>no of generative arts: {nftLayers.length}</div>
        <div>possible combinations: {combinations - mintAmount}{mintInfo ? <><br />{mintInfo}</> : null}</div>
      </div>

      <div className={classes.preview}>
        {
          nftLayers.length && nftLayers.map(({ image, id }, idx) => (
            <div key={idx} className={classes.imgWrapper}>
              <img src={image} alt="" />
              <div className={classes.popup}>
                <button onClick={() => handleDeleteAndReplace(id)}>delete and replace</button>
                <button onClick={() => handleDelete(id)}>delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Preview