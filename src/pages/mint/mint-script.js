import JSZip from "jszip";

export const extractZip = async (zip) => {
  const new_zip = new JSZip();
  const unzipped = await new_zip.loadAsync(zip);
  const collection = [];
  let metadata = null;
  Object.keys(unzipped.files).forEach((file) => {
    let blob = null;
    let string = null;
    const uint8array = unzipped.files[file]._data.compressedContent;
    const fileType = file.split(".")[1]?.toLowerCase();
    if (fileType === "json") {
      string = new TextDecoder().decode(uint8array);
      blob = new Blob([new Uint8Array(uint8array).buffer], {
        type: "application/json",
      });
      metadata = JSON.parse(string);
    } else {
      string = new TextDecoder().decode(uint8array);
      blob = new Blob([new Uint8Array(uint8array).buffer], {
        type: `image/${fileType}`,
      });
      const imageFile = new File([blob], file, {
        type: `image/${fileType}`,
      });
      collection.push(imageFile);
    }
  });
  return { metadata, collection };
};
export const handleZipFile = async (arg) => {
  const { upladedFile, handleSetState } = arg;
  const { metadata, collection } = await extractZip(upladedFile);
  handleSetState({ file: collection, metadata });
};
