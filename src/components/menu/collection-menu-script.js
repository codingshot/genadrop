import { handleBlankImage } from "../../utils";

export const handleFileChange = (props) => {
  const { layerId, event, traits, layerTitle } = props;

  const { files } = event.target;
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

export const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  return blob;
};

export const handleAddBlank = async (props) => {
  const { canvas, img, traits, layerTitle, layerId } = props;
  await handleBlankImage({ canvas, img });
  const imageUrl = canvas.toDataURL("image/webp", 1);
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

export const getCombinations = (layers) => {
  const amtArr = layers.map((layer) => layer.traitsAmount);
  const count = amtArr.reduce((acc, curr) => acc * curr, 1);

  return count;
};
