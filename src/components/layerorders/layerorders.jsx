/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-unused-expressions */
import React, { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import classes from "./layerorders.module.css";
import { GenContext } from "../../gen-state/gen.context";
import {
  addLayer,
  setLayers,
  setCollectionName,
  removeLayer,
  setPrompt,
  promptDeleteLayer,
  setCombinations,
  setLayerAction,
} from "../../gen-state/gen.actions";
import Layer from "../layer/layer";
import { getCombinations, getItemStyle, getListStyle } from "./layeroders-script";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { ReactComponent as AddIcon } from "../../assets/icon-plus.svg";
import LayerInput from "./Layer-Input/LayerInput";
// import Tooltip from "./Tooltip/Tooltip";
import { ReactComponent as EditIcon } from "../../assets/icon-edit.svg";
import { ReactComponent as MarkIcon } from "../../assets/icon-mark.svg";

const LayerOrders = () => {
  const { layers, rule, dispatch, collectionName, isRule, promptLayer } = useContext(GenContext);
  const [state, setState] = useState({
    prompt: false,
    inputValue: "",
    renameAction: false,
    activeInput: false,
    showInfo: true,
  });

  const { prompt, inputValue, renameAction, activeInput, showInfo } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;
    const newLayers = [...layers];
    const [removed] = newLayers.splice(source.index, 1);
    newLayers.splice(destination.index, 0, removed);
    dispatch(setLayers(newLayers));
    handleSetState({ inputValue: "" });
    dispatch(
      setLayerAction({
        type: "order",
      })
    );
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
    dispatch(
      setLayerAction({
        type: "add",
      })
    );
  };

  const handleRemoveLayer = (layer) => {
    dispatch(setPrompt(promptDeleteLayer(layer)));
  };

  const handleAddClick = () => {
    !isRule && handleSetState({ prompt: true });
    window.sessionStorage.isTooltip = "true";
  };

  const handleRename = async (event) => {
    event.preventDefault();
    if (!inputValue) return;
    handleSetState({ renameAction: false });
    dispatch(setCollectionName(inputValue));
    dispatch(
      setLayerAction({
        type: "name",
      })
    );
  };

  useEffect(() => {
    if (promptLayer) {
      dispatch(removeLayer(promptLayer));
      dispatch(promptDeleteLayer(null));
    }
  }, [promptLayer]);

  useEffect(() => {
    dispatch(setCombinations(getCombinations({ layers, rule, dispatch })));
  }, [layers, rule]);

  useEffect(() => {
    handleSetState({ inputValue: collectionName });
  }, [collectionName]);

  return (
    <div className={classes.container}>
      <div className={classes.collectionNameContainer}>
        <div className={classes.collectionName}>
          {renameAction ? (
            <form onSubmit={handleRename}>
              <input
                type="text"
                onChange={(e) => handleSetState({ inputValue: e.target.value })}
                value={inputValue}
                placeholder="Enter collection name"
                autoFocus
              />
            </form>
          ) : (
            <label>{collectionName}</label>
          )}

          <div className={classes.editBtn}>
            {renameAction ? (
              <MarkIcon onClick={handleRename} className={classes.editIcon} />
            ) : (
              <EditIcon onClick={() => handleSetState({ renameAction: true })} className={classes.editIcon} />
            )}
          </div>
        </div>
      </div>

      <div className={classes.layerorder}>
        <div className={classes.layerHeadWrapper}>
          {showInfo ? (
            <div className={classes.info}>
              <p>Please, ensure that background layer is at the bottom, you can drag layers down or up to re-order</p>
              <CloseIcon onClick={() => handleSetState({ showInfo: false })} className={classes.closeBtn} />
            </div>
          ) : null}
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
                  className={`${classes.list} ${showInfo && classes.active}`}
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
              <LayerInput
                handleAddLayer={handleAddLayer}
                setPrompt={(promptAdded) => handleSetState({ prompt: promptAdded })}
              />
            </div>
          ) : (
            <div className={classes.addBtnContainer}>
              {/* <Tooltip isModal={isCreateModal} /> */}
              <button type="button" className={classes.addBtn} onClick={handleAddClick}>
                <AddIcon className={classes.addIcon} />
                Add Layer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayerOrders;
