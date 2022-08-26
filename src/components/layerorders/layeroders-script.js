import { setNotification } from "../../gen-state/gen.actions";

export const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  marginBottom: 8,
  ...draggableStyle,
});

export const getListStyle = () => ({
  width: "100%",
});

export const getCombinations = ({ layers, rule, dispatch }) => {
  let traitCounts = {};
  layers.forEach((layer) => {
    traitCounts[layer.id] = layer.traitsAmount;
  });

  const amtArr = layers.map((layer) => layer.traitsAmount).filter((amt) => amt);
  if (!amtArr.length) return 0;
  let combinations = amtArr.reduce((acc, curr) => acc * curr, 1);
  let diff = 0;

  for (let r of rule) {
    let div = combinations;
    let combined = 0;

    r.forEach((asset, idx) => {
      let result = div / traitCounts[asset.layerId];
      if (idx === 0) {
        combined = combinations - result;
        div = combined;
      } else {
        combined = combined + result;
        div = result;
      }
    });
    diff += combinations - combined;
  }

  const res = combinations - diff;
  if (!res && rule.length) {
    dispatch(
      setNotification({
        message: "You now have 0 combinations. Remove a conflict rule or add more layers/traits to continue.",
        type: "warning",
      })
    );
  }
  return res > 0 ? res : 0;
};
