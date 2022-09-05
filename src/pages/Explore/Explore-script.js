export const mapAttributeToFilter = (data) => {
  const attributes = {};
  data.forEach(({ ipfs_data }) => {
    ipfs_data.properties.forEach((attr) => {
      if (attr.trait_type in attributes) {
        if (attributes[attr.trait_type].value.includes(attr.value)) return;
        const obj = {};
        const newValue = [...attributes[attr.trait_type].value, attr.value];
        const newRarity = [...attributes[attr.trait_type].rarity, attr.rarity];
        obj.trait_type = attr.trait_type;
        obj.value = newValue;
        obj.rarity = newRarity;
        attributes[attr.trait_type] = obj;
      } else {
        const obj = {};
        obj.trait_type = attr.trait_type;
        obj.value = [attr.value];
        obj.rarity = [attr.rarity];
        attributes[attr.trait_type] = obj;
      }
    });
  });
  return Object.keys(attributes).map((key) => attributes[key]);
};

export const groupAttributesByTraitType = (attributes) => {
  const obj = {};
  attributes &&
    attributes.length &&
    attributes.forEach((attr) => {
      try {
        obj[attr.trait_type] = [...obj[attr.trait_type], attr];
      } catch (error) {
        obj[attr.trait_type] = [attr];
      }
    });
  return obj;
};

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

export const sortBy = ({ value, NFTCollection }) => {
  switch (value) {
    case "newest":
      return sortByDateAscending(NFTCollection);

    case "oldest":
      return sortByDateDescending(NFTCollection);

    case "highest price":
      return sortByPriceDescending(NFTCollection);

    case "lowest price":
      return sortByPriceAscending(NFTCollection);

    case "a - z":
      return sortByNameAscending(NFTCollection);

    case "z - a":
      return sortByNameDescending(NFTCollection);
    default:
      break;
  }
};

export const filterBy = ({ value, NFTCollection }) => {
  switch (value) {
    case "listed":
      return filterByListed(NFTCollection);
    case "not listed":
      return filterByNOtListed(NFTCollection);
    case "on auction":
      return filterByOnAuchtion(NFTCollection);
    default:
      break;
  }
};
