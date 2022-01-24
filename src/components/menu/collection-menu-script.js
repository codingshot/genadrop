import { handleBlankImage, handleImage } from "../utils";

export const handleFileChange = props => {
  const { event, traits, layerTitle } = props;

  const { files } = event.target;
  let imageFiles = Object.values(files);
  let uniqueImageFile = [...traits];
  let filterArr = traits.map(({ image }) => image.name);

  imageFiles.forEach(imageFile => {
    if (!filterArr.includes(imageFile.name)) {
      uniqueImageFile.push({ traitTitle: imageFile.name, Rarity: "1", image: imageFile })
      filterArr.push(imageFile.name)
    }
  })
  return { layerTitle, traits: uniqueImageFile }
}

export const dataURItoBlob = dataURI => {

  let byteString = atob(dataURI.split(',')[1]);
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  let blob = new Blob([ab], { type: mimeString });
  return blob;
}

export const handleAddBlank = async props => {
  const { canvas, img, traits, layerTitle } = props;
  await handleBlankImage({ canvas, img })
  const imageUrl = canvas.toDataURL();
  let imageFile = new File([dataURItoBlob(imageUrl)], "blank_image");
  let uniqueImageFile = [...traits];
  let filterArr = traits.map(({ image }) => image.name);
  if (!filterArr.includes(imageFile.name)) {
    uniqueImageFile.push({ traitTitle: imageFile.name, Rarity: "1", image: imageFile })
  }
  return { layerTitle, traits: uniqueImageFile }
}

export const getCombinations = layers => {
  const amtArr = layers.map(layer => layer.traitsAmount);
  const count = amtArr.reduce((acc, curr) => (
    acc * curr
  ), 1)

  return count
}