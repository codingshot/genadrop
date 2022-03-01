import JSZip from 'jszip';

export const handleZipFile = async arg => {
  const { file, handleSetState } = arg;
  const { metadata, collection } = await extractZip(file);
  handleSetState({ file: collection, metadata, fileName: file.name })
}

export const extractZip = async zip => {
  const new_zip = new JSZip();
  const unzipped = await new_zip.loadAsync(zip);
  const collection = [];
  let metadata = null;

  for (let file in unzipped.files) {
    let blob = null;
    let string = null;
    let uint8array = unzipped.files[file]["_data"]["compressedContent"]
    let fileType = file.split('.')[1].toLowerCase();
    if (fileType === 'json') {
      string = new TextDecoder().decode(uint8array);
      blob = new Blob([new Uint8Array(uint8array).buffer], { type: 'application/json' });
      metadata = JSON.parse(string);
    } else {
      string = new TextDecoder().decode(uint8array);
      blob = new Blob([new Uint8Array(uint8array).buffer], { type: `image/${fileType}` });
      let imageFile = new File([blob], file, {
        type: `image/${fileType}`
      });
      collection.push(imageFile)
    }
  }
  return { metadata, collection }
}