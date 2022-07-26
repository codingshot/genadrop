import { setImageAction } from "../../gen-state/gen.actions";
import { dataURItoBlob, handleBlankImage, handleTemplateImage } from "../../utils";

export const handleFileChange = (props) => {
  const { layerId, event, traits, layerTitle, dispatch } = props;

  const { files } = event.target;
  const imageFiles = Object.values(files);
  const currentImageFiles = [...traits];
  const filterArr = traits.map(({ image }) => image.name);

  let newImageFiles = [];
  imageFiles.forEach((imageFile) => {
    if (!filterArr.includes(imageFile.name)) {
      newImageFiles.push({
        traitTitle: imageFile.name.split(".")[0],
        Rarity: "1",
        image: imageFile,
      });
      filterArr.push(imageFile.name);
    }
  });

  dispatch(
    setImageAction({
      type: "upload",
      value: {
        id: layerId,
        traits: newImageFiles,
      },
    })
  );
  return { layerId, layerTitle, traits: currentImageFiles.concat(newImageFiles) };
};

export const handleAddAssets = (props) => {
  const { layerId, files, traits, layerTitle } = props;
  const imageFiles = Object.values(files);
  const uniqueImageFile = [...traits];
  const filterArr = traits.map(({ image }) => image.name);

  imageFiles.forEach((imageFile) => {
    if (!filterArr.includes(imageFile.name)) {
      uniqueImageFile.push({
        traitTitle: imageFile.name.split(".")[0],
        Rarity: "1",
        image: imageFile,
      });
      filterArr.push(imageFile.name);
    }
  });
  return { layerId, layerTitle, traits: uniqueImageFile };
};

export const handleAddBlank = async (props) => {
  const { canvas, img, traits, layerTitle, layerId, imageQuality } = props;
  await handleBlankImage({ canvas, img });
  const imageUrl = canvas.toDataURL("image/webp", imageQuality);
  const imageFile = new File([dataURItoBlob(imageUrl)], "");
  const uniqueImageFile = [...traits];
  const filterArr = traits.map(({ image }) => image.name);
  if (!filterArr.includes(imageFile.name)) {
    uniqueImageFile.push({
      traitTitle: "blank",
      Rarity: "1",
      image: imageFile,
    });
  }
  return { layerId, layerTitle, traits: uniqueImageFile };
};

export const handleAddTemplates = async (props) => {
  const { canvas, img, traits, layerTitle, layerId, imgName } = props;
  let drawed = false;
  drawed = await handleTemplateImage({ img, canvas });
  if (drawed) {
    const imageUrl = canvas.toDataURL("image/webp", 1);
    const imageFile = new File([dataURItoBlob(imageUrl)], imgName, { type: "image/jpeg" });
    const uniqueImageFile = [...traits];
    const filterArr = traits.map(({ image }) => image.name);
    if (!filterArr.includes(imageFile.name)) {
      uniqueImageFile.push({
        traitTitle: "sampleImage" + img,
        Rarity: "1",
        image: imageFile,
      });
    }
    return { layerId, layerTitle, traits: uniqueImageFile };
  }
};
