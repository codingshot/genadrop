import axios from "axios";
import { getAlgoData } from "../../utils/arc_ipfs";

export const getNftData = async collection => {
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
      nftObj.image_url = response.data.properties.file_url
      nftArr.push(nftObj)
    } catch (error) {
      console.error(error);
    }
  }
  return nftArr
}

export const mapAttributeToFilter = data => {
  let attributes = {}
  data.forEach(d => {
    d.attributes.forEach(attr => {
      if (attr.trait_type in attributes) {
        let obj = {}
        let newValue = [...attributes[attr.trait_type].value, attr.value]
        obj['trait_type'] = attr.trait_type
        obj['value'] = newValue
        attributes[attr.trait_type] = obj
      } else {
        let obj = {}
        obj['trait_type'] = attr.trait_type
        obj['value'] = [attr.value]
        attributes[attr.trait_type] = obj
      }
    })
  })

  return Object.keys(attributes).map(key => attributes[key])
}
