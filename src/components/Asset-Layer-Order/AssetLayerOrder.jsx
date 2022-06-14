import React, { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import classes from "./AssetLayerOrder.module.css";
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
  setCombinations,
} from "../../gen-state/gen.actions";
import AssetLayer from "../Asset-Layer/AssetLayer";
import AssetLayerInput from "../Asset-Layer-Input/AssetLayerInput";
import { getCombinations, getItemStyle, getListStyle } from "./AssetLayerOrder-Script";
import { fetchAlgoCollections } from "../../utils/firebase";
import editIcon from "../../assets/icon-edit.svg";
import markIcon from "../../assets/icon-mark.svg";
import plusIcon from "../../assets/icon-plus.svg";

const AssetLayerOrder = () => {
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

  const handleAddSampleLayers = () => {
    const sampleLayers = [
      { layerName: "Goo", dirName: "Goo" },
      { layerName: "Top Lid", dirName: "TopLid" },
      { layerName: "Bottom Lid", dirName: "BottomLid" },
      { layerName: "Shine", dirName: "Shine" },
      { layerName: "Iris", dirName: "Iris" },
      { layerName: "Eye Color", dirName: "EyeColor" },
      { layerName: "Eye Ball", dirName: "EyeBall" },
      { layerName: "Background", dirName: "Background" },
    ];
    sampleLayers.map((sample) => {
      dispatch(
        addLayer({
          id: uuid(),
          traitsAmount: 0,
          layerTitle: sample.layerName,
          traits: [],
        })
      );
    });
  };

  const getCollectionsNames = async () => {
    const collections = await fetchAlgoCollections();
    const names = [];
    collections.forEach((col) => {
      names.push(col.name);
    });
    return names;
  };

  const handleRename = async (event) => {
    event.preventDefault();
    if (!inputValue) return;
    handleSetState({ renameAction: false });
    dispatch(setCollectionName(inputValue));

    // This code below needs cross-examination;

    // event.preventDefault();
    // if (!inputValue) return;
    // try {
    //   dispatch(setLoader("saving..."));
    //   const names = await getCollectionsNames();
    //   const isUnique = names.find((name) => name.toLowerCase() === inputValue.toLowerCase());
    //   if (isUnique) {
    //     dispatch(
    //       setNotification({
    //         message: `${inputValue} already exist. try another name`,
    //         type: "warning",
    //       })
    //     );
    //   } else {
    //     handleSetState({ renameAction: false });
    //     dispatch(setCollectionName(inputValue));
    //   }
    // } catch (error) {
    //   dispatch(
    //     setNotification({
    //       message: "could not save your collection name, please try again.",
    //       type: "error",
    //     })
    //   );
    // }
    // dispatch(setLoader(""));
  };

  useEffect(() => {
    if (promptLayer) {
      dispatch(removeLayer(promptLayer));
      dispatch(promptDeleteLayer(null));
    }
  }, [promptLayer]);

  useEffect(() => {
    dispatch(setCombinations(getCombinations(layers)));
  }, [layers]);

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
          ) : (
            <div className={classes.nameHeader}>{collectionName ? collectionName : "collection name"}</div>
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
          <div className={classes.infoText}>
            Please, ensure that background layer is at the bottom, you can drag layers down or up to re-order
          </div>
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
                          <AssetLayer
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
              <AssetLayerInput
                handleAddLayer={handleAddLayer}
                setPrompt={(promptAdded) => handleSetState({ prompt: promptAdded })}
              />
            </div>
          ) : (
            <>
              <button
                type="button"
                className={classes.addBtn}
                onClick={() => !isRule && handleSetState({ prompt: true })}
              >
                Add Layer <img src={plusIcon} alt="plus-icon" />
              </button>
              <button
                style={{ marginTop: "10px" }}
                type="button"
                className={classes.addBtn}
                onClick={handleAddSampleLayers}
              >
                Try Our Samples!
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetLayerOrder;
