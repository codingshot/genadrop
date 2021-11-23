import classes from './layerorders.module.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useContext, useState } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { addLayer, orderLayers, setCollectionName } from '../../gen-state/gen.actions';
import { removeLayer } from '../../gen-state/gen.actions';
import Layer from '../layer/layer';
import Prompt from '../prompt/prompt';
import { v4 as uuid } from 'uuid';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  marginBottom: 8,
  // background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
  width: "100%"
});

const LayerOrders = () => {

  const { layers, dispatch, collectionName } = useContext(GenContext);
  const [prompt, setPrompt] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [renameAction, setRenameAction] = useState(false);

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return
    const newList = [...layers];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed);
    dispatch(orderLayers(newList));
  }

  const handleAddLayer = value => {
    if (!value) return
    dispatch(addLayer({ "id": uuid(), "traitsAmount": 0, "layerTitle": value, traits: [] }));
  }

  const handleRemoveLayer = layer => {
    dispatch(removeLayer(layer))
  }

  const handleChange = ({ target: { value } }) => {
    setInputValue(value);
  }

  const handleRename = () => {
    if (renameAction) {
      setRenameAction(false)
      setInputValue("")
      dispatch(setCollectionName(inputValue))
    } else {
      setRenameAction(true)
    }
  }

  return (
    <div className={classes.container}>
      <div
        className={classes.renameBtn}
      >
        {renameAction
          ?
          <form onSubmit={handleRename}>
            <input
              className={`${classes.renameInput} ${classes.active}`}
              type="text"
              onChange={handleChange}
              value={inputValue}
              autoFocus
            />
          </form>
          :
          collectionName
            ? <div className={classes.nameHeader}>{collectionName}</div>
            : <div className={classes.nameHeader}>Collection Name</div> 
        }
        <div className={classes.editBtn} onClick={handleRename}>
          {renameAction
            ? <i className="far fa-check-square"></i>
            : <i className="far fa-edit"></i>
          }
        </div>
      </div>

      <div className={classes.layerorder}>
        <div className={classes.layerHeadWrapper}>
          <div className={classes.layerorderHeader}>Layer Orders</div>
          <div className={classes.line}></div>
          <div className={classes.layer_trait}>
            <div className={classes.layerHeader}>layer name</div>
            <div className={classes.traitHeader}>traits</div>
          </div>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                className={classes.list}
              >
                {layers.map((item, index) => (
                  <Draggable key={index} draggableId={index + ''} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <div className={`${classes.layerWrapper} ${index % 2 === 0 ? classes.even : classes.odd}`}>
                          <Layer name={item.layerTitle} id={index} trait={item.traitsAmount} click={() => handleRemoveLayer(item)} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        {
          prompt
            ? <div className={classes.promptWrapper}>
              <Prompt handleAddLayer={handleAddLayer} setPrompt={setPrompt} />
            </div>
            :
            <button className={classes.addBtn} onClick={() => setPrompt(true)}><i className="fas fa-plus"></i>New Layer Name</button>
        }

      </div>
    </div>
  )
}

export default LayerOrders;



