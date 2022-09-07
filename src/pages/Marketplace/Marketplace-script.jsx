import supportedChains from "../../utils/supportedChains";

const filterByListed = (col) => {
  return col;
};

const filterByNOtListed = (col) => {
  return col;
};

const filterByOnAuchtion = (col) => {
  return col;
};

const sortByDateAscending = (col) => {
  const collection = [...col].sort((a, b) => {
    if (!a.createdAt || !b.createAt) return a - b; // this code line is because 1of1 nfts do not yet have createAt properties
    if (typeof a.createdAt === "object") {
      return a.createdAt.seconds - b.createdAt.seconds;
    }
    return a.createdAt - b.createdAt;
  });

  return collection;
};

const sortByDateDescending = (col) => {
  const collection = [...col].sort((a, b) => {
    if (!a.createdAt || !b.createAt) return a - b; // this code line is because 1of1 nfts do not yet have createAt properties
    if (typeof a.createdAt === "object") {
      return b.createdAt.seconds - a.createdAt.seconds;
    }
    return b.createdAt - a.createdAt;
  });

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

export const filterBy = ({ value, collections }) => {
  switch (value) {
    case "listed":
      return filterByListed(collections);
    case "not listed":
      return filterByNOtListed(collections);
    case "on auction":
      return filterByOnAuchtion(collections);
    default:
      break;
  }
};

export const rangeBy = ({ value, collections }) => {
  return collections.filter((col) => Number(col.price) >= value.minPrice && Number(col.price) <= value.maxPrice);
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
  const dateToSecs = date * 60 * 60 * 24;
  if (dateToSecs > 0) {
    return collections.filter((c) =>
      typeof c.createdAt === "object" ? dateToSecs >= c.createdAt.seconds : dateToSecs >= c.createdAt
    );
  }
  return collections;
};

export const getCollectionsByChain = ({ collections, chain, mainnet }) => {
  if (chain === "All Chains") {
    return collections;
  } else {
    const mapChainLabelToId = {};
    const chains = Object.values(supportedChains);
    chains
      .filter((chain) => mainnet === chain.isMainnet)
      .forEach((chain) => {
        mapChainLabelToId[chain.chain] = chain;
      });
    return collections.filter((col) => col.chain === mapChainLabelToId[chain].networkId);
  }
};

export const getCollectionsBySearch = ({ collections, search }) => {
  if (!collections.length) return;
  let value = search.trim().toLocaleLowerCase();
  return collections.filter(
    (col) => col.name.toLowerCase().includes(value) || col.description.toLowerCase().includes(value)
  );
};
