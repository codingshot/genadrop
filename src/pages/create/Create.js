import './style.css'
import ConnectWallet from '../../components/ConnectWallet';
import { LayersData } from '../../model/CreateModel'
import { useState, useEffect } from 'react';
import ArrowIcon from '../../assets/arrow.svg'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { orderBy, range, fill } from 'lodash'
import { EditText } from 'react-edit-text';
// const mergeImages = require('merge-images');
// import mergeImages from 'merge-images'
// import { Image, Canvas } from 'canvas';
// import ImageDataURI from 'image-data-uri';

function Create() {

    const [layersData, setLayersData] = useState(LayersData)
    const [mintAmount, setMintAmount] = useState(0)
    const [traitCombinations, setTraitCombinations] = useState(0)
    const [selected, setSelected] = useState([])

    const handleChange = (newLayerList) => {
        setLayersData(orderBy(newLayerList, "position"))
    }

    useEffect(() => {
        setSelected(
            s => s.map(selectedItem => {
                // item.layerTitle
                let filteredLayers = layersData.filter(item => item.layerTitle === selectedItem.layerTitle)

                // console.log(filteredLayers)
                return { ...selectedItem, position: filteredLayers[0].position };
            }
            )
        )

        setTraitCombinations((layersData.map(item => item.traitsAmount === 0 ? 1 : item.traitsAmount)).reduce((a, b) => a * b, 1))

    }, [layersData])

    const handleSelected = (selectedTrait) => { setSelected([...selected.filter(item => item.layerTitle !== selectedTrait.layerTitle), selectedTrait]); }

    const changeMintAmount = (event) => setMintAmount(event.target.value)

    const changeMintCombination = (combination) => setTraitCombinations(combination)
    // adding new layer
    const addNewLayer = (newLayerTitle) => {
        const layer = {
            id: layersData.length + 1,
            position: layersData.length + 1,
            layerTitle: newLayerTitle,
            traitsAmount: 0,
            traits: []
        }
        setLayersData([...layersData, layer])
    }
    const deleteTrait = (position, index) => {
        setLayersData(
            layersData.map(item => item.position === position ? { ...item, traitsAmount: item.traitsAmount - 1, traits: [...layersData[position - 1].traits.filter((_, traitIndex) => index !== traitIndex)] } : item)
        )
        setSelected(selected.filter(item => item.position !== position))


    }

    const addTrait = (file, id) => {
        // console.log(file)
        let newTrait = {
            traitTitle: 'Title',
            rarity: "0",
            src: URL.createObjectURL(file)
        }

        setLayersData(layersData.map(item => {
            if (item.id !== id)
                return item;
            else {
                let traits = [...item.traits, newTrait]
                return { ...item, traitsAmount: item.traitsAmount + 1, traits }
            }
        })
        )
        // if (layersData.length > 1)
        //     setTraitCombinations((layersData.map(item => item.traitsAmount)).reduce((a, b) => a * b, 1))


    }
    const editText = (event, position, name, index) => {

        if (name === 'layerTitle') {
            setSelected(selected.map(data => data.position !== position ? data : { ...data, "layerTitle": event }))
            setLayersData(layersData.map(item => item.position !== position ? item : { ...item, [name]: event }))

        } else if (name === "traitTitle") {
            setSelected(selected.map(data => data.position !== position ? data : { ...data, "traitTitle": event }))
            setLayersData(layersData.map(item => item.position !== position ? item : { ...item, traits: item.traits.map((data, i) => i !== index ? data : { ...data, "traitTitle": event }) }))
        } else if (name === 'rarity') {
            setSelected(selected.map(data => data.position !== position ? data : { ...data, "rarity": event }))
            setLayersData(layersData.map(item => item.position !== position ? item : { ...item, traits: item.traits.map((data, i) => i !== index ? data : { ...data, "rarity": event }) }))
        }



    }
    const downloadZippedImages = () => {
        if (mintAmount > traitCombinations) {
            console.log("Error: mints are greater than the combination.")

        } else if (traitCombinations === 0) {
            console.log("Error: Combinations are zero")
        } else if (mintAmount === 0) {
            console.log("Error: Mints are zero")
        } else {
            console.log("download is in progress")
            // layersData.map(
            //     layer=> layer.traits.map(trait=>console.log(trait))
            // )
            // const images = selected.map(item => item.src)
            // console.log(selected)
            // const b64 = mergeImages(images, { Canvas: Canvas, Image: Image });
            // console.log(b64)
            // b64.then(b => document.querySelector('.testImage').src = b)
            // ImageDataURI.outputFile(b64, "D:/a.png")
            //     .then(res => console.log(res))
            const traits = layersData.filter(item => item.traits.length !== 0)

            let combinations = new Array(fill(Array(new Array(mintAmount)), []))
            console.log(combinations)
            traits.forEach(element => {
                console.log(element.traits);
            });
            console.log(traits[0].traits.length)
        }
    }
    return (
        <div className='create-page'>
            <ConnectWallet />
            <LayerOrders
                data={layersData}
                handleChange={handleChange}
                addNewLayer={addNewLayer}
                editText={editText}
            />
            <Layers
                data={layersData}
                handleSelected={handleSelected}
                deleteTrait={deleteTrait}
                addTrait={addTrait}
                editText={editText}
            />
            {
                selected.length === 0 ? null : <Presentation
                    // data={layersData}
                    mintAmount={mintAmount}
                    changeMintAmount={changeMintAmount}
                    traitCombinations={traitCombinations}
                    changeMintCombination={changeMintCombination}
                    selectedTraits={selected}
                    downloadZippedImages={downloadZippedImages}
                />
            }
            <img className='testImage' src='' alt='' />
        </div>
    )
}

