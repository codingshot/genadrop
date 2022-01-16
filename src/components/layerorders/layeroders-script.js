export const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  marginBottom: 8,
  // background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle
});

export const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
  width: "100%"
});