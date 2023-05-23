/* eslint-disable prefer-const */
/* eslint-disable no-unused-expressions */

export const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  marginBottom: 8,
  ...draggableStyle,
});

export const getListStyle = () => ({
  width: "100%",
});

export const getCombinations = ({ layers, rule }) => {
  const amtArr = layers.map((layer) => layer.traitsAmount).filter((amt) => amt);
  if (!amtArr.length) return 0;
  let combinations = amtArr.reduce((acc, curr) => acc * curr, 1);

  // loop through layers, if layer is not in rule, return the length
  let diffs = [];
  rule.forEach((r) => {
    let diff = 1;
    layers.forEach((layer) => {
      let res = r.every((el) => el.layerId !== layer.id);
      res ? (diff *= layer.traitsAmount) : null;
    });
    diffs.push(diff);
  });

  let res = diffs.reduce((acc, curr) => {
    return acc - curr;
  }, 0);

  return combinations - Math.abs(res) > 0 ? combinations - Math.abs(res) : 0;
};
