export const isUnique = (props) => {
  const { preview, rule } = props;

  let stringPreview = JSON.stringify(preview);
  for (let r of rule) {
    let stringRule = JSON.stringify(r);
    if (stringRule === stringPreview) return false;
  }
  return true;
};
