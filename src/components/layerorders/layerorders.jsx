import classes from './layerorders.module.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useContext, useState } from 'react';
import { GenContext } from '../../gen-state/gen.context';
import { addLayer, orderLayers, setCollectionName } from '../../gen-state/gen.actions';
import { removeLayer } from '../../gen-state/gen.actions';
import Layer from '../layer/layer';
import Prompt from '../prompt/prompt';
import { v4 as uuid } from 'uuid';
import { getItemStyle, getListStyle } from './layeroders-script';

const LayerOrders = () => {

  const { layers, dispatch, collectionName, isRule } = useContext(GenContext);
  const [state, setState] = useState({
    prompt: false,
    inputValue: "",
    renameAction: false,
    activeInput: false
  })

  const { prompt, inputValue, renameAction, activeInput } = state;

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return
    const newList = [...layers];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed);
    dispatch(orderLayers(newList));
    handleSetState({ inputValue: '' })
  }

  const handleAddLayer = value => {
    if (!value) return
    dispatch(addLayer({ "id": uuid(), "traitsAmount": 0, "layerTitle": value, traits: [] }));
  }

  const handleRemoveLayer = layer => {
    dispatch(removeLayer(layer))
  }

  const handleRename = () => {
    if (renameAction) {
      handleSetState({ renameAction: false })
      handleSetState({ inputValue: "" })
      dispatch(setCollectionName(inputValue))
    } else {
      handleSetState({ renameAction: true })
    }
  }

  return (
    <div className={classes.container}>

      <div className={classes.collectionNameContainer}>
        <div className={classes.collectionName}>
          {renameAction
            ?
            <form onSubmit={handleRename}>
              <input
                className={`${classes.renameInput} ${classes.active}`}
                type="text"
                onChange={e => handleSetState({ inputValue: e.target.value })}
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
              ? <i className="fas fa-minus"></i>
              : <i className="fas fa-pen"></i>
            }
          </div>
        </div>
      </div>

      <div className={classes.layerorder}>
        <div className={classes.layerHeadWrapper}>
          <div className={classes.layerorderHeader}>Layer Orders</div>
        </div>
        <div className={classes.listWrapper}>
          <div className={classes.layer_trait}>
            <div className={classes.layerHeader}>layer name</div>
            <div className={classes.traitHeader}>traits</div>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
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
                          <Layer
                            name={item.layerTitle}
                            id={item.id}
                            trait={item.traitsAmount}
                            click={() => handleRemoveLayer(item)}
                            activeInput={activeInput}
                            setActiveInput={input => handleSetState({ activeInput: input })}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {
            prompt
              ? <div className={classes.promptWrapper}>
                <Prompt handleAddLayer={handleAddLayer} setPrompt={prompt => handleSetState({ prompt })} />
              </div>
              :
              <button className={classes.addBtn} onClick={() => !isRule && handleSetState({ prompt: true })}>New Layer Name <i className="fas fa-plus"></i></button>
          }
        </div>
      </div>
    </div>
  )
}

export default LayerOrders;



