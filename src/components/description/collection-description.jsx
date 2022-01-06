import { useContext, useEffect, useRef } from 'react';
import { setCurrentDnaLayers, setLoading, setMintAmount, setMintInfo, setNftLayers } from '../../gen-state/gen.actions';
import { GenContext } from '../../gen-state/gen.context';
import { createDna } from '../../gen-state/gen.utils';
import Button from '../button/button';
import CollectionDetails from '../details/collection-details';
import CollectionPreview from '../preview/collection-preview';
import classes from './collection-description.module.css';
import { v4 as uuid } from 'uuid';
import { Link } from 'react-router-dom';
import { getImageSize } from '../utils/getImageSize';
import ButtonClickEffect from '../button-effect/button-effect';

const CollectionDescription = () => {
  const { layers, mintAmount, dispatch, combinations, isLoading, mintInfo } = useContext(GenContext);
  const canvasRef = useRef(null);

  // set generate amount
  const handleChange = event => {
    let value = event.target.value;
    dispatch(setMintAmount(value ? parseInt(value) : 0))
    dispatch(setMintInfo(""))
  }

  // draw images
  const handleImage = async images => {
    const { height, width } = await getImageSize(images[0]);
    const canvas = canvasRef.current;
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
      const imageUrl = canvasRef.current.toDataURL();
      uniqueImages.push({ id, imageUrl })

    }
    return uniqueImages;
  }

  // create layers with unique traits
  const createUniqueLayer = layers => {
    const newLayers = [];
    const newAttributes = [];
    let uniqueIndex = 0;

    const isUnique = (attributes, attr) => {
      let att_str = JSON.stringify(attr);
      for (let _attr of attributes) {
        let _attr_str = JSON.stringify(_attr);
        if (_attr_str === att_str) return false;
      }
      return true
    }

    for (let i = 0; i < (mintAmount + uniqueIndex); i++) {
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

      if (isUnique(newAttributes, attr)) {
        newAttributes.push([...attr])
      } else {
        uniqueIndex++;
      }
    }

    newAttributes.forEach(attr => {
      newLayers.push({
        id: uuid(),
        name: "",
        description: "",
        image: "image",
        attributes: attr
      })
    })

    return newLayers;
  }

  // generate nft data ready for upload
  const handleGenerate = async () => {

    dispatch(setMintInfo("in progress..."))
    if (!mintAmount) return dispatch(setMintInfo("please set amount to continue..."));
    if (!combinations) return dispatch(setMintInfo("Please uplaod assets to continue..."))
    if (mintAmount > combinations) return dispatch(setMintInfo("cannot generate more than possible combinations"));
    dispatch(setNftLayers([]))
    dispatch(setLoading(true))
    const dnaLayers = createDna(layers);
    const uniqueLayers = createUniqueLayer(dnaLayers);
    const NFTs = await generateNFT(uniqueLayers);

    let newLayers = uniqueLayers.map(layer => {
      for (let nft of NFTs) {
        if (nft.id === layer.id) {
          return { ...layer, image: nft.imageUrl }
        }
      }
      return layer
    })

    // // uncomment the block below to display a list of all nft sizes
    // const nftSizes = [];
    // for (let nft of NFTs) {
    //   const { height, width } = await getImageSize(nft.imageUrl);
    //   nftSizes.push({height, width})
    // }
    // console.log(nftSizes)


    dispatch(setCurrentDnaLayers(dnaLayers))
    dispatch(setNftLayers(newLayers))
    dispatch(setMintInfo("completed"))
    dispatch(setLoading(false))
  }

  useEffect(() => {
    dispatch(setLoading(false))
  }, [dispatch])

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.preview_details}>
          <div className={classes.previewWrapper}>
            <CollectionPreview />
          </div>
          <div className={classes.detailsWrapper}>
            <CollectionDetails />
          </div>
        </div>
        <div className={classes.btnWrapper}>
          <div onClick={handleGenerate}>
            <ButtonClickEffect>
              <Button>generate {mintAmount}</Button>
            </ButtonClickEffect>
          </div>
        </div>

        <div className={classes.btnWrapper}>
          {
            mintInfo === "completed"
              ?
              <Link to="/preview">
                <ButtonClickEffect>
                  <Button invert>preview</Button>
                </ButtonClickEffect>
              </Link>
              :
              <div className={`${classes.mintInfo} ${isLoading && classes.isLoading}`}>
                {mintInfo}
              </div>
          }
        </div>
      </div>
      <div className={classes.input}>
        <div className={classes.action}>
          <label htmlFor="generate amout">Generate Amount</label>
          <input onChange={handleChange} type="number" min="0" />
        </div>
        <div className={classes.action}>
          <div htmlFor="combinations">Combinations</div>
          <div>{combinations}</div>
        </div>
      </div>

      <canvas style={{ display: "none" }} ref={canvasRef}></canvas>
    </div>
  )
}

export default CollectionDescription;