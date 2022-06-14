const transformArrayOfArraysToArrayOfObjects = (data) => {
  const transformShape = {
    0: "itemId",
    1: "nftContract",
    2: "tokenId",
    3: "seller",
    4: "owner",
    5: "category",
    6: "price",
    7: "isSold",
    8: "url",
  };

  return data.map((el) => {
    const obj = {};
    if (el.length !== 9) return console.log("data format not valid");
    el.forEach((i, idx) => {
      obj[transformShape[idx]] = i;
    });
    return obj;
  });
};
export default transformArrayOfArraysToArrayOfObjects;
