import polygonIcon from '../../assets/icon-polygon.svg';
import algoIcon from '../../assets/icon-algo.svg';
import nearIcon from '../../assets/icon-near.svg';
import celoIcon from '../../assets/icon-celo.svg';

export const chainIcon = {
  "Polygon": polygonIcon,
  "Algorand": algoIcon,
  "Near": nearIcon,
  "Celo": celoIcon
}

export const transformArrayOfArraysToArrayOfObjects = data => {
  const transformShape = {
    0: 'itemId',
    1: 'nftContract',
    2: 'tokenId',
    3: 'seller',
    4: 'owner',
    5: 'category',
    6: 'price',
    7: 'isSold',
    8: 'url'
  }

  return data.map(el => {
    let obj = {};
    if(el.length !== 9) return console.log('data format not valid');
    el.forEach((i, idx) => {
      obj[transformShape[idx]] = i
    })
    return obj
  });
}