export const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  marginBottom: 8,
  ...draggableStyle,
});

export const getListStyle = () => ({
  width: "100%",
});

export const getCombinations = (layers) => {
  const amtArr = layers.map((layer) => layer.traitsAmount).filter((amt) => amt);
  if (!amtArr.length) return 0;
  return amtArr.reduce((acc, curr) => acc * curr, 1);
};
