export const mapAttributeToFilter = (data) => {
  const attributes = {};
  data.forEach(({ ipfs_data }) => {
    ipfs_data.properties.forEach((attr) => {
      if (attr.trait_type in attributes) {
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
