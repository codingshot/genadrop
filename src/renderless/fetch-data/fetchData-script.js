export const parseAlgoCollection = (result) => {
  const resValues = Object.values(result);
  return resValues.map((val) => ({
    name: val.name,
    description: val.description,
    imageUrl: val.image_url,
    chainId: val.chain,
    type: "collections",
    chain: "algorand",
  }));
};
export const parseAlgoSingle = (result) => {
  const resValues = Object.values(result);
  return resValues.map((val) => ({
    name: val.name,
    description: val.description,
    imageUrl: val.image_url,
    chainId: val.chain,
    type: "1of1",
    chain: "algorand",
  }));
};
export const parsePolygonCollection = (result) => {
  return result.map((val) => ({
    name: val.name,
    description: val.description,
    imageUrl: val.image_url,
    chainId: val.chain,
    type: "collections",
    chain: "polygon",
  }));
};
export const parsePolygonSingle = (result) => {
  return result.map((val) => ({
    name: val.name,
    description: val.description,
    imageUrl: val.image_url,
    chainId: val.chain,
    type: "1of1",
    chain: "polygon",
  }));
};
export const parseCeloCollection = (result) => {
  return result.map((val) => ({
    name: val.name,
    description: val.description,
    imageUrl: val.image_url,
    chainId: val.chain,
    type: "collections",
    chain: "celo",
  }));
};
export const parseCeloSingle = (result) => {
  return result.map((val) => ({
    name: val.name,
    description: val.description,
    imageUrl: val.image_url,
    chainId: val.chain,
    type: "1of1",
    chain: "celo",
  }));
};
export const parseAuroraCollection = (result) => {
  return result.map((val) => ({
    name: val.name,
    description: val.description,
    imageUrl: val.image_url,
    chainId: val.chain,
    type: "collections",
    chain: "aurora",
  }));
};
export const parseAuroraSingle = (result) => {
  return result.map((val) => ({
    name: val.name,
    description: val.description,
    imageUrl: val.image_url,
    chainId: val.chain,
    type: "1of1",
    chain: "aurora",
  }));
};
