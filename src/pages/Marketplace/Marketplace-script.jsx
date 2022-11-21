import moment from "moment";
import { getFormatedPrice } from "../../utils";
import supportedChains from "../../utils/supportedChains";

const filterByListed = (collections, account) => {
  return collections.filter(({ price, sold }) => price && !sold);
  // return collections.filter(({ price, owner }) => !price && owner === account);
};

const filterByNOtListed = (collections, account) => {
  return collections.filter(({ isListed }) => !isListed);
};

const filterByOnAuchtion = (collections) => {
  return collections.filter(({ isListed }) => isListed);
};

const sortByDateAscending = (col) => {
  const collection = [...col].sort((a, b) => moment(new Date(b.createdAt)).diff(new Date(a.createdAt)));
  return collection;
};

const sortByDateDescending = (col) => {
  const collection = [...col].sort((a, b) => moment(new Date(a.createdAt)).diff(new Date(b.createdAt)));
  return collection;
};

const sortByPriceAscending = (col) => {
  const collection = [...col].sort((a, b) => Number(a.price) - Number(b.price));
  return collection;
};

const sortByPriceDescending = (col) => {
  const collection = [...col].sort((a, b) => Number(b.price) - Number(a.price));
  return collection;
};

const sortByNameAscending = (col) => {
  const collection = [...col].sort((a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return -1;
  });
  return collection;
};

const sortByNameDescending = (col) => {
  const collection = [...col].sort((a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
    return 1;
  });
  return collection;
};

export const sortBy = ({ value, collections }) => {
  switch (value) {
    case "newest":
      return sortByDateAscending(collections);

    case "oldest":
      return sortByDateDescending(collections);

    case "highest price":
      return sortByPriceDescending(collections);

    case "lowest price":
      return sortByPriceAscending(collections);

    case "a - z":
      return sortByNameAscending(collections);

    case "z - a":
      return sortByNameDescending(collections);
    default:
      break;
  }
};

export const filterBy = ({ value, collections, account }) => {
  switch (value) {
    case "listed":
      return filterByListed(collections, account);
    case "not listed":
      return filterByNOtListed(collections, account);
    case "on auction":
      return filterByOnAuchtion(collections);
    default:
      break;
  }
};

export const rangeBy = async ({ value, collections }) => {
  const result = await Promise.all(
    collections.map(async (col) => {
      const rate = await getFormatedPrice(supportedChains[col.chain].coinGeckoLabel || supportedChains[col.chain].id);
      const price = Number(rate) * Number(col.price);
      return price >= value.minPrice && price <= value.maxPrice ? col : null;
    })
  );

  return result.filter((res) => res);
};

export const shuffle = (array) => {
  for (let i = 0; i < 100; i += 1) {
    for (let x = array.length - 1; x > 0; x -= 1) {
      const j = Math.floor(Math.random() * (x + 1));
      [array[x], array[j]] = [array[j], array[x]];
    }
  }
  return array;
};

export const getCollectionsByDate = ({ collections, date }) => {
  if (date === 0) return collections;

  const currentDate = new Date();
  const currentDateTime = currentDate.getTime();
  const last30DaysDate = new Date(currentDate.setDate(currentDate.getDate() - date));
  const last30DaysDateTime = last30DaysDate.getTime();

  return collections.filter((nft) => {
    // let newDate;
    // if (c?.createdAt?.seconds) {
    //   newDate = c.createdAt.seconds;
    // } else {
    //   newDate = c.createdAt;
    // }

    const elementDateTime = new Date(nft?.createdAt).getTime();
    if (elementDateTime <= currentDateTime && elementDateTime > last30DaysDateTime) {
      return true;
    }
    return false;
  });
};

export const getCollectionsByChain = ({ collections, chain, mainnet }) => {
  if (chain === "All Chains") {
    return collections;
  }
  const mapChainLabelToId = {};
  const chains = Object.values(supportedChains);
  chains
    .filter((chain) => mainnet === chain.isMainnet)
    .forEach((chain) => {
      mapChainLabelToId[chain.chain] = chain;
    });
  return collections.filter((col) => col.chain === mapChainLabelToId[chain]?.networkId);
};

export const getCollectionsBySearch = ({ collections, search }) => {
  if (!collections.length) return null;
  const value = search.trim().toLocaleLowerCase();
  return collections.filter(
    (el) =>
      el.name?.toLowerCase().includes(value) ||
      el.description?.toLowerCase().includes(value) ||
      el.owner?.toLowerCase().includes(value) ||
      el.contractAddress?.toLowerCase().includes(value) ||
      el.collection_contract?.toLowerCase().includes(value)
  );
};

export const getCollectionsByCategory = ({ collections, category, activeChain }) => {
  if (category === "All") return collections;
  let singleNFTs = collections.filter((col) => !col.nfts);

  singleNFTs = singleNFTs.filter((col) => {
    let categoryCheck = col.properties ? col.properties : col.ipfs_data?.properties;

    categoryCheck = categoryCheck?.filter((property) => {
      return property.trait_type === "Category" && property.value === category;
    });
    return categoryCheck.length;
  });
  return [...singleNFTs];
};
