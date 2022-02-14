import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { getAlgoData } from "../utils/arc_ipfs";
// import fileDownload from 'js-file-download'

export const getNftCollections = async collections => {
  let collectionArr = []
  for (let i = 0; i < collections.length; i++) {
    try {
      let collectionObj = {}
      collectionObj.name = collections[i].name
      collectionObj.price = collections[i].price
      collectionObj.owner = collections[i].owner
      collectionObj.description = collections[i].description
      let { data } = await axios.get(collections[i]['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
      collectionObj.number_of_nfts = data.length
      let { params } = await getAlgoData(data[0])
      let response = await axios.get(params['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
      collectionObj.image_url = response.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      collectionArr.push(collectionObj)
    } catch (error) {
      console.error('get collection result failed');
    }
  }
  return collectionArr
}

export const getNftCollection = async collection => {
  let nftArr = []
  let { data } = await axios.get(collection['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
  for (let i = 0; i < data.length; i++) {
    try {
      let nftObj = {}
      nftObj.collection_name = collection.name
      nftObj.owner = collection.owner
      nftObj.price = collection.price
      let { params } = await getAlgoData(data[i])
      nftObj.algo_data = params
      let response = await axios.get(params['url'].replace('ipfs://', 'https://ipfs.io/ipfs/'));
      nftObj.ipfs_data = response.data
      nftObj.name = response.data.name;
      nftObj.image_url = response.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      nftArr.push(nftObj)
    } catch (error) {
      console.error(error);
    }
  }
  return nftArr
}

export const getNftData = async (collection, assetName) => {
  let collectionData = await getNftCollection(collection)
  return collectionData.find(asset => asset.name === assetName);
}

export const getImageSize = async img => {
  return new Promise(resolve => {
    const image = new Image();
    if (typeof (img) === "string") {
      image.src = img
    } else {
      image.src = URL.createObjectURL(img);
    }
    image.onload = () => {
      resolve({ height: image.height, width: image.width });
    };
  })
}

export const getDefaultName = id => {
  id = String(id);
  if (id.length < 4) {
    let repeatBy = 4 - id.length
    return `#${'0'.repeat(repeatBy)}${id}`
  } else {
    return `#${id}`
  }
}

export const getDefaultDescription = (collectionName, id) => {
  id = String(id);
  if (id.length < 4) {
    let repeatBy = 4 - id.length
    return `${collectionName} #${'0'.repeat(repeatBy)}${id}`
  } else {
    return `${collectionName} #${id}`
  }
}

export const handleImage = async props => {
  const { canvas, images, image } = props;
  const { height, width } = await getImageSize(image);
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

export const handleBlankImage = async props => {
  const { img, canvas } = props
  const { height, width } = await getImageSize(img);
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const ctx = canvas.getContext("2d");
  const image = await new Promise(resolve => {
    const image = new Image();
    image.src = "/assets/blank.png";
    image.onload = () => {
      resolve(image);
    };
  });
  image && ctx.drawImage(image, 0, 0, width, height);
};

export const getAweaveFormat = async (nftLayers, dispatch, setLoader, id) => {
  let clone = [];
  for (let i = 0; i < nftLayers.length; i++) {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        dispatch(setLoader(
          `getting metadata ready for download
${i + 1} of ${nftLayers.length}`
        ));
        clone.push({
          name: nftLayers[i].name ? nftLayers[i].name : `_${i}`,
          image: "image.png",
          description: nftLayers[i].description,
          attributes: nftLayers[i].attributes.map(({ trait_type, value, rarity }) => (
            { trait_type, value, rarity }
          )),
          symbol: '',
          seller_fee_basis_points: '',
          external_url: "",
          collection: {
            name: nftLayers[i].name ? nftLayers[i].name : `_${i}`,
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
        })
        resolve();
      }, 0);
    });
    await promise;
  }
  dispatch(setLoader(''));
  return clone;
}

export const getIpfsFormat = async (nftLayers, dispatch, setLoader, id) => {
  let clone = [];
  for (let i = 0; i < nftLayers.length; i++) {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        dispatch(setLoader(
          `getting metadata ready for download
${i + 1} of ${nftLayers.length}`
        ));
        clone.push({
          name: nftLayers[i].name ? nftLayers[i].name : `_${i}`,
          image: "image.png",
          description: nftLayers[i].description,
          attributes: nftLayers[i].attributes.map(({ trait_type, value, rarity }) => (
            { trait_type, value, rarity }
          ))
        })
        resolve();
      }, 0);
    });
    await promise;
  }
  dispatch(setLoader(''))
  return clone;
}

export const paginate = (input, count) => {
  let countPerPage = count;
  let numberOfPages = Math.ceil(input.length / countPerPage);
  let startIndex = 0;
  let endIndex = startIndex + countPerPage;
  let paginate = {}
  for (let i = 1; i <= numberOfPages; i++) {
    paginate[i] = input.slice(startIndex, endIndex);
    startIndex = endIndex;
    endIndex = startIndex + countPerPage
  }

  return paginate
}

const downloadCallback = async props => {
  const { window, value, name, outputFormat, dispatch, setLoader, id, single } = props;
  const zip = new JSZip();
  if (outputFormat.toLowerCase() === "arweave") {
    const aweave = await getAweaveFormat(value, dispatch, setLoader, id);
    aweave.forEach((data, idx) => {
      zip.file(data.name ? `${data.name}.json` : `_${idx}.json`, JSON.stringify(data, null, '\t'));
    });
  } else {
    zip.file("metadata.json", JSON.stringify(await getIpfsFormat(value, dispatch, setLoader, id), null, '\t'));
  }
  for (let i = 0; i < value.length; i++) {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        dispatch(setLoader(
          `getting assets ready for download
${i + 1} of ${value.length}`
        ));
        let base64String = value[i].image.replace("data:image/png;base64,", "");
        zip.file(value[i].name ? `${value[i].name}.png` : `_${i}.png`, base64String, { base64: true });
        resolve()
      }, 0);
    });
    await promise;
  }
  const content = await zip.generateAsync({ type: "blob" });
  window.requestIdleCallback(() => {
    // fileDownload(content, `${name ? `${name}${single ? '' : `_${id}`}.zip` : 'collections.zip'}`);
      saveAs(content, `${name ? `${name}${single ? '' : `_${id}`}.zip` : 'collections.zip'}`);
  })

  dispatch(setLoader(''));
}

export const handleDownload = async input => {
  const { value, dispatch, setFeedback } = input;
  let paginated = paginate(value, 1000);
  let index = Object.keys(paginated).length;
  dispatch(setFeedback(`your asset will be downloaded in ${index} ${index === 1 ? 'file' : 'files'}`));
  for (let i = 1; i <= index; i++) {
    const promise = new Promise(resolve => {
      setTimeout(async () => {
        await downloadCallback({ ...input, id: i, value: paginated[i] })
        resolve();
      }, 0);
    })
    await promise;
  }

  dispatch(setFeedback('downloaded successfully'));
}