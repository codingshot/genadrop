/* eslint-disable no-return-await */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable func-names */
import { dataURItoBlob } from "../../utils";

const getFile = ({ imageUrl, fileName, fileType }) => {
  const imageFile = new File([dataURItoBlob(imageUrl)], fileName, { type: `image/${fileType}` });
  return imageFile;
};

const delay = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 0);
  });
};

const getBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject("Error: ", error);
    };
  });
};

export const saveLayers = async ({ layers }) => {
  const newLayers = await Promise.all(
    layers.map(async ({ traits, ...othersLayerProps }) => {
      const newTrait = await Promise.all(
        traits.map(async ({ image, ...otherTraits }) => {
          const name = image.name.replace(/\.+\s*\./, ".").split(".");
          const fileName = image.name;
          const fileType = name.slice(name.length - 1).join();
          const loadImage = async () => {
            const dataUrl = await getBase64(image);
            return { image: dataUrl, fileName, fileType, ...otherTraits };
          };
          return await loadImage();
        })
      );
      return { traits: newTrait, ...othersLayerProps };
    })
  );
  const cache = JSON.stringify(newLayers);
  window.sessionStorage.storedLayers = cache;
};

export const saveNftLayers = async ({ nftLayers }) => {
  const cache = JSON.stringify(nftLayers);
  window.sessionStorage.storedNftLayers = cache;
};

export const fetchNftLayers = async () => {
  if (!window.sessionStorage.storedNftLayers) return [];
  // delay function is a hack to get one machine cycle off javascript. This is to ensure that the color to window sessionstorage has returned;
  await delay();
  return JSON.parse(window.sessionStorage.storedNftLayers);
};

export const fetchLayers = async () => {
  if (!window.sessionStorage.storedLayers) return [];
  await delay();
  const layers = JSON.parse(window.sessionStorage.storedLayers);
  const newLayers = await Promise.all(
    layers.map(async ({ traits, ...othersLayerProps }) => {
      const newTrait = await Promise.all(
        traits.map(async ({ image, fileType, fileName, ...otherTraits }) => {
          const file = getFile({ imageUrl: image, fileType, fileName });
          return { image: file, ...otherTraits };
        })
      );
      return { traits: newTrait, ...othersLayerProps };
    })
  );
  return newLayers;
};

export const savePreview = async ({ preview }) => {
  const newPreview = await Promise.all(
    preview.map(async ({ imageFile, ...otherTraits }) => {
      const name = imageFile.name.replace(/\.+\s*\./, ".").split(".");
      const fileName = imageFile.name;
      const fileType = name.slice(name.length - 1).join();
      const loadImage = async () => {
        const dataUrl = await getBase64(imageFile);
        return { imageFile: dataUrl, fileName, fileType, ...otherTraits };
      };
      return await loadImage();
    })
  );
  const cache = JSON.stringify(newPreview);
  window.sessionStorage.storedPreview = cache;
};

export const fetchPreview = async () => {
  if (!window.sessionStorage.storedPreview) return [];
  const preview = JSON.parse(window.sessionStorage.storedPreview);
  await delay();
  const newPreview = await Promise.all(
    preview.map(async ({ imageFile, fileType, fileName, ...otherTraits }) => {
      const file = getFile({ imageUrl: imageFile, fileType, fileName });
      return { imageFile: file, ...otherTraits };
    })
  );
  return newPreview;
};

export const saveRule = async ({ rule }) => {
  const newRule = await Promise.all(
    rule.map(async (r) => {
      const newLayer = await Promise.all(
        r.map(async ({ imageFile, ...otherTraits }) => {
          const name = imageFile.name.replace(/\.+\s*\./, ".").split(".");
          const fileName = imageFile.name;
          const fileType = name.slice(name.length - 1).join();
          const loadImage = async () => {
            const dataUrl = await getBase64(imageFile);
            return { imageFile: dataUrl, fileName, fileType, ...otherTraits };
          };
          return await loadImage();
        })
      );
      return [...newLayer];
    })
  );
  const cache = JSON.stringify(newRule);
  window.sessionStorage.storedRule = cache;
};

export const fetchRules = async () => {
  if (!window.sessionStorage.storedRule) return [];
  const rule = JSON.parse(window.sessionStorage.storedRule);
  await delay();
  const newRule = await Promise.all(
    rule.map(async (r) => {
      const newLayer = await Promise.all(
        r.map(async ({ imageFile, fileType, fileName, ...otherTraits }) => {
          const file = getFile({ imageUrl: imageFile, fileType, fileName });
          return { imageFile: file, ...otherTraits };
        })
      );
      return [...newLayer];
    })
  );
  return newRule;
};

export const saveUserData = ({
  layers,
  nftLayers,
  rule,
  preview,
  collectionName,
  sessionId,
  upgradePlan,
  proposedPlan,
  currentPlan,
  currentUser,
}) => {
  saveLayers({ layers });
  saveNftLayers({ nftLayers });
  saveRule({ rule });
  savePreview({ preview });
  const data = {
    collectionName,
    sessionId,
    upgradePlan,
    proposedPlan,
    currentPlan,
    currentUser,
  };
  window.sessionStorage.otherInfo = JSON.stringify(data);
  window.sessionStorage.isStripe = "true";
};

export const fetchUserData = async () => {
  const layers = await fetchLayers();
  const nftLayers = await fetchNftLayers();
  const preview = await fetchPreview();
  const rule = await fetchRules();
  const { collectionName, sessionId, upgradePlan, proposedPlan, currentPlan, currentUser } = JSON.parse(
    window.sessionStorage.otherInfo
  );
  return {
    layers,
    nftLayers,
    preview,
    rule,
    collectionName,
    sessionId,
    upgradePlan,
    proposedPlan,
    currentPlan,
    currentUser,
  };
};