function LayerOrders(Props) {
    const { data, editText } = Props
    const [newLayer, setNewLayer] = useState(false)
    const [newLayerTitle, setNewLayerTitle] = useState('')

    const onDragEnd = (result) => {
        const { destination, source } = result;
        // console.log("result: ", result)
        // console.log("destination: ", destination, "source: ", source)
        if (!destination || !source) {
            return;
        }
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        const directionOfDrag = destination.index > source.index ? "GREATER" : "LESS";
        let affectedRange;
        if (directionOfDrag === "GREATER") {
            affectedRange = range(source.index, destination.index + 1);
        } else {
            affectedRange = range(destination.index, source.index);
        }
        const reorderList = data.map(listItem => {
            // console.log("Source: ", source.index === listItem.id ? listItem : "")
            // console.log("Destination: ", destination.index === listItem.id ? listItem : "")
            if (listItem.id === parseInt(result.draggableId)) {
                listItem = { ...listItem, position: destination.index }
                // console.log(listItem)
                return listItem;

            } else if (affectedRange.includes(listItem.position)) {
                if (directionOfDrag === "GREATER") {
                    listItem.position -= 1;
                    return listItem;
                } else {
                    listItem.position += 1;
                    return listItem;
                }

            } else {
                return listItem;
            }
        })
        // console.log(reorderList)
        Props.handleChange(reorderList)

    }
    return (
        <section className="layer-orders">
            <h3 className="collection-title">Collection Name</h3>

            <div className="layer-orders-list">
                <h3 className="list-title">Layer Orders</h3>
                <h5 className="column1-title">Layer Name</h5>
                <h5 className="column2-title">Traits</h5>

                {/* draggable list */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='LAYERLIST'>
                        {
                            (provided) => (
                                <div className='list-container' ref={provided.innerRef} {...provided.droppableProps}>
                                    {
                                        orderBy(Props.data, "position").map(item => (
                                            <Draggable draggableId={item.id.toString()} index={item.position} key={item.id} d={item}>
                                                {

                                                    (provided) => {
                                                        return (
                                                            <div className='list' key={item.id} {...provided.draggableProps} ref={provided.innerRef}>
                                                                <img src={ArrowIcon} alt="" {...provided.dragHandleProps} />
                                                                <div className="white-space"></div>
                                                                <h4><EditText value={item.layerTitle} onChange={(event) => editText(event, item.position, "layerTitle")} /></h4>
                                                                <span>{item.traitsAmount}</span>
                                                            </div>
                                                        )
                                                    }
                                                }
                                            </Draggable>
                                        )
                                        )
                                    }
                                    {provided.placeholder}
                                </div>
                            )
                        }

                    </Droppable>
                </DragDropContext>

                {
                    newLayer ?

                        <div className='input-layer'>
                            <input
                                type='text'
                                placeholder="New layer name..."
                                name='newLayerTitle'
                                value={newLayerTitle}
                                onChange={(event) => setNewLayerTitle(event.target.value)}
                            />
                            <button onClick={(event) => {
                                setNewLayer(false)
                                if (newLayerTitle) {
                                    Props.addNewLayer(newLayerTitle)
                                    setNewLayerTitle('')
                                }
                            }}>Add</button>
                        </div>

                        :

                        <button className="new-layer-name-btn" onClick={() => setNewLayer(true)}>
                            <span>+</span>
                            New Layer Name
                        </button>
                }

            </div>
        </section>
    )
}

function Layers(Props) {
    const [file, setFile] = useState(null)
    const { editText } = Props
    // console.log(file);
    return (
        <section className="layers-section">
            {
                Props.data.map(item => {
                    return (
                        <div className='layer' key={item.id}>
                            <div className="content">
                                <h3 className='layer-title'><EditText value={item.layerTitle} onChange={(event) => editText(event, item.position, "layerTitle")} /></h3>
                                <div className='traits'>
                                    {
                                        item.traits.map((trait, index) => {
                                            return (
                                                <div className='trait' key={index}>
                                                    <div className='delete-btn' onClick={() => Props.deleteTrait(item.position, index)}>X</div>
                                                    <img src={trait.src} alt='' onClick={() => { Props.handleSelected({ layerTitle: item.layerTitle, position: item.position, ...trait }) }} />
                                                    <h4><EditText value={trait.traitTitle} onChange={(event) => editText(event, item.position, "traitTitle", index)} /> </h4>
                                                    <h4 style={{ display: "flex", justifyContent: "center" }}>Rarity: &nbsp;<EditText value={trait.rarity} onChange={(event) => editText(event, item.position, "rarity", index)} /> </h4>
                                                </div>
                                            )
                                        })


                                    }
                                </div>
                            </div>
                            {/* <button>Upload</button> */}
                            <Popup trigger={<button> Upload</button>} position="right center" modal>
                                {close => (
                                    <div className="modal">
                                        <button className="close" onClick={close}>
                                            &times;
                                        </button>
                                        <div className="header"> Modal Title </div>
                                        <div className="content">
                                            <input type='file' onChange={(event) => { setFile(event.target.files[0]) }} />
                                        </div>
                                        <div className="actions">
                                            <button
                                                className="button"
                                                onClick={() => {
                                                    if (file) {
                                                        Props.addTrait(file, item.id);
                                                        setFile(null)
                                                    }
                                                    close();
                                                }}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Popup>
                        </div>
                    )
                })
            }
        </section>
    )
}


function Presentation(Props) {
    let { mintAmount, changeMintAmount, traitCombinations, selectedTraits, downloadZippedImages } = Props
    // console.log(data)
    // console.log(selectedTraits)

    return (
        <section className='presenation-section'>
            <div className='image-display'>
                {
                    selectedTraits.map((item, index) => {
                        return (
                            <img src={item.src} alt='' key={index} style={{ zIndex: item.position }} />
                        )
                    })
                }
            </div>
            <div className='description'>
                {
                    selectedTraits.length !== 0 ? <h4><strong>Description</strong></h4> : null
                }
                {
                    selectedTraits.map((item, index) => {
                        return (
                            <p key={index}><strong>{item.layerTitle}: </strong>{item.traitTitle}: Rarity {item.rarity}%</p>
                        )
                    })
                }
            </div>
            <button className='download-zip-btn' onClick={() => { downloadZippedImages() }}>download zip</button>
            <button className='mint-btn'>mint {mintAmount}</button>
            <div className='mint'>
                <div className='mint-amount'>
                    <label>Mint Amount:</label>
                    <input type='text' value={mintAmount} size='10' onChange={(event) => changeMintAmount(event)} />
                </div>
                <div className='mint-combinations'>
                    <label>Combinations</label>
                    <span>{traitCombinations}</span>
                </div>

            </div>
        </section>
    )
}

export default Create;
