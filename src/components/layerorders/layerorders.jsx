import React, { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import classes from "./layerorders.module.css";
import { GenContext } from "../../gen-state/gen.context";
import {
  addLayer,
  orderLayers,
  setCollectionName,
  setLoader,
  setNotification,
  removeLayer,
  setPrompt,
  promptDeleteLayer,
} from "../../gen-state/gen.actions";
import Layer from "../layer/layer";
import Prompt from "../prompt/prompt";
import { getItemStyle, getListStyle } from "./layeroders-script";
import { fetchCollections } from "../../utils/firebase";
import editIcon from "../../assets/icon-edit.svg";
import markIcon from "../../assets/icon-mark.svg";
import plusIcon from "../../assets/icon-plus.svg";

const LayerOrders = () => {
  const { layers, dispatch, collectionName, isRule, promptLayer } = useContext(GenContext);
  const [state, setState] = useState({
    prompt: false,
    inputValue: "",
    renameAction: false,
    activeInput: false,
  });

  const { prompt, inputValue, renameAction, activeInput } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;
    const newLayers = [...layers];
    const [removed] = newLayers.splice(source.index, 1);
    newLayers.splice(destination.index, 0, removed);
    dispatch(orderLayers(newLayers));
    handleSetState({ inputValue: "" });
  };

  const handleAddLayer = (value) => {
    if (!value) return;
    dispatch(
      addLayer({
        id: uuid(),
        traitsAmount: 0,
        layerTitle: value,
        traits: [],
      })
    );
  };

  const handleRemoveLayer = (layer) => {
    dispatch(setPrompt(promptDeleteLayer(layer)));
  };

  const getCollectionsNames = async () => {
    const collections = await fetchCollections();
    const names = [];
    collections.forEach((col) => {
      names.push(col.name);
    });
    return names;
  };

  const handleRename = async (event) => {
    event.preventDefault();
    if (!inputValue) return;
    try {
      dispatch(setLoader("saving..."));
      const names = await getCollectionsNames();
      const isUnique = names.find((name) => name.toLowerCase() === inputValue.toLowerCase());
      if (isUnique) {
        dispatch(setNotification(`${inputValue} already exist. Please choose another name`));
      } else {
        handleSetState({ renameAction: false });
        dispatch(setCollectionName(inputValue));
      }
    } catch (error) {
      dispatch(setNotification("could not save your collection name, please try again."));
    }
    dispatch(setLoader(""));
  };

  useEffect(() => {
    if (promptLayer) {
      dispatch(removeLayer(promptLayer));
      dispatch(promptDeleteLayer(null));
    }
  }, [promptLayer]);

  return (
    <div className={classes.container}>
      <div className={classes.collectionNameContainer}>
        <div className={classes.collectionName}>
          {renameAction ? (
            <form onSubmit={handleRename}>
              <input
                className={`${classes.renameInput} ${classes.active}`}
                type="text"
                onChange={(e) => handleSetState({ inputValue: e.target.value })}
                value={inputValue}
                autoFocus
              />
            </form>
          ) : collectionName ? (
            <div className={classes.nameHeader}>{collectionName}</div>
          ) : (
            <div className={classes.nameHeader}>Collection Name</div>
          )}
          <div className={classes.editBtn}>
            {renameAction ? (
              <img onClick={handleRename} src={markIcon} alt="" />
            ) : (
              <img onClick={() => handleSetState({ renameAction: true })} src={editIcon} alt="" />
            )}
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
                    <Draggable key={index} draggableId={`${index}`} index={index}>
                      {(providedProp, snapshotProp) => (
                        <div
                          ref={providedProp.innerRef}
                          {...providedProp.draggableProps}
                          {...providedProp.dragHandleProps}
                          style={getItemStyle(snapshotProp.isDragging, providedProp.draggableProps.style)}
                        >
                          <Layer
                            name={item.layerTitle}
                            id={item.id}
                            trait={item.traitsAmount}
                            click={() => handleRemoveLayer(item)}
                            activeInput={activeInput}
                            setActiveInput={(input) => handleSetState({ activeInput: input })}
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
          {prompt ? (
            <div className={classes.promptWrapper}>
              <Prompt
                handleAddLayer={handleAddLayer}
                setPrompt={(promptAdded) => handleSetState({ prompt: promptAdded })}
              />
            </div>
          ) : (
            <button
              type="button"
              className={classes.addBtn}
              onClick={() => !isRule && handleSetState({ prompt: true })}
            >
              Add Layer <img src={plusIcon} alt="plus-icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayerOrders;
