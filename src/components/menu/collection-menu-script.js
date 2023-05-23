/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
import { v4 as uuid } from "uuid";
import { setImageAction, setLayers, setOverlay } from "../../gen-state/gen.actions";
import { dataURItoBlob, handleBlankImage, getFile } from "../../utils";

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

export const handleSampleLayers = async ({ dispatch }) => {
  dispatch(setOverlay(true));
  const url = {
    Green10: "/assets/CreateAssets/Goo/Green10.png",
    High30: "/assets/CreateAssets/TopLid/High30.png",
    Middle50: "/assets/CreateAssets/TopLid/Middle50.png",
    High20: "/assets/CreateAssets/BottomLid/High20.png",
    Low40: "/assets/CreateAssets/BottomLid/Low40.png",
    Cyan1: "/assets/CreateAssets/EyeColor/Cyan1.png",
    Yellow10: "/assets/CreateAssets/EyeColor/Yellow10.png",
  };

  // mapUrlToFile
  const file = {};
  await Promise.all(
    Object.keys(url).map(async (key) => {
      file[key] = await getFile(url[key], `${key}.png`, "image/png");
    })
  );

  const layers = [
    {
      id: uuid(),
      layerTitle: "Goo",
      traitsAmount: 1,
      traits: [{ traitTitle: "Green10", Rarity: "1", image: file["Green10"] }],
    },
    {
      id: uuid(),
      layerTitle: "Top Lid",
      traitsAmount: 2,
      traits: [
        { traitTitle: "High30", Rarity: "1", image: file["High30"] },
        { traitTitle: "Middle50", Rarity: "1", image: file["Middle50"] },
      ],
    },
    {
      id: uuid(),
      layerTitle: "Bottom Lid",
      traitsAmount: 2,
      traits: [
        { traitTitle: "High20", Rarity: "1", image: file["High20"] },
        { traitTitle: "Low40", Rarity: "1", image: file["Low40"] },
      ],
    },
    {
      id: uuid(),
      layerTitle: "Eye Color",
      traitsAmount: 2,
      traits: [
        { traitTitle: "Cyan1", Rarity: "1", image: file["Cyan1"] },
        { traitTitle: "Yellow10", Rarity: "1", image: file["Yellow10"] },
      ],
    },
  ];

  dispatch(setLayers(layers));
  dispatch(setOverlay(false));
};
