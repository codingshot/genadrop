import React, { useEffect, useRef, useContext } from "react";
import classes from "./collection-preview.module.css";
import { GenContext } from "../../gen-state/gen.context";
import { getImageSize } from "../../utils";
import ButtonClickEffect from "../button-effect/button-effect";
import { setPreview } from "../../gen-state/gen.actions";
import { handleImage } from "./collection-preview-script";

const CollectionPreview = () => {
  const { dispatch, layers, preview } = useContext(GenContext);
  const canvasRef = useRef(null);

  const handleDownload = async () => {
    const { width, height } = await getImageSize(layers[0].traits[0].image);
    const canvas = document.createElement("canvas");
    await handleImage({ layers, preview, canvas, height, width });
    const image = canvas.toDataURL("image/webp", 1);
    const link = document.createElement("a");
    link.download = "asset.png";
    link.href = image;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const imageHandler = async () => {
      const canvas = canvasRef.current;
      await handleImage({ layers, preview, canvas, height: 250, width: 250 });
    };
    imageHandler();
  }, [preview]);

  useEffect(() => {
    const newPreview = [];
    [...layers].forEach(({ id, layerTitle }) => {
      preview.forEach((p) => {
        if (id === p.layerId) {
          newPreview.push({ ...p, layerTitle });
        }
      });
    });
    dispatch(setPreview(newPreview));
  }, [layers]);

  return (
    <div className={classes.container}>
      <canvas className={classes.canvas} ref={canvasRef} />
      {preview.length ? (
        <button type="button" onClick={handleDownload}>
          <ButtonClickEffect>Download</ButtonClickEffect>
        </button>
      ) : null}
    </div>
  );
};

export default CollectionPreview;
