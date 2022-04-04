const isUnique = (props) => {
  const { preview, rule } = props;

  const stringPreview = JSON.stringify(preview);
  for (const r of rule) {
    const stringRule = JSON.stringify(r);
    if (stringRule === stringPreview) return false;
  }
  return true;
};
export default isUnique;
