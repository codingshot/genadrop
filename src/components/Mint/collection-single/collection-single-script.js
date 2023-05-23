import JSZip from "jszip";

// function _arrayBufferToBase64(buffer) {
//   let binary = "";
//   const bytes = new Uint8Array(buffer);
//   const len = bytes.byteLength;
//   for (let i = 0; i < len; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return window.btoa(binary);
// }

export const extractZip = async (zip) => {
  const new_zip = new JSZip();

  const unzipped = await new_zip.loadAsync(zip);

  const collection = [];
  let metadata = null;
  await Promise.all(
    Object.keys(unzipped.files).map(async (file) => {
      const fileType = file.split(".")[1]?.toLowerCase();
      if (fileType === "json") {
        const content = await unzipped.files[file].async("string");
        // string = new TextDecoder().decode(uint8array);
        // blob = new Blob([new Uint8Array(uint8array).buffer], {
        //   type: "application/json",
        // });
        metadata = JSON.parse(content);
      } else {
        // string = new TextDecoder().decode(uint8array);
        const content = await unzipped.files[file].async("arraybuffer");
        const blob = new Blob([content], {
          type: `image/${fileType}`,
        });
        const imageFile = new File([blob], file, {
          type: `image/${fileType}`,
        });
        collection.push(imageFile);
      }
    })
  );

  return { metadata, collection };
};

export const handleZipFile = async (arg) => {
  const { uploadedFile, handleSetState } = arg;
  try {
    const { metadata, collection } = await extractZip(uploadedFile);
    handleSetState({ file: collection, metadata });
  } catch (error) {
    console.error(`failed with ${error}`);
  }
};

export const updateZip = async (zip, name, handleSetState) => {
  const new_zip = new JSZip();
  const unzipped = await new_zip.loadAsync(zip);
  // selected image values
  const pic = { ...unzipped.files[name] };
  // index[0] image values
  const index1 = { ...unzipped.files[Object.keys(unzipped.files)[1]] };

  // swaping name values
  unzipped.files[name].name = index1.name;

  unzipped.files[Object.keys(unzipped.files)[1]].name = pic.name;

  // swaping key's value
  const selectedImage = unzipped.files[name];
  unzipped.files[name] = unzipped.files[Object.keys(unzipped.files)[1]];
  unzipped.files[Object.keys(unzipped.files)[1]] = selectedImage;

  // updating metaData
  let string = await unzipped.files["metadata.json"].async("string");
  // console.log("the outcome", string)
  // let string = new TextDecoder().decode(unzipped.files["metadata.json"]._data.compressedContent);
  const metadata = JSON.parse(string);
  const index = metadata.findIndex((object) => {
    return object.image === name;
  });
  const a = { ...metadata[index] };
  const b = { ...metadata[0] };
  a.name = metadata[0].name;
  a.image = metadata[0].image;
  b.name = metadata[index].name;
  b.image = metadata[index].image;
  const newMetaData = [];
  metadata.forEach((object, indx) => {
    if (indx === 0) {
      newMetaData.push(a);
    } else if (indx === index) {
      newMetaData.push(b);
    } else {
      newMetaData.push(object);
    }
  });
  string = JSON.stringify(newMetaData, null, "\t");
  unzipped.file("metadata.json", string);

  // Generates a complete zip with the new values
  const uploadedFile = await unzipped.generateAsync({ type: "blob" });

  // update the stats
  handleSetState({ zip: uploadedFile });
  handleZipFile({ uploadedFile, handleSetState });
};

// export const handleZipFile = async (arg) => {
//   const { uploadedFile, handleSetState } = arg;
//   try {
//     const { metadata, collection } = await extractZip(uploadedFile);
//     handleSetState({ file: collection, metadata });
//   } catch (error) {
//     console.error(`failed with ${error}`);
//   }
// };
// export const updateZip = async (zip, name, handleSetState) => {
//   const new_zip = new JSZip();
//   const unzipped = await new_zip.loadAsync(zip, { base64: true });
//   const newZip = new JSZip();
//   let metadata;
//   let string;
//   console.log(unzipped.files);
//   Object.keys(unzipped.files).forEach(async (file, idx) => {
//     const uint8array = unzipped.files[file]._data.compressedContent;
//     const fileType = file.split(".")[1]?.toLowerCase();
//     if (idx === 1) {
//       const uint8arra = unzipped.files[name]._data.compressedContent;
//       const base64String = _arrayBufferToBase64(uint8arra);
//       newZip.file(file, base64String, { base64: true });
//     } else if (fileType === "json") {
//       string = new TextDecoder().decode(uint8array);
//       metadata = JSON.parse(string);
//       const index = metadata.findIndex((object) => {
//         return object.image === name;
//       });
//       const a = { ...metadata[index] };
//       const b = { ...metadata[0] };
//       a.name = metadata[0].name;
//       a.image = metadata[0].image;
//       b.name = metadata[index].name;
//       b.image = metadata[index].image;
//       const newMetaData = [];
//       metadata.forEach((object, indx) => {
//         if (indx === 0) {
//           newMetaData.push(a);
//         } else if (indx === index) {
//           newMetaData.push(b);
//         } else {
//           newMetaData.push(object);
//         }
//       });
//       string = JSON.stringify(newMetaData, null, "\t");

//       newZip.file("metadata.json", string);
//     } else if (file !== name) {
//       const uint8arra = unzipped.files[file]._data.compressedContent;
//       const base64String = _arrayBufferToBase64(uint8arra);
//       newZip.file(file, base64String, { base64: true });
//     } else if (file === name) {
//       const uint8arra = unzipped.files[Object.keys(unzipped.files)[1]]._data.compressedContent;
//       const base64String = _arrayBufferToBase64(uint8arra);
//       newZip.file(name, base64String, { base64: true });
//     }
//   });

//   const uploadedFile = await newZip.generateAsync({ type: "blob" });
//   handleSetState({ zip: uploadedFile });
//   handleZipFile({ uploadedFile, handleSetState });
// };
