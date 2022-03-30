export const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  marginBottom: 8,
  ...draggableStyle,
});

export const getListStyle = (isDraggingOver) => ({
  width: '100%',
});
