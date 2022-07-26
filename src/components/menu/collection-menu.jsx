import React, { useRef, useContext, useEffect, useState } from "react";
import classes from "./collection-menu.module.css";
import ArtCard from "../art-card/art-card";
import { GenContext } from "../../gen-state/gen.context";
import { addImage } from "../../gen-state/gen.actions";
import { handleAddBlank, handleFileChange, handleAddAssets } from "./collection-menu-script";
import { ReactComponent as AddCircularIcon } from "../../assets/icon-add.svg";
import { ReactComponent as UploadIcon } from "../../assets/icon-upload.svg";
import { ReactComponent as AddIcon } from "../../assets/icon-plus.svg";

const CollectionMenu = ({ layer }) => {
  const [state, setState] = useState({
    activeCard: "",
  });
  const { activeCard } = state;
  const { layerTitle, traits, id } = layer;
  const { dispatch, layers, imageQuality } = useContext(GenContext);
  const fileRef = useRef(null);
  const sampleLayers = [
    { layerName: "Background", dirName: "Background" },
    { layerName: "Bottom Lid", dirName: "BottomLid" },
    { layerName: "Eye Color", dirName: "EyeColor" },
    { layerName: "Eye Ball", dirName: "EyeBall" },
    { layerName: "Goo", dirName: "Goo" },
    { layerName: "Iris", dirName: "Iris" },
    { layerName: "Shine", dirName: "Shine" },
    { layerName: "Top Lid", dirName: "TopLid" },
  ];

  useEffect(() => {
    let sampleLayerName = "";
    sampleLayerName = sampleLayers.find((sLayer) => {
      return sLayer.layerName === layerTitle;
    });
    // eslint-disable-next-line no-use-before-define
    if (sampleLayerName) {
      hanldeSampleLayer(sampleLayerName.dirName);
    }
  }, []);

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleBlank = async () => {
    let canvas = document.createElement("canvas");
    const res = await handleAddBlank({
      layerId: id,
      traits,
      layerTitle,
      canvas,
      img: layers[0].traits[0].image,
      imageQuality,
    });
    dispatch(addImage(res));
  };
  // helper to add sample images
  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  // helper to add sample images
  const importAll = (r) => {
    const images = {};
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  };
  // helper to add sample images
  const imageURLtoFile = async (dataurl) => {
    let index = dataurl.lastIndexOf("/") + 1;
    let filename = dataurl.substr(index);
    const response = await fetch(dataurl);
    // here image is url/location of image
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });
    // console.log("file: ", file);
    return file;
  };
  // helper to add sample images
  const hanldeSampleLayer = (layerName) => {
    let images;
    let imgList = [];
    let imgFiles = [];
    // Don't try fixing this, require.context() requires literal string as input not variable, that's why I use swtich case in this situation.
    switch (layerName) {
      case "BottomLid":
        images = importAll(
          require.context(`../../../public/assets/CreateAssets/BottomLid`, false, /\.(png|jpe?g|svg)$/)
        );
        break;
      case "EyeColor":
        images = importAll(
          require.context(`../../../public/assets/CreateAssets/EyeColor`, false, /\.(png|jpe?g|svg)$/)
        );
        break;
      case "Goo":
        images = importAll(require.context(`../../../public/assets/CreateAssets/Goo`, false, /\.(png|jpe?g|svg)$/));
        break;
      case "TopLid":
        images = importAll(require.context(`../../../public/assets/CreateAssets/TopLid`, false, /\.(png|jpe?g|svg)$/));
        break;
      default:
        images = importAll(require.context(`../../../public/assets/CreateAssets/`, false, /\.(png|jpe?g|svg)$/));
    }
    Object.keys(images).map((key, value) => {
      // eslint-disable-next-line no-unused-expressions
      images[key].default[0] === "d"
        ? imgFiles.push(dataURLtoFile(images[key].default, key.slice(key.indexOf("/") + 1)))
        : imgList.push(images[key].default);
    });
    Promise.all(
      imgList.map((img) => {
        return imageURLtoFile(img);
      })
    )
      .then((results) => {
        imgFiles.push(...results);
        return imgFiles;
      })
      .then((results) => {
        dispatch(addImage(handleAddAssets({ layerId: id, files: results, traits, layerTitle })));
      });
  };

  return (
    <div className={classes.container}>
      <section className={classes.layer}>
        <div className={classes.heading}>
          <h3 className={classes.title}>{layerTitle}</h3>
          {traits.length ? (
            <div className={classes.btnContainer}>
              <button onClick={() => fileRef.current.click()} className={classes.upload}>
                <UploadIcon className={classes.uploadIcon} /> Upload
              </button>
              <button type="button" onClick={handleBlank} className={classes.addBlank}>
                <AddIcon className={classes.addIcon} /> Add blank
              </button>
            </div>
          ) : null}
        </div>
        {/* list of images */}
        <div className={classes.wrapper}>
          {traits.length ? (
            traits.map((trait, idx) => (
              <ArtCard
                key={idx}
                index={idx}
                layerTitle={layerTitle}
                trait={trait}
                layerId={id}
                setActiveCard={(activeArtCard) => handleSetState({ activeCard: activeArtCard })}
                activeCard={activeCard}
              />
            ))
          ) : (
            <div onClick={() => fileRef.current.click()} className={classes.uploadCard}>
              <AddCircularIcon />
              <div>Upload images</div>
              <div>(Image/png, max file size: 2MB per image)</div>
              <button className={classes.uploadBtn}>
                <UploadIcon className={classes.uploadIcon} /> Browse Files
              </button>
            </div>
          )}
        </div>
      </section>

      <input
        onChange={(event) => dispatch(addImage(handleFileChange({ layerId: id, event, traits, layerTitle, dispatch })))}
        ref={fileRef}
        style={{ display: "none" }}
        type="file"
        name="avatar"
        id="avatar"
        accept="image/png"
        multiple
      />
    </div>
  );
};

export default CollectionMenu;
