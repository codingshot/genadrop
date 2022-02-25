export const mapAttributeToFilter = data => {
  let attributes = {}
  data.forEach(({ ipfs_data }) => {
    ipfs_data.properties.forEach(attr => {
      if (attr.trait_type in attributes) {
        let obj = {}
        let newValue = [...attributes[attr.trait_type].value, attr.value]
        obj['trait_type'] = attr.trait_type
        obj['value'] = newValue
        obj['rarity'] = attr.rarity
        attributes[attr.trait_type] = obj
      } else {
        let obj = {}
        obj['trait_type'] = attr.trait_type
        obj['value'] = [attr.value]
        obj['rarity'] = attr.rarity
        attributes[attr.trait_type] = obj
      }
    })
  })

  return Object.keys(attributes).map(key => attributes[key]);
}
