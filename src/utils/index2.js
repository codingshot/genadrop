/* eslint-disable no-await-in-loop */
import fileDownload from "js-file-download";
import JSZip from "jszip";
import { setToggleUpgradeModal } from "../gen-state/gen.actions";

export const getAweaveFormat = async (nftLayers, dispatch, setLoader) => {
  const clone = [];
  for (let i = 0; i < nftLayers.length; i += 1) {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        dispatch(
          setLoader(
            `getting metadata ready for download
${i + 1} of ${nftLayers.length}`
          )
        );
        const fileType =
          nftLayers[i].image.split(";base64")[0].split("image/")[1] === "webp"
            ? "png"
            : nftLayers[i].image.split(";base64")[0].split("image/")[1];
        clone.push({
          name: nftLayers[i].name,
          image: `${nftLayers[i].name}.${fileType}`,
          description: nftLayers[i].description,
          attributes: nftLayers[i].attributes,
          symbol: "",
          seller_fee_basis_points: "",
          external_url: "",
          collection: {
            name: nftLayers[i].name,
            family: "",
          },
          properties: {
            creators: [
              {
                address: "",
                share: 100,
              },
            ],
          },
        });
        resolve();
      }, 0);
    });
    await promise;
  }
  dispatch(setLoader(""));
  return clone;
};

export const getIpfsFormat = async (nftLayers, dispatch, setLoader) => {
  const clone = [];
  for (let i = 0; i < nftLayers.length; i += 1) {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        dispatch(
          setLoader(
            `getting metadata ready for download
${i + 1} of ${nftLayers.length}`
          )
        );
        const fileType =
          nftLayers[i].image.split(";base64")[0].split("image/")[1] === "webp"
            ? "png"
            : nftLayers[i].image.split(";base64")[0].split("image/")[1];
        clone.push({
          name: nftLayers[i].name,
          image: `${nftLayers[i].name}.${fileType}`,
          description: nftLayers[i].description,
          attributes: nftLayers[i].attributes,
        });
        resolve();
      }, 0);
    });
    await promise;
  }
  dispatch(setLoader(""));
  return clone;
};

export const paginate = (input, count) => {
  const countPerPage = count;
  const numberOfPages = Math.ceil(input.length / countPerPage);
  let startIndex = 0;
  let endIndex = startIndex + countPerPage;
  const paginateObj = {};
  for (let i = 1; i <= numberOfPages; i += 1) {
    paginateObj[i] = input.slice(startIndex, endIndex);
    startIndex = endIndex;
    endIndex = startIndex + countPerPage;
  }
  return paginateObj;
};

const downloadCallback = async (props) => {
  const { value, name, outputFormat, dispatch, setLoader, setZip, id } = props;
  const zip = new JSZip();
  if (outputFormat.toLowerCase() === "arweave") {
    const aweave = await getAweaveFormat(value, dispatch, setLoader, id);
    aweave.forEach((data) => {
      zip.file(`${data.name}.json`, JSON.stringify(data, null, "\t"));
    });
  } else {
    zip.file("metadata.json", JSON.stringify(await getIpfsFormat(value, dispatch, setLoader, id), null, "\t"));
  }
  for (let i = 0; i < value.length; i += 1) {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        dispatch(
          setLoader(
            `getting assets ready for download
${i + 1} of ${value.length}`
          )
        );
        let base64String;
        if (value[i].image.includes("data:image/gif")) {
          base64String = value[i].image.replace("data:image/gif;base64,", "");
          zip.file(`${value[i].name}.gif`, base64String, { base64: true });
        } else {
          base64String = value[i].image.replace("data:image/webp;base64,", "");
          zip.file(`${value[i].name}.png`, base64String, { base64: true });
        }
        resolve();
      }, 0);
    });
    await promise;
  }
  dispatch(setLoader("zipping...."));
  const content = await zip.generateAsync({ type: "blob" });

  dispatch(
    setZip({
      name,
      file: content,
    })
  );
  fileDownload(content, `${name}.zip`);
  dispatch(setLoader(""));
};

// eslint-disable-next-line consistent-return
export const handleDownload = async (input) => {
  const { value, dispatch, setZip, setNotification, name, currentPlan } = input;
  // if (currentPlan === "free") {
  //   dispatch(setToggleUpgradeModal(true));
  //   return;
  // }
  if (!name) {
    return dispatch(
      setNotification({
        message: "please, name your collection and try again.",
        type: "warning",
      })
    );
  }
  const paginated = paginate(value, 1000);
  const index = Object.keys(paginated).length;
  dispatch(
    setNotification({
      message: `your asset will be downloaded in ${index} ${index === 1 ? "batch" : "batches"}`,
      type: "default",
    })
  );
  for (let i = 1; i <= index; i += 1) {
    await downloadCallback({ ...input, id: i, value: paginated[i], setZip });
  }
  dispatch(
    setNotification({
      message: "downloaded successfully",
      type: "success",
    })
  );
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("zip file loaded");
    }, 0);
  });
};
